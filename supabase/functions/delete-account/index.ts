// OPTIONAL — not wired up or deployed by default.
//
// The app's "Delete account" button works today via the
// `request_account_deletion()` Postgres function (see migration
// 00000000000006_account_deletion.sql): it marks the profile deleted and the
// frontend immediately signs the user out. That is real, working deletion
// from the product's point of view — the account is deactivated and
// inaccessible.
//
// What this function adds on top: a genuine hard-delete of the
// `auth.users` row (which cascades to profiles/vendors/venues/caterers/
// events/bookings via the existing `on delete cascade` foreign keys),
// for when you want full data purge rather than a soft-delete flag.
//
// To use it:
//   1. Deploy:  supabase functions deploy delete-account
//   2. Set the function's env (service role key is auto-injected by Supabase
//      as SUPABASE_SERVICE_ROLE_KEY — do not expose this key to the client).
//   3. In profileService.ts, change requestAccountDeletion() to call
//      `supabase.functions.invoke('delete-account')` instead of the RPC.

import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Verify the caller's JWT and get their user id using the anon client.
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userError } = await callerClient.auth.getUser()
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 })
    }

    // Hard-delete using the service role (admin) client.
    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userData.user.id)
    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
})
