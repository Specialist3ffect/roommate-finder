import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import FloatingBeds from "@/components/FloatingBeds";

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
      <body>
        <div className="bg-grid" aria-hidden="true" />
        <FloatingBeds />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
