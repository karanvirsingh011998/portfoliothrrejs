import { PortfolioExperience } from "@/components/portfolio/portfolio-experience";
import {
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  SKILLS,
} from "@/data/portfolio";

/**
 * Server-rendered page shell with crawlable HTML for SEO.
 * Client hydrates the scroll-driven cinematic portfolio.
 */
export default function HomePage() {
  return (
    <>
      <PortfolioExperience />

      {/* Noscript / crawlable fallback content */}
      <noscript>
        <main style={{ maxWidth: 720, margin: "0 auto", padding: 24, color: "#e8eef8" }}>
          <h1>{PROFILE.name}</h1>
          <p>{PROFILE.title} · {PROFILE.experienceYears} years experience</p>
          <p>
            MERN Stack Developer with 4+ years of experience building scalable web
            applications using React, Next.js, Node.js, TypeScript and MongoDB.
          </p>
          <h2>Experience</h2>
          {EXPERIENCE.map((role) => (
            <div key={role.company}>
              <h3>{role.company}</h3>
              <p>{role.title} · {role.period}</p>
              <p>{role.highlights.join(", ")}</p>
            </div>
          ))}
          <h2>Projects</h2>
          {PROJECTS.map((p) => (
            <div key={p.id}>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p>{p.stack.join(", ")}</p>
            </div>
          ))}
          <h2>Skills</h2>
          <p>{SKILLS.join(", ")}</p>
          <h2>Education</h2>
          {EDUCATION.map((e) => (
            <div key={e.degree}>
              <h3>{e.degree}</h3>
              <p>{e.institution} · {e.period}</p>
            </div>
          ))}
          <h2>Contact</h2>
          <p>
            <a href={PROFILE.emailHref}>{PROFILE.email}</a>
          </p>
          <p>
            <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
          </p>
        </main>
      </noscript>
    </>
  );
}
