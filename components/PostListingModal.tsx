"use client";

import { useState } from "react";
import type { Listing, ListingKind } from "@/lib/types";
import { geocode } from "@/lib/geo";
import { createUserListing } from "@/lib/listings";

export default function PostListingModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (listing: Listing) => void;
}) {
  const [kind, setKind] = useState<ListingKind>("has-room");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !city || !headline) {
      setError("Name, city, and a headline are required.");
      return;
    }
    setSubmitting(true);
    const coords = await geocode(city);
    setSubmitting(false);
    if (!coords) {
      setError("Couldn't find that city. Try a more specific location.");
      return;
    }

    const draft: Listing = {
      id: `u-${Date.now()}`,
      kind,
      name,
      age: Number(age) || 25,
      headline,
      bio: bio || "No bio yet.",
      city: coords.label,
      lat: coords.lat,
      lng: coords.lng,
      budget: Number(budget) || 1000,
      moveIn: new Date().toISOString().slice(0, 10),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 4),
      avatarColor: "#1f57e0",
    };

    setSubmitting(true);
    try {
      const saved = await createUserListing(draft);
      onCreate(saved);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't save your listing."
      );
      setSubmitting(false);
      return;
    }
    setSubmitting(false);

    // reset
    setName("");
    setAge("");
    setHeadline("");
    setBio("");
    setCity("");
    setBudget("");
    setTags("");
  }

  const field =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Post a listing</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setKind("has-room")}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                kind === "has-room"
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              I have a room
            </button>
            <button
              type="button"
              onClick={() => setKind("needs-room")}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                kind === "needs-room"
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              I need a room
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              className={`${field} col-span-2`}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={field}
              placeholder="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <input
            className={field}
            placeholder="Headline (e.g. Sunny room near downtown)"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />

          <textarea
            className={`${field} min-h-[80px] resize-none`}
            placeholder="A short bio…"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              className={field}
              placeholder="City (e.g. Denver, CO)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className={field}
              placeholder={kind === "has-room" ? "Rent $/mo" : "Max budget $/mo"}
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <input
            className={field}
            placeholder="Tags, comma separated (Non-smoker, Pet-friendly)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-500 py-2.5 font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {submitting ? "Locating…" : "Publish listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
