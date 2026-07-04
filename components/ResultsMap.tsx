"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Coords, Listing } from "@/lib/types";

interface ResultRow {
  listing: Listing;
  distance: number | null;
}

/** Recenters/zooms the map when the search origin or results change. */
function Recenter({
  origin,
  rows,
}: {
  origin: Coords | null;
  rows: ResultRow[];
}) {
  const map = useMap();
  useEffect(() => {
    if (origin) {
      map.setView([origin.lat, origin.lng], 10, { animate: true });
    } else if (rows.length) {
      const lats = rows.map((r) => r.listing.lat);
      const lngs = rows.map((r) => r.listing.lng);
      map.fitBounds(
        [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ],
        { padding: [40, 40] }
      );
    }
  }, [origin, rows, map]);
  return null;
}

export default function ResultsMap({
  rows,
  origin,
}: {
  rows: ResultRow[];
  origin: Coords | null;
}) {
  const center: [number, number] = origin
    ? [origin.lat, origin.lng]
    : rows.length
    ? [rows[0].listing.lat, rows[0].listing.lng]
    : [39.8283, -98.5795]; // geographic center of the US

  return (
    <MapContainer
      center={center}
      zoom={origin ? 10 : 4}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#e2e8f0" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {origin && (
        <CircleMarker
          center={[origin.lat, origin.lng]}
          radius={9}
          pathOptions={{
            color: "#1f57e0",
            fillColor: "#2f6df6",
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Popup>Search location: {origin.label}</Popup>
        </CircleMarker>
      )}

      {rows.map(({ listing, distance }) => (
        <CircleMarker
          key={listing.id}
          center={[listing.lat, listing.lng]}
          radius={8}
          pathOptions={{
            color: "#fff",
            weight: 2,
            fillColor:
              listing.kind === "has-room" ? "#10b981" : "#2f6df6",
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <div className="space-y-0.5">
              <p className="font-semibold">
                {listing.name}, {listing.age}
              </p>
              <p>{listing.headline}</p>
              <p className="text-slate-500">
                {listing.city}
                {distance !== null &&
                  ` · ${distance < 1 ? "<1" : Math.round(distance)} mi`}
              </p>
              <p className="font-medium">
                ${listing.budget.toLocaleString()}/mo
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      <Recenter origin={origin} rows={rows} />
    </MapContainer>
  );
}
