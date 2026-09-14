-- Fixes "type user_role does not exist" (Postgres error 42704) on signup.
--
-- The auth.users insert trigger runs in a session whose search_path does not
-- include "public" by default. handle_new_user() cast to the bare, unqualified
-- "user_role" enum, which Postgres could not resolve outside of public, so
-- every signup failed with a generic "Database error saving new user" from
-- Supabase Auth. Fixed by schema-qualifying the enum cast and pinning the
-- function's own search_path as a second safeguard.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'customer')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;
