import { supabase } from '../../lib/supabaseClient'
import type { Profile, UserRole } from '../../types'

interface SignUpParams {
  email: string
  password: string
  fullName: string
  role: UserRole
}

interface SignInParams {
  email: string
  password: string
}

export async function signUp({ email, password, fullName, role }: SignUpParams) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role } },
  })
  if (error) throw error
  return data
}

export async function signIn({ email, password }: SignInParams) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data as Profile
}
