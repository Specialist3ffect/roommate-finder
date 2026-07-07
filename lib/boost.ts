import type { Listing } from "./types";

/**
 * Start the "boost" flow for a listing.
 * - Real mode (Stripe configured): redirects the browser to Stripe Checkout.
 * - Demo mode: returns { demo: true } so the caller can simulate the boost.
 */
export async function startBoost(
  listing: Listing
): Promise<{ demo: boolean }> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: listing.id, listingName: listing.name }),
  });
  if (!res.ok) throw new Error("Could not start checkout.");
  const data = (await res.json()) as { url?: string; demo?: boolean };

  if (data.url) {
    window.location.href = data.url; // to Stripe Checkout
    return { demo: false };
  }
  return { demo: Boolean(data.demo) };
}
