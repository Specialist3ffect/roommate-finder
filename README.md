# RoomMatch — Roommate Finder

A Next.js (App Router) + TypeScript + Tailwind app for finding roommates by location.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSpecialist3ffect%2Froommate-finder&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20keys%20—%20leave%20blank%20to%20deploy%20in%20demo%20mode&project-name=roommate-finder&repository-name=roommate-finder)

## Features
- **Geo-search** — "Use my location" (browser geolocation) or type any city/address
- **Distance-sorted results** within an adjustable radius (Haversine math)
- Filter by **budget** and by **"has a room" / "needs a room"**
- **Grid + interactive map** views (Leaflet) with color-coded pins
- **Post a listing** and **message** other people
- **Supabase backend** (listings + messages) with **email auth**, or a zero-config
  **localStorage demo mode** when Supabase env vars are absent
- Geocoding via OpenStreetMap Nominatim (no API key required)

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

Runs in **demo mode** out of the box (data saved to your browser). To use a real
backend, set up Supabase below.

## Supabase backend (optional)
1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql) to create the
   `listings` + `messages` tables and their row-level-security policies.
3. Copy your keys into a local env file:
   ```bash
   cp .env.example .env.local
   ```
   Fill in from **Supabase → Settings → API**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
The app auto-detects these and switches from localStorage to the database, enabling
sign-in and owner-scoped listings. See [`THREAT-NOTES.md`](THREAT-NOTES.md) for the
security model and the checklist to harden before launch.

## Deploy to Vercel
1. Push this repo to GitHub (already done).
2. In [Vercel](https://vercel.com/new), **Import** the `roommate-finder` repo.
   Framework preset is auto-detected as **Next.js** — no build config needed.
3. Add the environment variables (Project → Settings → Environment Variables), for
   **Production** (and Preview if you want):
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
   Skip these to deploy in demo mode.
4. In **Supabase → Authentication → URL Configuration**, add your Vercel domain to the
   allowed redirect URLs so email auth works in production.
5. Deploy. Every push to `main` redeploys automatically.

> The anon key is safe to expose to the browser **because** RLS is enabled. Never add
> the Supabase service-role key to any `NEXT_PUBLIC_*` variable.

## Tech
Next.js 14 · React 18 · TypeScript · Tailwind CSS · Supabase · Leaflet / react-leaflet
