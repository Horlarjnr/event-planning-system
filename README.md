# EventEase

> A web platform connecting customers with event centres and caterers for browsing and booking.

**Live demo:** https://event-planning-system-six.vercel.app/
**Demo video:** [TODO: paste video link]

<!-- TODO: add a banner or the home page screenshot here -->

---

## Table of contents

1. [Problem, solution and audience](#1-problem-solution-and-audience)
2. [Features](#2-features)
3. [Screenshots](#3-screenshots)
4. [Tech stack](#4-tech-stack)
5. [Setup instructions](#5-setup-instructions)
6. [Test accounts](#6-test-accounts)
7. [Project structure](#7-project-structure)
8. [AI usage disclosure](#8-ai-usage-disclosure)
9. [Learning and growth](#9-learning-and-growth)
10. [Known limitations and future plans](#10-known-limitations-and-future-plans)
11. [Development timeline](#11-development-timeline)
12. [Credits](#12-credits)

---

## 1. Problem, solution and audience

### The problem
Planning an event usually means chasing vendors across phone calls, DMs and spreadsheets. A customer has to find a venue, find a caterer, check that both are free and affordable, and then negotiate with each one separately. Vendors, in turn, receive requests through scattered channels and have no single place to manage them.

### The solution
EventEase puts event centres (venues) and caterers on one platform. A customer can search and compare listings, then create an event and send a booking request for a venue and a caterer package in one guided flow. Vendors manage their own listings, availability and incoming requests from a dashboard, and an admin oversees the whole marketplace.

Bookings are **requests**, not paid reservations. There is no online payment in this version, and a booking only becomes confirmed when the vendor accepts it.

### Who it is for

| Audience | What they do on EventEase |
|---|---|
| **Customers** | Browse venues and caterers, plan an event, send booking requests, track their status |
| **Vendors** (venue owners and caterers) | List their business, manage services and availability, accept or decline requests |
| **Admins** | Approve or suspend vendors, moderate listings, oversee users and all bookings |

---

## 2. Features

### Customer
- Register and log in; after login you land directly on your dashboard
- Browse event centres with search, capacity and price filters
- Browse caterers with search and cuisine filters
- Venue and caterer detail pages (photos, facilities, packages)
- Five-step booking flow: event details → venue → caterer → catering package → review and submit
- **My Bookings** with live status (pending, confirmed, rejected, cancelled, completed)
- Dashboard, profile page with avatar upload, notification bell for bookings awaiting a vendor
- Light and dark mode
- Account deletion (soft delete) from a confirmation-gated Danger Zone

### Vendor
- Guided business profile setup on first login (venue or caterer)
- Dashboard with booking counts, a status donut chart and a weekly bookings chart
- Accept or decline incoming booking requests
- Manage venues, or a caterer profile with catering packages, including image upload
- Manage venue availability by marking dates unavailable
- Edit business and personal profile

### Admin
- Dashboard with platform-wide counts
- Manage users
- Approve or suspend vendors
- Remove venues and caterers
- View all bookings with a status filter

### Cross-cutting
- Role-based routing with protected routes (customer, vendor, admin)
- Automatic profile creation on signup, with the role read from signup metadata
- Row Level Security on every table, plus triggers that stop users promoting themselves to admin or approving their own vendor account
- Route-level code splitting (lazy loading) to keep the initial bundle small
- Responsive layout with a mobile navigation menu

---

## 3. Screenshots

<!-- TODO: add real screenshots to docs/screenshots/ and keep the file names below (or update the links). -->

| Home page | Booking flow |
|---|---|
| ![Home page](docs/screenshots/home.png) | ![Booking flow](docs/screenshots/booking-flow.png) |

| Customer dashboard | Vendor dashboard |
|---|---|
| ![Customer dashboard](docs/screenshots/customer-dashboard.png) | ![Vendor dashboard](docs/screenshots/vendor-dashboard.png) |

| Admin dashboard | |
|---|---|
| ![Admin dashboard](docs/screenshots/admin-dashboard.png) | |

---

## 4. Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, TypeScript 5 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Routing | React Router 7 |
| Icons | Lucide React |
| Backend | Supabase: PostgreSQL, Auth, Storage, Row Level Security, database functions (RPC) |
| Tooling | ESLint, Supabase CLI (installed as a dev dependency) |
| Deployment | Vercel (with a rewrite rule for client-side routing) |

---

## 5. Setup instructions

### Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0` (required by Vite 8) and npm
- **Git**
- A free **Supabase account** ([supabase.com](https://supabase.com))
- **Supabase CLI**: no global install needed. It is a dev dependency, so run it with `npx supabase ...`

### 1. Clone and install

```bash
git clone [TODO: your repository URL]
cd event-planning-system
npm install
```

### 2. Create a Supabase project

1. In the Supabase dashboard, create a new project and note the **database password** you choose.
2. Go to **Authentication → Sign In / Providers → Email** and turn **off** "Confirm email". The app signs users up and sends them straight to the login page, so email confirmation must be disabled.
3. Go to **Authentication → URL Configuration** and set the **Site URL** to `http://localhost:5173`. Add your deployed URL here later.
4. Go to **Settings → API** and copy the **Project URL** and the **anon public key**.

### 3. Environment variables

Copy the example file and fill in your own values. Never commit real keys; `.env.local` is git-ignored.

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |

### 4. Apply the database migrations

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF   # the ID in your project URL
npx supabase db push                               # asks for your database password
```

`db push` applies every file in `supabase/migrations/` in order:

| Migration | Purpose |
|---|---|
| `00000000000001_initial_schema.sql` | Enum types and all eight tables |
| `00000000000002_handle_new_user_trigger.sql` | Creates a `profiles` row automatically on signup |
| `00000000000003_rls_policies.sql` | Core row-level policies |
| `00000000000004_admin_and_availability_policies.sql` | Admin access, vendor management of own listings, availability |
| `00000000000005_storage_setup.sql` | `listing-images` storage bucket and its policies |
| `00000000000006_account_deletion.sql` | Soft-delete column and `request_account_deletion()` RPC |
| `00000000000007_fix_handle_new_user_search_path.sql` | Fixes the signup trigger failing with `type "user_role" does not exist` |
| `00000000000008_enable_rls_and_fix_policies.sql` | Turns RLS on for all tables, fixes recursive admin policies, blocks role/status self-escalation |

The storage bucket is created by migration 005, so there is nothing to create manually in the dashboard.

### 5. Run locally

```bash
npm run dev
```

Open http://localhost:5173.

Other scripts: `npm run build` (production build), `npm run preview` (serve the build), `npm run lint`.

### 6. Create your local test accounts

Your local Supabase project starts empty, so there are no users yet.

1. Register two accounts in the app: one as **Customer**, one as **Vendor**.
2. Promote a third registered account to admin (there is intentionally no UI for this). Run this in the Supabase **SQL editor**:

   ```sql
   update profiles set role = 'admin' where email = 'your-admin-account@example.com';
   ```
3. *(Optional)* Load demo listings: open `supabase/seed_example.sql`, replace the placeholder vendor `user_id` values with the real IDs of your vendor accounts, and run it in the SQL editor.
4. Log in as the vendor to complete the business profile setup, then add a venue or caterer package. Log in as the customer to book it, and back as the vendor to accept the request.

---

## 6. Test accounts

These accounts exist on the **hosted demo** ([event-planning-system-six.vercel.app](https://event-planning-system-six.vercel.app/)) so every flow can be tried without registering.

| Role | Email | Password |
|---|---|---|
| Customer | [TODO: email] | [TODO: password] |
| Vendor | [TODO: email] | [TODO: password] |
| Admin | [TODO: email] | [TODO: password] |

> These are throwaway demo accounts for judging only. To run the project locally, follow step 6 above to create your own.

**Suggested walkthrough**
1. Log in as **Customer** → Event Centres → pick a venue → *Book this venue* → complete the five steps → check **My Bookings** (status: pending).
2. Log in as **Vendor** → Dashboard → **Accept** the request.
3. Log in as **Admin** → review vendors, listings and all bookings.

---

## 7. Project structure

```
event-planning-system/
├── supabase/
│   ├── migrations/          # SQL schema, triggers, RLS, storage (applied with the CLI)
│   ├── functions/           # optional Edge Function stub for hard account deletion
│   └── seed_example.sql     # optional demo data
├── src/
│   ├── components/          # ui/, layout/, shared/ building blocks
│   ├── features/            # one service file per domain (auth, venues, caterers, events, bookings, ...)
│   ├── pages/               # public/, customer/, vendor/, admin/
│   ├── routes/              # AppRoutes (lazy-loaded) and ProtectedRoute
│   ├── context/             # AuthContext, ThemeContext
│   ├── lib/supabaseClient.ts
│   └── types/
├── vercel.json              # rewrite so deep links work with React Router
└── .env.example
```

---

## 8. AI usage disclosure

This project was built with **significant AI assistance**. I used **Claude (Anthropic)** in a chat interface throughout the build.

### What AI helped with
- **Planning and scaffolding:** breaking the build into ten stages, proposing the database schema and initial project scaffold
- **Code generation:** most React/TypeScript pages, service files and UI components, and the SQL for migrations, triggers and RLS policies
- **Debugging:** reading error messages and Postgres logs I pasted in, and proposing fixes (for example the signup trigger failure and the RLS problems described below)
- **Refactors:** route-level lazy loading, the post-login redirect, the landing page hero card
- **Deployment guidance:** Vercel setup, environment variables and the SPA rewrite rule
- **Writing:** this README and my launch posts

### What I did myself
- Came up with the idea, chose the scope and decided what the MVP would *not* include (payments, chat, reviews, and so on)
- Chose the stack, the ten-stage plan, the folder structure, and the brand (colours and logo)
- Created and configured the Supabase project, and ran the CLI, migrations and deployment myself
- Tested every flow by hand across the customer, vendor and admin roles, and reported what broke
- Made the product decisions along the way, such as keeping the landing page card static, turning off email confirmation for easy testing, and enabling RLS after Supabase's security warning

### What I learned
<!-- TODO: rewrite the points below in your own words, and add anything you understand now that you didn't before. -->
- How Supabase Auth, the `profiles` table and a database trigger fit together, and why the trigger runs in a different `search_path`
- What Row Level Security actually does, and that writing policies is not the same as enabling RLS
- How to read Postgres logs to find the real error behind a vague message
- How migrations make a database reproducible: I rebuilt the whole backend on a fresh project by re-running them
- Why security rules belong in the database, not only in the UI

---

## 9. Learning and growth

### Challenges and how I dealt with them

**1. The TypeScript template mix-up.** I planned to build in plain JavaScript, but the Vite template I scaffolded from was the TypeScript one. Rather than restart, I kept TypeScript and defined shared types in `src/types`, which made the Supabase data shapes much clearer.

**2. CLI-first migrations and rebuilding the backend.** After deleting my first Supabase project, I recreated everything from the migration files with `supabase link` and `supabase db push`. That only worked because the schema lived in versioned SQL rather than in dashboard clicks.

**3. "Database error saving new user."** After the rebuild, every signup failed. The Postgres logs showed `type "user_role" does not exist`. The enum did exist, but the auth trigger ran with a `search_path` that didn't include `public`. The fix (migration 007) was to schema-qualify the type and pin the function's `search_path`.

**4. RLS policies that weren't switched on, and then didn't work.** I had written a full set of RLS policies but never ran `ENABLE ROW LEVEL SECURITY`, so the tables were open to anyone with the project URL. Supabase flagged it as a critical `rls_disabled_in_public` issue. Reviewing the policies before enabling them exposed real bugs:
- admin policies queried `profiles` from inside a policy on `profiles`, causing infinite recursion (fixed with a `SECURITY DEFINER` `is_admin()` function)
- the "update own profile" policy would have let any user set their own role to `admin` (fixed with a trigger)
- vendors could not read the `events` behind their bookings, and had no policy to edit their own profile
- vendors could have approved themselves, and customers could have inserted bookings as `confirmed`

Migration 008 fixes all of these and then enables RLS.

**5. A "permanent" landing page card.** The hero card was showing whichever venue was created most recently, so my test data ended up on the home page. I replaced it with static content so it no longer depends on live data.

**6. Bundle size.** The production build warned that a chunk was over 500 kB. I converted the routes to `React.lazy` with a `Suspense` fallback so each page loads only when visited.

**7. Deep links on Vercel.** Client-side routes return 404 on a refresh unless the host rewrites them, so I added `vercel.json` with a rewrite to `index.html`.

**8. Feedback that shaped the design.** Someone on LinkedIn pointed out the scheduling gap in booking: a pending request doesn't hold a date, so two customers can request the same slot. That fed directly into the roadmap below.

### What I'd do next
See [Known limitations and future plans](#10-known-limitations-and-future-plans). The next priorities are date holds with automatic expiry of unanswered requests, customer-side cancellation, reviews and ratings, and email notifications.

---

## 10. Known limitations and future plans

Being upfront about what isn't finished:

**Limitations**
- **No online payments.** Bookings are requests only; there is no payment gateway.
- **Pending requests don't hold a date and never expire.** Two customers can request the same venue and date, and a request stays pending until the vendor acts. Adding a hold with automatic expiry is my next task.
- **Prices are calculated in the browser.** A determined user could send a manipulated total. Totals should be computed server-side.
- **Customers cannot cancel a booking** from the UI yet.
- **No ratings or reviews**, so the platform shows no fabricated ratings. The stats on some marketing sections are placeholders.
- **Storage policies are permissive** for any authenticated user (not scoped to a vendor's own folder), which is acceptable for an MVP but should be tightened.
- **Account deletion is a soft delete.** Fully removing the `auth.users` row needs the service-role key via the optional Edge Function in `supabase/functions/delete-account`.
- **No About or Contact pages** and no email notifications yet.
- **No automated tests.** Everything was tested manually with the checklist in this repo's history.
- **Demo listing photos are stock placeholders**, and the seed file needs real vendor IDs before it can be run.

**Future plans**
1. Date holds and automatic expiry for pending booking requests
2. Customer cancellation of bookings
3. Reviews and ratings after a completed booking
4. Email notifications for vendors and customers (Supabase Edge Function)
5. Availability-aware search (filter venues by date)
6. Saved favourites, multiple photos per listing, a vendor calendar view
7. Server-side pricing and automated tests

---

## 11. Development timeline

> The Git history is short (3 commits). The build log below is a truer picture of how the work progressed; the numbered migration files also record the order in which the backend took shape.

| When | Milestone |
|---|---|
| [TODO: start date] | Idea, scope and the ten-stage build plan; project scaffold (Vite + React + TypeScript + Tailwind) |
| [TODO: date] | Supabase schema, signup trigger, authentication and role-based routing |
| [TODO: date] | Public browsing, customer booking flow, vendor and admin dashboards, image storage |
| [TODO: date] | Profile/account system, notification bell, responsive polish |
| 14 Sep 2026 | Rebuilt the backend on a fresh Supabase project using CLI migrations; fixed the signup trigger (migration 007) |
| [TODO: date] | Deployed to Vercel: https://event-planning-system-six.vercel.app/ |
| 19 Sep 2026 | Supabase flagged RLS as disabled; reviewed and rewrote the policies and enabled RLS (migration 008) |
| [TODO: date] | Route-level lazy loading, post-login dashboard redirect, README |

---

## 12. Credits

**Libraries and frameworks**
- [React](https://react.dev/) and [React Router](https://reactrouter.com/)
- [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, CLI) and `@supabase/supabase-js`
- [Lucide React](https://lucide.dev/) for icons
- [ESLint](https://eslint.org/)

**Hosting:** [Vercel](https://vercel.com/)

**Fonts:** none loaded; the app uses the system font stack.

**Images:** demo venue and caterer photos are stock images from [Unsplash](https://unsplash.com/) used as placeholders. [TODO: add photographer credits for any images you keep.]

**Original work:** the EventEase name, logo and colour palette, the database design, and the application code (with AI assistance, as disclosed above). The bar and donut charts are small custom components, not a chart library.

**AI assistance:** Claude by [Anthropic](https://www.anthropic.com/), see [AI usage disclosure](#8-ai-usage-disclosure).

---

*Built by [TODO: your name] as [TODO: hackathon / final year project name].*
