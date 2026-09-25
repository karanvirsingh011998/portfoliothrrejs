"use client";

import { ScrollPortfolio } from "@/components/portfolio/scroll-portfolio";
import { PROFILE } from "@/data/portfolio";

/**
 * Primary experience: scroll-driven cinematic sections.
 * No 3D city exploration.
 */
export function PortfolioExperience() {
  return (
    <>
      <div className="sr-only">
        <h1>{PROFILE.name} | MERN Stack Developer</h1>
        <p>
          MERN Stack Developer with 4+ years of experience building scalable web
          applications using React, Next.js, Node.js, TypeScript and MongoDB.
        </p>
      </div>
      <ScrollPortfolio />
    </>
  );
}
