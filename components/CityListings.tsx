"use client";

import type { Listing } from "@/lib/types";
import ListingCard from "./ListingCard";

/**
 * A read-only preview grid for a city landing page. Messaging routes visitors
 * into the main search (pre-focused on the city) where the full flow lives.
 */
export default function CityListings({
  listings,
  searchQuery,
}: {
  listings: Listing[];
  searchQuery: string;
}) {
  const goToSearch = () => {
    window.location.href = `/?place=${encodeURIComponent(searchQuery)}`;
  };

  if (!listings.length) {
    return (
      <p className="text-center text-slate-500">
        No listings here yet — be the first to post one.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          distance={null}
          onMessage={goToSearch}
        />
      ))}
    </div>
  );
}
