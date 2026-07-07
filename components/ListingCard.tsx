import type { Listing } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ListingCard({
  listing,
  distance,
  onMessage,
  onBoost,
}: {
  listing: Listing;
  distance: number | null;
  onMessage: (listing: Listing) => void;
  onBoost?: (listing: Listing) => void;
}) {
  const isHasRoom = listing.kind === "has-room";
  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white/80 p-5 shadow-lg ring-1 backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 ${
        listing.boosted
          ? "border-amber-300/80 shadow-amber-500/10 ring-amber-300/60"
          : "border-white/70 shadow-slate-900/5 ring-slate-900/5"
      }`}
    >
      {listing.boosted && (
        <div className="mb-3 -mt-1 flex items-center gap-1 text-xs font-semibold text-amber-600">
          <span>★</span> Featured
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm ring-2 ring-white"
          style={{ backgroundColor: listing.avatarColor }}
        >
          {initials(listing.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold text-slate-900">
              {listing.name}, {listing.age}
            </h3>
            {listing.verified && (
              <span
                title="Identity verified"
                className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700"
              >
                <span aria-hidden>✓</span> Verified
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">{listing.city}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            isHasRoom
              ? "bg-emerald-50 text-emerald-700"
              : "bg-brand-50 text-brand-700"
          }`}
        >
          {isHasRoom ? "Has a room" : "Needs a room"}
        </span>
      </div>

      <h4 className="mt-4 font-medium text-slate-900">{listing.headline}</h4>
      <p className="mt-1 line-clamp-3 text-sm text-slate-600">{listing.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {listing.tags.map((t) => (
          <span
            key={t}
            className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
        <div>
          <span className="font-semibold text-slate-900">
            ${listing.budget.toLocaleString()}
          </span>
          <span className="text-slate-500">
            /mo {isHasRoom ? "rent" : "max"}
          </span>
        </div>
        {distance !== null && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {distance < 1 ? "<1" : Math.round(distance)} mi away
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => onMessage(listing)}
          className="flex-1 rounded-lg bg-brand-500 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          Message {listing.name}
        </button>
        {onBoost && !listing.boosted && (
          <button
            onClick={() => onBoost(listing)}
            title="Feature this listing at the top of local results"
            className="shrink-0 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
          >
            ★ Boost
          </button>
        )}
      </div>
    </article>
  );
}
