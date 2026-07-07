# Turn on payments (live boosts) — checklist

The app ships with the full Stripe "boost/feature a listing" flow already coded.
Until you add keys it runs in **demo mode** (the boost is simulated). Follow this to
take real payments. ~20–30 minutes.

> Prereq: the Supabase backend should be on (see `README.md`), because a real boost is
> recorded in the `listings` table by the Stripe webhook. Demo mode needs none of this.

---

## 1. Stripe account
- [ ] Create/log in at [dashboard.stripe.com](https://dashboard.stripe.com).
- [ ] Toggle **Test mode** (top-right) while setting up. Switch to live later.
- [ ] **Developers → API keys** → copy the **Secret key** (`sk_test_…`).

## 2. Add the webhook (so paid boosts actually apply)
- [ ] **Developers → Webhooks → Add endpoint**.
- [ ] Endpoint URL: `https://roommatch.co/api/stripe/webhook`
- [ ] Events to send: **`checkout.session.completed`**.
- [ ] Create it, then copy the **Signing secret** (`whsec_…`).

## 3. Supabase service role key (server-only)
- [ ] Supabase → **Settings → API** → copy the **`service_role`** secret.
- [ ] ⚠️ This key bypasses row-level security. It is used **only** by the webhook on the
      server. Never put it in a `NEXT_PUBLIC_*` var or the browser.

## 4. Set the environment variables in Vercel
Project → **Settings → Environment Variables** (scope: **Production**, and Preview if
you want test deploys to charge):

| Name | Value |
|------|-------|
| `STRIPE_SECRET_KEY` | `sk_test_…` (then `sk_live_…` when live) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` from step 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role secret from step 3 |
| `BOOST_PRICE_CENTS` | `500` for $5 (optional; 500 is the default) |
| `NEXT_PUBLIC_SITE_URL` | `https://roommatch.co` |

- [ ] **Redeploy** so the new vars take effect (Deployments → ⋯ → Redeploy, or push a
      commit).

## 5. Test the flow (test mode)
- [ ] Open the live site, click **★ Boost** on a listing → you should land on **Stripe
      Checkout** (not the demo message).
- [ ] Pay with the Stripe test card **`4242 4242 4242 4242`**, any future expiry, any CVC.
- [ ] You're redirected back with "Payment received — Featured for 7 days."
- [ ] Confirm in **Supabase → listings** that the row now has `boosted = true`.
- [ ] Confirm in **Stripe → Payments** that the payment shows up.

## 6. Go live
- [ ] In Stripe, switch to **Live mode**; regenerate the endpoint + keys as **live**
      (`sk_live_…`, a new `whsec_…`).
- [ ] Update `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel to the live values.
- [ ] Redeploy. Do one real small purchase yourself to confirm, then refund it in Stripe.

---

### Notes
- **The webhook is the source of truth**, not the browser redirect — a listing is only
  marked boosted after Stripe confirms payment. Good; don't "shortcut" it client-side.
- **Pricing:** change `BOOST_PRICE_CENTS`. For subscriptions/tiers later, switch the
  checkout to a Stripe **Price** ID instead of inline `price_data`.
- **Taxes/receipts:** enable Stripe Tax and email receipts in the Stripe dashboard if you
  need them — no code change required.
- Relevant code: `app/api/checkout/route.ts`, `app/api/stripe/webhook/route.ts`,
  `lib/boost.ts`.
