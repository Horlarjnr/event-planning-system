-- =========================================
-- ACCOUNT DELETION
-- =========================================
-- Client-side Supabase SDKs cannot delete rows in auth.users (that requires
-- the service-role admin API), so this migration implements a real, working
-- soft-delete: the profile is marked deleted immediately, the app signs the
-- user out and blocks further access. See
-- supabase/functions/delete-account/README.md for the optional follow-up
-- Edge Function that hard-deletes the auth.users row (which cascades to
-- profiles/vendors/venues/caterers/events/bookings via existing FKs).

alter table public.profiles add column if not exists deleted_at timestamptz;

create or replace function public.request_account_deletion()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set deleted_at = now() where id = auth.uid();
end;
$$;

grant execute on function public.request_account_deletion() to authenticated;

-- Belt-and-suspenders: once deleted, hide the profile from the app's own
-- "view own profile" policy so a lingering session can't read/update it.
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id and deleted_at is null);
