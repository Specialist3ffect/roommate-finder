import type { Listing } from "./types";
import { supabase, isSupabaseConfigured } from "./supabase";

const STORAGE_KEY = "roommatch:listings";

/** Shape of a row in the Supabase `listings` table (snake_case columns). */
interface ListingRow {
  id: string;
  kind: Listing["kind"];
  name: string;
  age: number;
  headline: string;
  bio: string;
  city: string;
  lat: number;
  lng: number;
  budget: number;
  move_in: string | null;
  tags: string[];
  avatar_color: string;
}

function rowToListing(r: ListingRow): Listing {
  return {
    id: r.id,
    kind: r.kind,
    name: r.name,
    age: r.age,
    headline: r.headline,
    bio: r.bio,
    city: r.city,
    lat: r.lat,
    lng: r.lng,
    budget: r.budget,
    moveIn: r.move_in ?? "",
    tags: r.tags ?? [],
    avatarColor: r.avatar_color,
  };
}

function listingToRow(l: Listing): Omit<ListingRow, "id"> {
  return {
    kind: l.kind,
    name: l.name,
    age: l.age,
    headline: l.headline,
    bio: l.bio,
    city: l.city,
    lat: l.lat,
    lng: l.lng,
    budget: l.budget,
    move_in: l.moveIn || null,
    tags: l.tags,
    avatar_color: l.avatarColor,
  };
}

function readLocal(): Listing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Listing[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(items: Listing[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota / disabled storage */
  }
}

/** Fetch user-created listings (newest first) from Supabase or localStorage. */
export async function fetchUserListings(): Promise<Listing[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase fetch failed, falling back to local:", error.message);
      return readLocal();
    }
    return (data as ListingRow[]).map(rowToListing);
  }
  return readLocal();
}

/**
 * Persist a new listing. Returns the stored listing (with a server id when
 * Supabase is used). Falls back to localStorage in demo mode.
 */
export async function createUserListing(listing: Listing): Promise<Listing> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("listings")
      .insert(listingToRow(listing))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rowToListing(data as ListingRow);
  }
  const next = [listing, ...readLocal()];
  writeLocal(next);
  return listing;
}
