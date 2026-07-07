import Link from "next/link";
import { SEED_LISTINGS } from "@/lib/data";
import type { CityConfig } from "@/lib/cities";
import CityListings from "@/components/CityListings";

/** Reusable city landing page — clone the playbook per city via lib/cities.ts. */
export default function CityLanding({ config }: { config: CityConfig }) {
  const listings = SEED_LISTINGS.filter((l) => l.city.includes(config.match));
  const hasRoom = listings.filter((l) => l.kind === "has-room").length;
  const seeking = listings.length - hasRoom;
  const avgBudget = listings.length
    ? Math.round(
        listings.reduce((s, l) => s + l.budget, 0) / listings.length / 50
      ) * 50
    : 0;

  const stats = [
    { label: "Active listings", value: listings.length },
    { label: "Rooms available", value: hasRoom },
    { label: "People looking", value: seeking },
    { label: "Avg budget", value: `$${avgBudget.toLocaleString()}/mo` },
  ];

  const searchHref = `/?place=${encodeURIComponent(config.searchQuery)}`;

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              ⌂
            </span>
            <span className="text-lg font-bold tracking-tight">RoomMatch</span>
          </Link>
          <Link
            href={searchHref}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Browse all {config.name.split(",")[0]}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section>
        <div className="mx-auto max-w-4xl px-4 pb-10 pt-16 text-center sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-medium text-brand-700 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {config.eyebrow}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            {config.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            {config.subhead}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={searchHref}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600"
            >
              Search {config.name.split(",")[0]} roommates
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white/70 px-6 py-3 font-medium text-slate-700 backdrop-blur transition hover:bg-white"
            >
              Post a listing
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/70 bg-white/70 px-3 py-4 shadow-sm backdrop-blur"
              >
                <div className="text-xl font-bold text-slate-900">
                  {s.value}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-wrap justify-center gap-2">
          {config.neighborhoods.map((n) => (
            <Link
              key={n}
              href={`/?place=${encodeURIComponent(`${n}, ${config.name}`)}`}
              className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
            >
              {n}
            </Link>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-5 text-lg font-semibold text-slate-900">
          {config.name.split(",")[0]} roommates &amp; rooms
        </h2>
        <CityListings listings={listings} searchQuery={config.searchQuery} />
      </section>

      {/* Trust / why */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Verified profiles",
              d: "Look for the ✓ badge — members verify their email (and soon ID) so you know who you're talking to.",
            },
            {
              t: "Search by distance",
              d: "See exactly how far each room is from campus, your job, or a specific neighborhood.",
            },
            {
              t: "Free to browse",
              d: "Browsing and messaging are free. Hosts can boost a listing to the top when they want more replies.",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur"
            >
              <h3 className="font-semibold text-slate-900">{c.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200/60 py-8 text-center text-sm text-slate-400">
        RoomMatch · {config.name}. Location data © OpenStreetMap contributors.
      </footer>
    </main>
  );
}
