"use client";

import { useState } from "react";
import type { Listing } from "@/lib/types";
import { sendInquiry } from "@/lib/messages";

export default function ContactModal({
  listing,
  onClose,
}: {
  listing: Listing | null;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!listing) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !body) {
      setError("All fields are required.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setSending(true);
    try {
      await sendInquiry({
        listingId: listing!.id,
        senderName: name,
        senderEmail: email,
        body,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  const field =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Message {listing.name}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {sent ? (
          <div className="mt-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              ✓
            </div>
            <p className="mt-3 font-medium text-slate-900">Message sent!</p>
            <p className="mt-1 text-sm text-slate-500">
              {listing.name} will see your note about &ldquo;{listing.headline}
              &rdquo;.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-lg bg-brand-500 py-2.5 font-medium text-white hover:bg-brand-600"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <p className="text-sm text-slate-500">
              Re: <span className="font-medium">{listing.headline}</span> ·{" "}
              {listing.city}
            </p>
            <input
              className={field}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={field}
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              className={`${field} min-h-[100px] resize-none`}
              placeholder={`Hi ${listing.name}, I'm interested in your listing…`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={2000}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-lg bg-brand-500 py-2.5 font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
