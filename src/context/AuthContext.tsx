import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { getProfile } from '../features/auth/authService'
import type { Profile, UserRole } from '../types'

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  role: UserRole | null
  loading: boolean
  /** Re-fetch the current user's profile row — call after editing name/avatar/phone. */
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(currentUser: User | null) {
    if (!currentUser) {
      setProfile(null)
      return
    }
    try {
      const profileData = await getProfile(currentUser.id)
      // Defensive: a lingering local session for an account that requested
      // deletion should never be treated as logged in.
      if (profileData?.deleted_at) {
        await supabase.auth.signOut()
        setProfile(null)
        return
      }
      setProfile(profileData)
    } catch (err) {
      console.error('Failed to load profile:', err)
      setProfile(null)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      await loadProfile(session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      await loadProfile(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function refreshProfile() {
    await loadProfile(user)
  }

  const value: AuthContextValue = { user, profile, role: profile?.role ?? null, loading, refreshProfile }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
