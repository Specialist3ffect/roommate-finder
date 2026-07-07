import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Creates a Stripe Checkout Session to "boost" a listing (feature it at the top).
 *
 * Requires STRIPE_SECRET_KEY. Without it the app runs in demo mode: this route
 * returns { demo: true } and the client simulates the boost locally so the flow
 * is fully clickable without a Stripe account.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const priceCents = Number(process.env.BOOST_PRICE_CENTS || 500); // $5 default

  const { listingId, listingName } = await req.json().catch(() => ({}));
  if (!listingId) {
    return NextResponse.json({ error: "Missing listingId" }, { status: 400 });
  }

  // Demo mode — no Stripe configured.
  if (!secret) {
    return NextResponse.json({ demo: true });
  }

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const stripe = new Stripe(secret);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: priceCents,
          product_data: {
            name: "RoomMatch — Featured listing (7 days)",
            description: listingName
              ? `Boost "${listingName}" to the top of local results`
              : "Boost your listing to the top of local results",
          },
        },
      },
    ],
    // The webhook is the source of truth; the query param just improves UX.
    metadata: { listingId: String(listingId) },
    success_url: `${origin}/?boosted=${encodeURIComponent(listingId)}`,
    cancel_url: `${origin}/?boost_cancelled=1`,
  });

  return NextResponse.json({ url: session.url });
}
