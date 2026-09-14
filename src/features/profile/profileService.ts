import { supabase } from '../../lib/supabaseClient'
import type { Profile } from '../../types'

interface UpdateMyProfileParams {
  fullName?: string
  phone?: string
  avatarUrl?: string | null
}

export async function updateMyProfile(userId: string, updates: UpdateMyProfileParams): Promise<Profile> {
  const payload: Record<string, unknown> = {}
  if (updates.fullName !== undefined) payload.full_name = updates.fullName
  if (updates.phone !== undefined) payload.phone = updates.phone
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data as Profile
}

/**
 * Deactivates the current user's account (soft delete).
 * Requires migration 00000000000006_account_deletion.sql to be applied —
 * if the `request_account_deletion` function doesn't exist yet, this throws
 * a clear error rather than pretending the account was deleted.
 */
export async function requestAccountDeletion(): Promise<void> {
  const { error } = await supabase.rpc('request_account_deletion')
  if (error) {
    throw new Error(
      error.message.includes('function') || error.message.includes('does not exist')
        ? 'Account deletion isn\'t set up yet — run migration 00000000000006_account_deletion.sql against your Supabase project first.'
        : error.message
    )
  }
}
