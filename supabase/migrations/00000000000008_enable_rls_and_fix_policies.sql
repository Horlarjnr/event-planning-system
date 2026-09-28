-- Enables Row Level Security on every table (fixes Supabase's
-- "rls_disabled_in_public" warning) and repairs gaps in the earlier policies
-- that would have broken the app or opened security holes once RLS is on.

-- =========================================
-- 1. Helper: is the current user an admin?
-- =========================================
-- The old admin policies queried "profiles" from inside a policy ON profiles,
-- which Postgres rejects with "infinite recursion detected in policy".
-- A SECURITY DEFINER function bypasses RLS for that one lookup.
create or replace function public.is_admin()
returns boolean
language sql

security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- =========================================
-- 2. Rebuild admin policies using is_admin()
-- =========================================
drop policy if exists "Admins can view all profiles" on profiles;
create policy "Admins can view all profiles"
  on profiles for select using (public.is_admin());

drop policy if exists "Admins can view all vendors" on vendors;
create policy "Admins can view all vendors"
  on vendors for select using (public.is_admin());

drop policy if exists "Admins can update all vendors" on vendors;
create policy "Admins can update all vendors"
  on vendors for update using (public.is_admin());

drop policy if exists "Admins can update all venues" on venues;
create policy "Admins can update all venues"
  on venues for update using (public.is_admin());

drop policy if exists "Admins can delete venues" on venues;
create policy "Admins can delete venues"
  on venues for delete using (public.is_admin());

drop policy if exists "Admins can update all caterers" on caterers;
create policy "Admins can update all caterers"
  on caterers for update using (public.is_admin());

drop policy if exists "Admins can delete caterers" on caterers;
create policy "Admins can delete caterers"
  on caterers for delete using (public.is_admin());

drop policy if exists "Admins can view all bookings" on bookings;
create policy "Admins can view all bookings"
  on bookings for select using (public.is_admin());

drop policy if exists "Admins can update all bookings" on bookings;
create policy "Admins can update all bookings"
  on bookings for update using (public.is_admin());

-- =========================================
-- 3. Missing policies the app needs
-- =========================================
-- Vendors edit their own vendor profile (VendorEditProfile page).
drop policy if exists "Vendors can update own vendor profile" on vendors;
create policy "Vendors can update own vendor profile"
  on vendors for update using (auth.uid() = user_id);

-- Vendors' booking lists join the "events" table (name, date, guest count),
-- but events were only readable by the customer who owns them.
drop policy if exists "Vendors can view events for their bookings" on events;
create policy "Vendors can view events for their bookings"
  on events for select
  using (
    id in (
      select event_id from bookings
      where venue_id in (select id from venues where vendor_id in (select id from vendors where user_id = auth.uid()))
         or caterer_id in (select id from caterers where vendor_id in (select id from vendors where user_id = auth.uid()))
    )
  );

drop policy if exists "Admins can view all events" on events;
create policy "Admins can view all events"
  on events for select using (public.is_admin());

-- New bookings must start as 'pending' (a customer can't self-confirm).
drop policy if exists "Customers can insert own bookings" on bookings;
create policy "Customers can insert own bookings"
  on bookings for insert
  with check (auth.uid() = customer_id and status = 'pending');

-- =========================================
-- 4. Block privilege escalation
-- =========================================
-- "Users can update own profile" would otherwise let anyone run
-- update profiles set role = 'admin' from the browser console.
-- auth.uid() is null in the SQL editor / service role, so your manual
-- "promote to admin" SQL still works.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'You are not allowed to change a user role';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Vendors must not approve themselves: force 'pending' on insert and only
-- let admins change status afterwards.
create or replace function public.protect_vendor_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.status := 'pending';
  elsif new.status is distinct from old.status then
    raise exception 'Only an admin can change vendor status';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_vendor_status on public.vendors;
create trigger protect_vendor_status
  before insert or update on public.vendors
  for each row execute function public.protect_vendor_status();

-- =========================================
-- 5. Turn RLS on (last, once every policy is in place)
-- =========================================
alter table public.profiles            enable row level security;
alter table public.vendors             enable row level security;
alter table public.venues              enable row level security;
alter table public.caterers            enable row level security;
alter table public.catering_packages   enable row level security;
alter table public.events              enable row level security;
alter table public.bookings            enable row level security;
alter table public.venue_availability  enable row level security;

-- Emergency rollback (only if something breaks badly; re-exposes your data):
-- alter table public.<table_name> disable row level security;
