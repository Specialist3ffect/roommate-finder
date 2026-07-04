import type { Coords } from "./types";

/** Haversine distance between two lat/lng points, in miles. */
export function distanceMiles(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const R = 3958.8; // Earth radius in miles
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Geocode a free-text place using OpenStreetMap's Nominatim API.
 * No API key required. Returns null if nothing is found.
 */
export async function geocode(query: string): Promise<Coords | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: { "Accept-Language": "en" },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;
  if (!data.length) return null;

  const top = data[0];
  return {
    lat: parseFloat(top.lat),
    lng: parseFloat(top.lon),
    label: top.display_name.split(",").slice(0, 2).join(", "),
  };
}

/** Reverse-geocode browser coordinates into a human-readable label. */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));
    url.searchParams.set("format", "json");
    const res = await fetch(url.toString());
    if (!res.ok) return "Your location";
    const data = (await res.json()) as {
      address?: Record<string, string>;
    };
    const a = data.address ?? {};
    const place = a.city || a.town || a.village || a.suburb || a.county;
    const region = a.state || a.country;
    return [place, region].filter(Boolean).join(", ") || "Your location";
  } catch {
    return "Your location";
  }
}
