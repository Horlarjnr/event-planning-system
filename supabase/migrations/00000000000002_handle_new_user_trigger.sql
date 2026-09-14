-- Creates a profiles row automatically whenever a new auth.users row is created.
-- Reads an optional "role" out of signup metadata (set by the app's Register
-- page) so a vendor signup gets role='vendor' immediately, with no separate
-- follow-up update call (which was prone to an RLS/timing race condition).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
