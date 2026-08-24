# CivicPulse

**Report. Track. Improve Your Community.**

CivicPulse is a CivicTech/GovTech platform that unifies three kinds of complaints in one place — community/infrastructure issues, government service problems, and consumer/business complaints — with transparent, trackable status updates from submission to resolution.

> This started as a demo prototype and now has a real backend: Postgres (via Prisma), JWT authentication, and Geoapify for live maps and address search. It does not use real citizen data by default and is not connected to any government database — see "What's real vs. demo" below.

## Tech stack

**Frontend**: React 19 + Vite, React Router 7, Tailwind CSS v4, Framer Motion, Lucide React, Recharts, React Leaflet
**Backend**: Vercel Serverless Functions (`/api`), Prisma ORM, PostgreSQL (Neon via Vercel Postgres), JWT auth (`jsonwebtoken` + `bcryptjs`)
**Maps/geocoding**: Geoapify (tile layer + address autocomplete)

Frontend and backend deploy together as a single Vercel project — there's nothing separate to host.

---

## 1. Set up the database (Vercel Postgres / Neon)

1. In the [Vercel dashboard](https://vercel.com/dashboard), open (or create) this project.
2. Go to **Storage → Create Database → Postgres** (this is powered by Neon).
3. Once created, click **Connect Project** to link it to this repo. Vercel automatically adds `DATABASE_URL` and related env vars to your project for you.
4. For local development, open the database's **.env.local** tab in Vercel and copy the values into your own `.env` file (see step 4 below) — you need `DATABASE_URL` and `DIRECT_URL`.

## 2. Set up Geoapify

1. Sign up free at [geoapify.com](https://www.geoapify.com/) → **My Projects** → create a project → copy the API key.
2. You'll use the **same key** in two places (see `.env.example`):
   - `GEOAPIFY_API_KEY` — server-side only, used by `/api/geocode.js` for address autocomplete.
   - `VITE_GEOAPIFY_API_KEY` — used client-side to load map tiles directly in the browser. This one is visible in the compiled JS (that's normal for map tile keys) — once you know your production domain, restrict the key by domain/referrer in the Geoapify dashboard.

## 3. Generate a JWT secret

```bash
openssl rand -base64 32
```
Use the output as `JWT_SECRET`.

## 4. Configure environment variables

```bash
cp .env.example .env
```
Fill in `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `GEOAPIFY_API_KEY`, and `VITE_GEOAPIFY_API_KEY`. Leave `VITE_API_BASE_URL` blank (frontend and API share the same domain on Vercel).

## 5. Install, generate, and seed

```bash
npm install              # also runs `prisma generate` automatically
npx prisma db push       # creates the tables in your database
npm run db:seed          # creates the demo admin account + sample reports
```

### Demo admin login (created by the seed script)
```
Email:    admin@civicpulse.ng
Password: demo1234
```

## 6. Run locally

```bash
npm run dev
```
Visit `http://localhost:5173`. The frontend calls `/api/*` — if you're only running `vite dev`, those calls will 404 since Vite doesn't run serverless functions. For full local API support, install the [Vercel CLI](https://vercel.com/docs/cli) and run `vercel dev` instead, which serves both the frontend and `/api` together exactly as Vercel will in production.

## 7. Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel: **Import Git Repository** → select this repo → make sure the Postgres database from step 1 is connected → **Deploy**.
3. Add the remaining env vars (`JWT_SECRET`, `GEOAPIFY_API_KEY`, `VITE_GEOAPIFY_API_KEY`) under **Project Settings → Environment Variables** if you haven't already.
4. After the first deploy, run the schema push and seed once against the production database (from your machine, with production `DATABASE_URL`/`DIRECT_URL` in `.env`):
   ```bash
   npx prisma db push
   npm run db:seed
   ```
5. `vercel.json` already routes `/api/*` to the serverless functions and everything else to the SPA, so client-side routes like `/admin/map` resolve correctly on refresh.

---

## Project structure

```
api/                    Vercel serverless functions (the backend)
├── _lib/                 prisma.js, auth.js, taxonomy.js — shared helpers
├── auth/                  signup.js, login.js, me.js
├── reports/                index.js (list/create), [id].js (get/update)
├── stats.js               aggregate counts for dashboard/analytics
└── geocode.js              Geoapify autocomplete proxy (keeps the key server-side)

prisma/
├── schema.prisma         Database models (User, Report, TimelineEntry)
└── seed.js                Demo admin account + sample reports

src/
├── components/           Shared UI — Navbar, Footer, Button, Badge, FlipCard,
│                           DemoMap.jsx (Leaflet + Geoapify tiles), HeroMap.jsx…
├── layouts/               PublicLayout, CitizenLayout, AdminLayout
├── pages/
│   ├── public/             Landing, Signup, Login, Community, Complaints, About, Contact, Track…
│   ├── citizen/             Dashboard, Report flow, My Reports, Report Detail, Profile, Notifications
│   └── admin/                Dashboard, Reports, Report Detail, Map, Analytics, Departments, Organizations, Users, Notifications, Settings
├── features/
│   └── complaints/          ClassifierDemo (rule-based routing), ReportTimeline
├── services/               apiClient.js, authService.js, reportService.js — talk to /api
├── hooks/                   useAuth, useReports/useReport (async data fetching)
├── data/                    taxonomy.js (categories/departments/routing rules)
└── utils/                   status.js (badges, formatting)
```

## What's real vs. demo

**Real:**
- Authentication (signup/login) — real Postgres-backed accounts, bcrypt-hashed passwords, JWT sessions
- Reports — created, listed, and updated against a real database via `/api/reports`
- Admin actions (verify, assign, change status/priority, add updates) — persist to the database and append to each report's timeline
- Maps — live Geoapify tile layers via Leaflet, real address autocomplete/geocoding on the report form
- Dashboard/analytics stats — computed from real data via `/api/stats`

**Still demo/illustrative by design:**
- The complaint classification ("who should handle my complaint?") is deterministic keyword matching (`api/_lib/taxonomy.js`), not real AI — clearly labeled as such in the UI.
- File "uploads" track file name/type only; nothing is actually persisted to storage. Wire `submitReport` in `src/services/reportService.js` and the `/api/reports` POST handler to a real object-storage provider (S3, Vercel Blob, etc.) to make this real.
- Password reset does not send a real email.
- The landing page's "Recently reported issues" flip cards use static illustrative content (`src/data/reports.js`), not live data — intentional, since it's marketing content shown before anyone logs in.
- No real government database integration or verification — this remains an independent civic-reporting platform unless/until authorized integrations are built.

## Useful scripts

```bash
npm run dev          # start Vite dev server (frontend only)
npm run build        # production build
npm run db:push      # sync Prisma schema to the database (no migration history)
npm run db:migrate   # create a proper migration (use once schema stabilizes)
npm run db:seed      # re-run the seed script
npm run db:studio    # open Prisma Studio to browse/edit data visually
```
