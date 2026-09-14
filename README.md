# EventEase — Event Planning and Booking Management System

Brand: deep navy-blue (#0C447C) + amber accent (#854F0B). Logo: pin-check mark.
Naming convention: everything in code/DB uses "Venue" (Venue type, venueService,
VenueDetails, Venue.tsx page). "Event Centre" is UI copy only.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local`, fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. `supabase login`
4. `supabase link --project-ref YOUR_REF`
5. `supabase db push` — applies all 6 migrations in order:
   - `00000000000001_initial_schema.sql` — enums + all 8 tables
   - `00000000000002_handle_new_user_trigger.sql` — auto-creates profile on signup, reads role from signup metadata
   - `00000000000003_rls_policies.sql` — core policies (profiles, public venue/caterer read, customer events/bookings, vendor bookings)
   - `00000000000004_admin_and_availability_policies.sql` — admin full access, vendor CRUD on own listings, availability
   - `00000000000005_storage_setup.sql` — creates `listing-images` bucket + storage policies
   - `00000000000006_account_deletion.sql` — soft-delete column + `request_account_deletion()` RPC used by the profile pages' Danger Zone
6. Register a test user through the app, then seed data:
   - Open `supabase/seed_example.sql`
   - Replace `REPLACE_WITH_REAL_PROFILE_ID` with a real profile id
   - For real vendor-dashboard testing, run additional `update vendors set user_id = '...' where business_name = '...'` statements to spread the 10 seeded businesses across a few distinct real accounts (see inline comments in the seed file)
7. To become an admin: manually run `update profiles set role = 'admin' where email = 'your-test-account@example.com';` — there is intentionally no public UI to self-assign admin
8. `npm run dev`

## Feature status — ALL STAGES COMPLETE

- **Stage 1** — Project setup (Vite + React + TS + Tailwind)
- **Stage 2** — Supabase schema, 8 tables, trigger
- **Stage 3** — Auth, role-based routing, protected routes
- **Stage 4** — Public browsing: Home, Venues, Caterers, details pages, search/filter
- **Stage 5** — Customer flow: multi-step event creation → venue → caterer → package → review → booking submission → My Bookings
- **Stage 6** — Vendor: dashboard, accept/reject bookings, profile setup form, manage venues/caterer+packages (with image upload), manage venue availability, edit profile
- **Stage 7** — Admin: dashboard with platform-wide counts, manage users (view/roles), manage vendors (approve/suspend), manage venues (delete), manage caterers (delete), manage bookings (view all)
- **Stage 8** — Storage: `listing-images` bucket, `ImageUpload` component wired into venue/caterer forms
- **Stage 9** — RLS: full policy set across all 8 tables + storage (see migration 3, 4, 5)
- **Stage 10** — Responsive mobile nav added; see testing checklist below

## Manual testing checklist (run this before considering it "done")

**Auth**
- [ ] Register as customer → role is `customer` immediately, no manual fix needed
- [ ] Register as vendor → role is `vendor` immediately
- [ ] Login/logout works, session persists on refresh

**Customer flow**
- [ ] Browse `/venues`, search + capacity + price filters work
- [ ] Browse `/caterers`, search + cuisine filter works
- [ ] View a venue's details, click "Book this venue"
- [ ] Complete all 5 steps of event creation, submit
- [ ] New booking appears in `/customer/bookings` with status "pending" and correct total

**Vendor flow**
- [ ] New vendor account with no business sees the profile setup form (not a blank page)
- [ ] Submitting the form creates a `vendors` row with status "pending"
- [ ] Vendor dashboard shows correct booking counts
- [ ] "Manage services" lets a venue vendor add a venue (with image upload) and delete it
- [ ] "Manage services" lets a caterer vendor create their profile + add/delete packages
- [ ] "Manage availability" lets a venue vendor mark dates unavailable
- [ ] Accept/decline a pending booking — status updates immediately, customer's My Bookings reflects it

**Admin flow**
- [ ] Manually promote one account to `role = 'admin'`
- [ ] Admin dashboard shows correct platform-wide counts
- [ ] Approve a pending vendor → status flips to "approved"
- [ ] Suspend an approved vendor → status flips to "suspended"
- [ ] Delete a venue/caterer from admin — disappears from public `/venues` or `/caterers`

**Responsiveness**
- [ ] Resize browser below 640px — navbar collapses into hamburger menu
- [ ] Venue/caterer grids stack to a single column on mobile
- [ ] Forms remain usable (no horizontal scroll) on a small viewport

**RLS sanity checks**
- [ ] A customer cannot see another customer's bookings (query `/customer/bookings` while logged in as two different accounts)
- [ ] A vendor only sees bookings tied to their own venues/caterers, never someone else's
- [ ] Logged-out visitors can still browse `/venues` and `/caterers` (public read works)

## Deployment (Vercel)

1. Push this repo to GitHub
2. In Vercel: New Project → import the repo
3. Framework preset: Vite
4. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Vercel auto-detects `npm run build` and serves `dist/`
6. In Supabase dashboard → Authentication → URL Configuration, add your Vercel domain to the allowed redirect URLs (needed for auth to work in production)

## Update: Profile, account & UI polish pass

This revision added a full profile/account system on top of the existing app, without touching any working booking/vendor/admin logic.

**New — run this migration too:**
- `00000000000006_account_deletion.sql` — adds `profiles.deleted_at` + a `request_account_deletion()` RPC. Run `supabase db push` again to pick it up. Until this is applied, the "Delete account" button will show a clear error instead of silently doing nothing.
- `supabase/functions/delete-account/` — optional Edge Function stub for a true hard-delete (purges the `auth.users` row, which cascades via existing FKs). Not required for the app to work; see the comment header in that file for deploy steps if you want full data purge later instead of the soft-delete above.

**New for every role (customer, vendor, admin):**
- A real "Profile" page — avatar upload with type/size validation, remove photo, edit name/phone, and a Danger Zone with a confirmation-dialog-gated "Delete account".
- Vendor's Profile page now has both the personal Account section (new) and the existing Business profile section on one page.
- Avatars now show everywhere a user is represented — navbar (with a proper dropdown menu), dashboard sidebar/footer, mobile top bar — falling back to initials when no photo is set.
- A notification bell (desktop header + mobile top bar) surfaces each role's pending items: customers see bookings awaiting vendor confirmation, vendors see new booking requests, admins see vendors awaiting approval. It's sourced from data each dashboard already fetches — no new queries.
- Logo is now an icon mark (navy circle + pin) instead of a plain dot, matching the brand mark; still a single component (`Logo.tsx`), so swapping in a raster logo file later only means editing that one file.
- Login/Register password fields now have a show/hide toggle.

Everything above is wired to real Supabase calls (`profiles` table update, storage upload, the new RPC) — nothing is mocked or fake-succeeds.



- No online payments — bookings are explicitly "requests," per spec
- No ratings/reviews — no ratings column in schema; spec says don't fake them
- No messaging, decorators, photographers, DJs, etc. — explicitly future enhancements
- Vendor `user_id` linkage for seeded demo data must be manually assigned via SQL (see seed file) — a real vendor signing up through the app does not need this step, it's only a seed-data artifact
- Storage RLS policies are permissive for any authenticated user (not scoped per-vendor-folder) — acceptable for MVP trust level, worth tightening if this goes to real production with untrusted vendors
