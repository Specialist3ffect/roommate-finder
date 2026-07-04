import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoomMatch — Find your next roommate nearby",
  description:
    "Search for roommates and available rooms near you. Use your location or any city to find matches within your budget.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
