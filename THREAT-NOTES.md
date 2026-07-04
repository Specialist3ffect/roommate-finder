# THREAT-NOTES — RoomMatch

Security considerations for this app and how they're handled. Update as the app grows.

## Data flow
- **Geocoding** uses OpenStreetMap Nominatim over HTTPS from the browser. Only the
  user-typed place string / their coordinates are sent. No PII beyond that leaves
  the app for geocoding.
- **Listings & messages** persist to Supabase when configured, else to `localStorage`
  (demo mode — data never leaves the browser).

## Secrets
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used
  client-side. The anon key is designed to be public **and must be paired with RLS**
  (see `supabase/schema.sql`). The service-role key is never referenced and must
  never be shipped to the client.
- `.env.local` is gitignored; only `.env.example` (empty placeholders) is committed.

## What an attacker could try → mitigation
| Attempt | Mitigation |
|---|---|
| Read other users' messages via the anon key | `messages` has **no** public SELECT policy — insert-only. Read them from the dashboard or a trusted server context. |
| Dump/modify listings directly via the API | RLS is enabled; listings are public-read but the demo insert policy is open. **Before production, gate inserts to `auth.uid()` with Supabase Auth.** |
| Inject bad data (huge budget, XSS in bio) | Postgres CHECK constraints bound `age`, `budget`, message length, and `kind`. React escapes rendered text by default (no `dangerouslySetInnerHTML`). |
| Spam inquiries / listings | Not yet rate-limited. Add Supabase rate limiting / a CAPTCHA before launch. |
| Abuse Nominatim (rate limits / ToS) | Fine for dev. For production, self-host or use a paid geocoder and cache results. |

## Known / accepted
- One transitive `postcss` advisory remains via Next's bundled deps (build-time
  CSS-stringify XSS, not reachable at runtime here). The only auto-fix downgrades
  Next and reintroduces critical CVEs, so Next is pinned to a patched 14.2.x.

## Before production — TODO
- [ ] Add Supabase Auth; scope listing/message writes to the authenticated user.
- [ ] Restrict the listings INSERT policy (remove open `with check (true)`).
- [ ] Add rate limiting + spam protection on inserts.
- [ ] Set security headers (CSP, HSTS) in `next.config.mjs` / hosting layer.
- [ ] Move message reads behind a server route; never expose them to the anon key.
