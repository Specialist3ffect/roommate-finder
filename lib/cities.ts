export interface CityConfig {
  slug: string; // route, e.g. "austin"
  name: string; // display, e.g. "Austin, TX"
  searchQuery: string; // what to pass to /?place=
  match: string; // substring to match against listing.city
  eyebrow: string; // pill text under the logo
  headline: string; // hero H1
  subhead: string; // hero paragraph
  neighborhoods: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const CITIES: Record<string, CityConfig> = {
  austin: {
    slug: "austin",
    name: "Austin, TX",
    searchQuery: "Austin, TX",
    match: "Austin",
    eyebrow: "Austin, TX · UT students & young professionals",
    headline: "Find your Austin roommate near campus",
    subhead:
      "Verified rooms and roommates for students and young professionals around UT Austin and downtown. Filter by neighborhood, budget, and move-in date.",
    neighborhoods: [
      "West Campus",
      "Hyde Park",
      "East Austin",
      "North Loop",
      "Riverside",
      "Downtown",
    ],
    metaTitle:
      "Roommates near UT Austin — Students & Young Professionals | RoomMatch",
    metaDescription:
      "Find a verified roommate near UT Austin and downtown. Browse rooms and roommates for students and young professionals in Austin, TX — search by neighborhood and budget.",
    keywords: [
      "Austin roommates",
      "UT Austin roommate",
      "roommate finder Austin",
      "rooms for rent Austin",
      "student housing Austin",
    ],
  },
  philadelphia: {
    slug: "philadelphia",
    name: "Philadelphia, PA",
    searchQuery: "Philadelphia, PA",
    match: "Philadelphia",
    eyebrow: "Philadelphia, PA · Penn, Drexel & Temple students + young pros",
    headline: "Find your Philly roommate near campus",
    subhead:
      "Verified rooms and roommates for students and young professionals around Penn, Drexel, Temple, and Center City. Filter by neighborhood, budget, and move-in date.",
    neighborhoods: [
      "University City",
      "Fishtown",
      "Northern Liberties",
      "Rittenhouse",
      "Graduate Hospital",
      "Old City",
    ],
    metaTitle:
      "Roommates in Philadelphia — Penn, Drexel & Temple | RoomMatch",
    metaDescription:
      "Find a verified roommate in Philadelphia near Penn, Drexel, Temple, and Center City. Browse rooms and roommates for students and young professionals — search by neighborhood and budget.",
    keywords: [
      "Philadelphia roommates",
      "Penn roommate",
      "Drexel roommate",
      "Temple roommate",
      "roommate finder Philadelphia",
      "rooms for rent Philadelphia",
    ],
  },
};
