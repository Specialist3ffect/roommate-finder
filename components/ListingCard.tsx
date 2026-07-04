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
}: {
  listing: Listing;
  distance: number | null;
  onMessage: (listing: Listing) => void;
}) {
  const isHasRoom = listing.kind === "has-room";
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: listing.avatarColor }}
        >
          {initials(listing.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-slate-900">
              {listing.name}, {listing.age}
            </h3>
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

      <button
        onClick={() => onMessage(listing)}
        className="mt-4 w-full rounded-lg bg-brand-500 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
      >
        Message {listing.name}
      </button>
    </article>
  );
}
