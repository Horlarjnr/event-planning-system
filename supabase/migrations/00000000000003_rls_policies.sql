-- =========================================
-- PROFILES
-- =========================================
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Vendors need to read basic customer info for bookings tied to their own listings
create policy "Vendors can view customer profiles for their bookings"
  on profiles for select
  using (
    id in (
      select customer_id from bookings
      where venue_id in (select id from venues where vendor_id in (select id from vendors where user_id = auth.uid()))
         or caterer_id in (select id from caterers where vendor_id in (select id from vendors where user_id = auth.uid()))
    )
  );

-- =========================================
-- VENUES / CATERERS / CATERING PACKAGES — public read
-- =========================================
create policy "Public can view venues"
  on venues for select
  using (true);

create policy "Public can view caterers"
  on caterers for select
  using (true);

create policy "Public can view catering packages"
  on catering_packages for select
  using (true);

-- =========================================
-- EVENTS
-- =========================================
create policy "Customers can insert own events"
  on events for insert
  with check (auth.uid() = customer_id);

create policy "Customers can view own events"
  on events for select
  using (auth.uid() = customer_id);

-- =========================================
-- BOOKINGS
-- =========================================
create policy "Customers can insert own bookings"
  on bookings for insert
  with check (auth.uid() = customer_id);

create policy "Customers can view own bookings"
  on bookings for select
  using (auth.uid() = customer_id);

create policy "Vendors can view bookings for own venues"
  on bookings for select
  using (
    venue_id in (select id from venues where vendor_id in (select id from vendors where user_id = auth.uid()))
    or caterer_id in (select id from caterers where vendor_id in (select id from vendors where user_id = auth.uid()))
  );

create policy "Vendors can update bookings for own venues"
  on bookings for update
  using (
    venue_id in (select id from venues where vendor_id in (select id from vendors where user_id = auth.uid()))
    or caterer_id in (select id from caterers where vendor_id in (select id from vendors where user_id = auth.uid()))
  );

-- =========================================
-- VENDORS
-- =========================================
create policy "Vendors can view own vendor profile"
  on vendors for select
  using (auth.uid() = user_id);

create policy "Vendors can insert own vendor profile"
  on vendors for insert
  with check (auth.uid() = user_id);
