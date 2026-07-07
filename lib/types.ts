export type ListingKind = "has-room" | "needs-room";

export interface Listing {
  id: string;
  kind: ListingKind; // "has-room" = has a place + seeking roommate, "needs-room" = looking for a place
  name: string;
  age: number;
  headline: string;
  bio: string;
  city: string;
  lat: number;
  lng: number;
  budget: number; // monthly rent in USD (offered or max budget)
  moveIn: string; // ISO-ish date string
  tags: string[];
  avatarColor: string;
  verified?: boolean; // owner passed identity/email verification
  boosted?: boolean; // paid to appear at the top ("Featured")
}

export interface Coords {
  lat: number;
  lng: number;
  label: string;
}
