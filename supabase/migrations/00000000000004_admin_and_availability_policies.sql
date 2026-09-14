-- =========================================
-- Admin full access — every table an admin needs to manage
-- =========================================

create policy "Admins can view all profiles"
  on profiles for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can view all vendors"
  on vendors for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can update all vendors"
  on vendors for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can update all venues"
  on venues for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can delete venues"
  on venues for delete
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can update all caterers"
  on caterers for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can delete caterers"
  on caterers for delete
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can view all bookings"
  on bookings for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can update all bookings"
  on bookings for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- =========================================
-- Vendors managing their own venue/caterer listings
-- (needed for ManageServices.tsx create/update/delete)
-- =========================================

create policy "Vendors can insert own venues"
  on venues for insert
  with check (vendor_id in (select id from vendors where user_id = auth.uid()));

create policy "Vendors can update own venues"
  on venues for update
  using (vendor_id in (select id from vendors where user_id = auth.uid()));

create policy "Vendors can delete own venues"
  on venues for delete
  using (vendor_id in (select id from vendors where user_id = auth.uid()));

create policy "Vendors can insert own caterer profile"
  on caterers for insert
  with check (vendor_id in (select id from vendors where user_id = auth.uid()));

create policy "Vendors can update own caterer profile"
  on caterers for update
  using (vendor_id in (select id from vendors where user_id = auth.uid()));

create policy "Vendors can insert own catering packages"
  on catering_packages for insert
  with check (caterer_id in (
    select id from caterers where vendor_id in (select id from vendors where user_id = auth.uid())
  ));

create policy "Vendors can update own catering packages"
  on catering_packages for update
  using (caterer_id in (
    select id from caterers where vendor_id in (select id from vendors where user_id = auth.uid())
  ));

create policy "Vendors can delete own catering packages"
  on catering_packages for delete
  using (caterer_id in (
    select id from caterers where vendor_id in (select id from vendors where user_id = auth.uid())
  ));

-- =========================================
-- Venue availability
-- =========================================

create policy "Public can view venue availability"
  on venue_availability for select
  using (true);

create policy "Vendors can manage own venue availability"
  on venue_availability for insert
  with check (venue_id in (
    select id from venues where vendor_id in (select id from vendors where user_id = auth.uid())
  ));

create policy "Vendors can update own venue availability"
  on venue_availability for update
  using (venue_id in (
    select id from venues where vendor_id in (select id from vendors where user_id = auth.uid())
  ));
