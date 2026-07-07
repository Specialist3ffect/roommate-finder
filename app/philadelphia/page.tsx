import type { Metadata } from "next";
import { CITIES } from "@/lib/cities";
import CityLanding from "@/components/CityLanding";

const city = CITIES.philadelphia;

export const metadata: Metadata = {
  title: city.metaTitle,
  description: city.metaDescription,
  keywords: city.keywords,
  alternates: { canonical: `/${city.slug}` },
  openGraph: {
    title: city.metaTitle,
    description: city.metaDescription,
    url: `/${city.slug}`,
    type: "website",
  },
};

export default function PhiladelphiaPage() {
  return <CityLanding config={city} />;
}
