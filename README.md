# RoomMatch — Roommate Finder

A Next.js (App Router) + TypeScript + Tailwind app for finding roommates by location.

## Features
- Geo-search: "Use my location" (browser geolocation) or type any city/address
- Distance-sorted results within an adjustable radius (Haversine math)
- Filter by budget and by "has a room" / "needs a room"
- Post your own listing (geocoded + saved in your browser via localStorage)
- Geocoding via OpenStreetMap Nominatim (no API key required)

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Notes
- This is a front-end demo: user listings live in localStorage, not a database.
- To go production: swap localStorage for Supabase, add auth + real messaging,
  and consider a paid geocoder for rate limits. // TODO: replace
