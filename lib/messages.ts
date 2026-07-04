import { supabase, isSupabaseConfigured } from "./supabase";

const STORAGE_KEY = "roommatch:messages";

export interface Inquiry {
  listingId: string;
  senderName: string;
  senderEmail: string;
  body: string;
}

/**
 * Send an inquiry to a listing. Uses the Supabase `messages` table when
 * configured, otherwise records it in localStorage (demo mode).
 */
export async function sendInquiry(inquiry: Inquiry): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("messages").insert({
      listing_id: inquiry.listingId,
      sender_name: inquiry.senderName,
      sender_email: inquiry.senderEmail,
      body: inquiry.body,
    });
    if (error) throw new Error(error.message);
    return;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as Inquiry[]) : [];
    all.push(inquiry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
