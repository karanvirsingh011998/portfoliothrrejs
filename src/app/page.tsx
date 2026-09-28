import { PortfolioExperience } from "@/components/portfolio/portfolio-experience";
import {
  BUILD_PROCESS,
  CAREER_STATS,
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  SKILLS,
  TIME_MACHINE,
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
          <h2>Career Stats</h2>
          <ul>
            {CAREER_STATS.map((stat) => (
              <li key={stat.id}>
                {"display" in stat && stat.display
                  ? stat.display
                  : `${stat.value}${stat.suffix}`}{" "}
                — {stat.label}
              </li>
            ))}
          </ul>
          <h2>Time Machine</h2>
          <ol>
            {TIME_MACHINE.map((era) => (
              <li key={era.year}>
                <strong>{era.year} — {era.title}</strong>: {era.summary}
              </li>
            ))}
          </ol>
          <h2>Projects</h2>
          {PROJECTS.map((p) => (
            <div key={p.id}>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p>{p.stack.join(", ")}</p>
            </div>
          ))}
          <h2>How I Build</h2>
          <ol>
            {BUILD_PROCESS.map((step) => (
              <li key={step.id}>
                <strong>{step.title}</strong> — {step.summary}
              </li>
            ))}
          </ol>
          <h2>Skills</h2>
          <p>{SKILLS.join(", ")}</p>
          <h2>Education</h2>
          {EDUCATION.map((e) => (
            <div key={e.degree}>
              <h3>{e.degree}</h3>
              <p>{e.institution} · {e.period}</p>
            </div>
          ))}
          <h2>Resume</h2>
          <p>
            <a href={PROFILE.resumeUrl}>View / download resume (PDF)</a>
          </p>
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
