import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

/**
 * Stripe webhook — the trusted source of truth for boosts. When a Checkout
 * Session completes, mark the listing boosted in Supabase.
 *
 * Set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and (for the DB write)
 * SUPABASE_SERVICE_ROLE_KEY. This runs server-side only — the service-role key
 * must NEVER be exposed to the browser (no NEXT_PUBLIC_ prefix).
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
  }

  const stripe = new Stripe(secret);
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig ?? "", webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const listingId = session.metadata?.listingId;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (listingId && url && serviceKey) {
      const supabase = createClient(url, serviceKey);
      const boostedUntil = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString();
      await supabase
        .from("listings")
        .update({ boosted: true, boosted_until: boostedUntil })
        .eq("id", listingId);
    }
  }

  return NextResponse.json({ received: true });
}
