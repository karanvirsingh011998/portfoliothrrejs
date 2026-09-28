import type { Metadata } from "next";
import { LostInSpace } from "@/components/not-found/lost-in-space";

export const metadata: Metadata = {
  title: "404 — Lost in Space | Karanvir Singh",
  description:
    "This sector isn't on the map. Reacquire the home beacon to return to Karanvir City.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * App Router 404 — immersive "Lost in Space" experience instead of a plain error.
 */
export default function NotFound() {
  return <LostInSpace />;
}
