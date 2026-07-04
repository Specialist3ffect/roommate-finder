"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Coords, Listing, ListingKind } from "@/lib/types";
import { SEED_LISTINGS } from "@/lib/data";
import { distanceMiles, geocode, reverseGeocode } from "@/lib/geo";
import { fetchUserListings } from "@/lib/listings";
import ListingCard from "@/components/ListingCard";
import PostListingModal from "@/components/PostListingModal";
import ContactModal from "@/components/ContactModal";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/components/AuthProvider";

// Leaflet touches `window`, so load the map only in the browser.
const ResultsMap = dynamic(() => import("@/components/ResultsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-400">
      Loading map…
    </div>
  ),
});

type KindFilter = "all" | ListingKind;
type View = "grid" | "map";

export default function Home() {
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [origin, setOrigin] = useState<Coords | null>(null);
  const [placeQuery, setPlaceQuery] = useState("");
  const [radius, setRadius] = useState(25);
  const [maxBudget, setMaxBudget] = useState(3000);
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [locating, setLocating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [contactListing, setContactListing] = useState<Listing | null>(null);
  const [view, setView] = useState<View>("grid");
  const [authOpen, setAuthOpen] = useState(false);
  const { configured, user, signOut } = useAuth();

  // When auth is required (Supabase configured), only allow posting once signed in.
  function handlePostClick() {
    if (configured && !user) {
      setAuthOpen(true);
    } else {
      setModalOpen(true);
    }
  }

  // Load user-posted listings from Supabase (or localStorage in demo mode).
  useEffect(() => {
    fetchUserListings()
      .then(setUserListings)
      .catch(() => setUserListings([]));
  }, []);

  const allListings = useMemo(
    () => [...userListings, ...SEED_LISTINGS],
    [userListings]
  );

  async function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setStatus("Geolocation isn't available in this browser.");
      return;
    }
    setLocating(true);
    setStatus(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const label = await reverseGeocode(latitude, longitude);
        setOrigin({ lat: latitude, lng: longitude, label });
        setPlaceQuery(label);
        setLocating(false);
      },
      () => {
        setStatus("Couldn't get your location. Try typing a city instead.");
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  async function searchPlace(e: React.FormEvent) {
    e.preventDefault();
    if (!placeQuery.trim()) return;
    setLocating(true);
    setStatus(null);
    const coords = await geocode(placeQuery.trim());
    setLocating(false);
    if (!coords) {
      setStatus("Couldn't find that place. Try a city and state/country.");
      return;
    }
    setOrigin(coords);
  }

  const results = useMemo(() => {
    return allListings
      .map((l) => ({
        listing: l,
        distance: origin
          ? distanceMiles(origin.lat, origin.lng, l.lat, l.lng)
          : null,
      }))
      .filter(({ listing, distance }) => {
        if (listing.budget > maxBudget) return false;
        if (kindFilter !== "all" && listing.kind !== kindFilter) return false;
        if (origin && distance !== null && distance > radius) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.distance === null || b.distance === null) return 0;
        return a.distance - b.distance;
      });
  }, [allListings, origin, radius, maxBudget, kindFilter]);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              ⌂
            </span>
            <span className="text-lg font-bold tracking-tight">RoomMatch</span>
          </div>
          <div className="flex items-center gap-2">
            {configured && user && (
              <span className="hidden text-sm text-slate-500 sm:inline">
                {user.email}
              </span>
            )}
            {configured && user ? (
              <button
                onClick={() => signOut()}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Sign out
              </button>
            ) : configured ? (
              <button
                onClick={() => setAuthOpen(true)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Sign in
              </button>
            ) : null}
            <button
              onClick={handlePostClick}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              + Post a listing
            </button>
          </div>
        </div>
      </header>

      {/* Hero + search */}
      <section className="bg-gradient-to-b from-brand-50 to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find your next roommate, right where you want to live
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Search by your location or any city. We&apos;ll show you people with
            rooms and people looking — sorted by distance.
          </p>

          <form
            onSubmit={searchPlace}
            className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-300 px-3">
                <span className="text-slate-400">📍</span>
                <input
                  className="w-full py-2.5 text-sm outline-none"
                  placeholder="Enter a city, neighborhood, or address"
                  value={placeQuery}
                  onChange={(e) => setPlaceQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
              >
                Search
              </button>
              <button
                type="button"
                onClick={useMyLocation}
                disabled={locating}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                {locating ? "Locating…" : "Use my location"}
              </button>
            </div>

            {/* Filters */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <label className="text-left text-sm">
                <span className="text-slate-500">
                  Radius: <strong>{radius} mi</strong>
                </span>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="mt-1 w-full accent-brand-500"
                  disabled={!origin}
                />
              </label>
              <label className="text-left text-sm">
                <span className="text-slate-500">
                  Max budget: <strong>${maxBudget.toLocaleString()}</strong>
                </span>
                <input
                  type="range"
                  min={500}
                  max={3000}
                  step={50}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="mt-1 w-full accent-brand-500"
                />
              </label>
              <label className="text-left text-sm">
                <span className="text-slate-500">Show</span>
                <select
                  value={kindFilter}
                  onChange={(e) => setKindFilter(e.target.value as KindFilter)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none focus:border-brand-500"
                >
                  <option value="all">Everyone</option>
                  <option value="has-room">People with a room</option>
                  <option value="needs-room">People looking</option>
                </select>
              </label>
            </div>

            {status && (
              <p className="mt-3 text-left text-sm text-amber-600">{status}</p>
            )}
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {origin ? (
              <>
                {results.length} match{results.length === 1 ? "" : "es"} near{" "}
                <span className="text-brand-600">{origin.label}</span>
              </>
            ) : (
              <>Browse {results.length} roommates everywhere</>
            )}
          </h2>
          <div className="flex items-center gap-3">
            {origin && (
              <button
                onClick={() => {
                  setOrigin(null);
                  setPlaceQuery("");
                }}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Clear location
              </button>
            )}
            <div className="flex rounded-lg border border-slate-300 p-0.5 text-sm">
              <button
                onClick={() => setView("grid")}
                className={`rounded-md px-3 py-1 font-medium transition ${
                  view === "grid"
                    ? "bg-brand-500 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView("map")}
                className={`rounded-md px-3 py-1 font-medium transition ${
                  view === "map"
                    ? "bg-brand-500 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-600">
              No matches within {radius} mi under $
              {maxBudget.toLocaleString()}.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Try widening your radius or raising your budget.
            </p>
          </div>
        ) : view === "map" ? (
          <div className="h-[520px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <ResultsMap rows={results} origin={origin} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ listing, distance }) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                distance={distance}
                onMessage={setContactListing}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        RoomMatch — demo roommate finder. Location data © OpenStreetMap
        contributors.
      </footer>

      <PostListingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(l) => {
          setUserListings((prev) => [l, ...prev]);
          setModalOpen(false);
        }}
      />

      <ContactModal
        listing={contactListing}
        onClose={() => setContactListing(null)}
      />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  );
}
