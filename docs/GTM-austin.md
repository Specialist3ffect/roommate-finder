# RoomMatch — Go-to-Market Plan (one page)

**Beachhead market:** Austin, TX
**Niche:** UT Austin students + young professionals (22–30) around West Campus, Hyde Park, East Austin, downtown.
**Landing page:** `/austin`

Why this niche: a dense, seasonal, high-turnover rental market where people already scramble for roommates in Facebook groups and GroupMe — a concentrated audience you can actually reach, which is the only way to beat the marketplace "cold start" problem.

---

## 1. The wedge (solve the chicken-and-egg)

Don't launch "nationwide." Win **one campus leasing cycle**. Get to *liquidity in one zip code* before expanding.

- **Target the supply side first.** Rooms/subleases are the scarce, motivated side (someone graduating, studying abroad, breaking a lease). Seed 50–100 real Austin listings by hand before any marketing.
- **Time it to the leasing calendar.** Austin student leases turn over heavily **May–August**. Launch the push in **March–June**.

## 2. Channels (ranked by effort-to-payoff)

| Channel | Play | Cost |
|---|---|---|
| **Existing FB / GroupMe groups** | Post real value ("free verified roommate search for UT") in "UT Austin Housing/Sublease" groups; DM people with listings and offer to cross-post them | Free |
| **Reddit** | Helpful answers + a pinned tool link in r/UTAustin, r/Austin housing threads | Free |
| **Campus flyering** | QR-code flyers on West Campus/Hyde Park boards, coffee shops, laundromats | ~$50 |
| **Micro-influencers** | 2–3 UT student creators / RAs post the link for a small fee or free premium | $0–300 |
| **SEO** | The `/austin` page + neighborhood pages target "UT Austin roommate," "West Campus sublease" | Free, compounding |
| **Instagram** | A simple @roommatch.austin reposting the best listings daily | Free |

## 3. 30-day launch plan

- **Week 1** — Hand-seed 50+ real Austin listings. Turn on Supabase + auth. Ship `/austin`.
- **Week 2** — Post in 10 FB/GroupMe/Reddit groups. Flyer West Campus. Goal: **first 100 signups**.
- **Week 3** — DM everyone with a room; offer a **free boost** to early hosts. Line up 2 student creators.
- **Week 4** — Turn on paid boosts + verification. Measure. Double down on the one channel that worked.

## 4. How it makes money (already built in the app)

1. **Boost / Featured listing** — $5 to pin a listing to the top for 7 days *(Stripe checkout live in code)*.
2. **Verified badge** — free email verify now; **$3–5 paid ID/background check** later (affiliate or markup).
3. **Later:** property-manager listing fees, renters-insurance / movers affiliate lead-gen.

**Early revenue is thin by design** — the first goal is liquidity and word-of-mouth, not ARPU. Monetize once each search reliably returns good matches.

## 5. Metrics that matter

- **North star:** # of successful roommate matches / month (survey "did you find someone?").
- **Liquidity:** listings per active zip; % of searches returning ≥5 results.
- **Funnel:** signups → listings posted → messages sent → matches.
- **Revenue (secondary):** boosts sold, verification conversions.

## 6. Unit economics (rough)

- CAC in a niche via community channels: **~$0–3** (mostly time + flyers).
- Revenue/host: **$5 boost** + potential **$5 verification** = ~$10 LTV early.
- Implication: keep paid acquisition near zero; grow on community + SEO + referrals until retention/liquidity is proven.

## 7. Expansion (only after Austin works)

Clone the `/austin` playbook to the next campus city (College Station, Denton, Tempe, Boulder…). Each new city is a new `/[city]` landing page + one leasing-cycle community push. **Don't expand until Austin searches reliably return 5+ good matches.**

---

### Biggest risks
1. **Liquidity** — an empty map kills trust. Hand-seed aggressively; never show a dead city.
2. **Trust & safety** — scams/safety are real; lean on verification and clear reporting from day one.
3. **Incumbents are free** — you win on *focus + verification + local density*, not features.
