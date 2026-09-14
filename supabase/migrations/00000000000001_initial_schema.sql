-- =========================================
-- ENUM TYPES
-- =========================================
create type user_role as enum ('customer', 'vendor', 'admin');
create type vendor_type as enum ('venue', 'caterer');
create type vendor_status as enum ('pending', 'approved', 'suspended');
create type booking_status as enum ('pending', 'confirmed', 'rejected', 'cancelled', 'completed');

-- =========================================
-- PROFILES
-- =========================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  role user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz default now()
);

-- =========================================
-- VENDORS
-- =========================================
create table vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  vendor_type vendor_type not null,
  business_name text not null,
  description text,
  phone text,
  email text,
  location text,
  status vendor_status not null default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================
-- VENUES
-- =========================================
create table venues (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  name text not null,
  description text,
  location text,
  capacity int,
  price numeric(10,2),
  facilities text[],
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================
-- CATERERS
-- =========================================
create table caterers (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  name text not null,
  description text,
  location text,
  cuisine_type text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================
-- CATERING PACKAGES
-- =========================================
create table catering_packages (
  id uuid primary key default gen_random_uuid(),
  caterer_id uuid not null references caterers(id) on delete cascade,
  name text not null,
  description text,
  price_per_person numeric(10,2) not null,
  minimum_guests int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================
-- EVENTS
-- =========================================
create table events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  event_type text,
  event_date date not null,
  guest_count int not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================
-- BOOKINGS
-- =========================================
create table bookings (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  customer_id uuid not null references profiles(id) on delete cascade,
  venue_id uuid references venues(id),
  caterer_id uuid references caterers(id),
  catering_package_id uuid references catering_packages(id),
  venue_price numeric(10,2),
  catering_price numeric(10,2),
  total_price numeric(10,2),
  status booking_status not null default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================
-- VENUE AVAILABILITY
-- =========================================
create table venue_availability (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  available_date date not null,
  is_available boolean default true,
  unique (venue_id, available_date)
);
