"use client";

import {
  AI_NODES,
  AI_TOOLS,
  AI_WORKFLOW,
  ARCHITECTURE_FLOW,
  ARCHITECTURE_SIDES,
  EDUCATION,
  EXPERIENCE,
  PERFORMANCE_TOPICS,
  PROFILE,
  PROJECTS,
  SKILLS,
} from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { useGameStore } from "@/store/game-store";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "ai", label: "AI" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export function TraditionalPortfolio() {
  const webglOk = useGameStore((s) => s.webglOk);
  const setForce2D = useGameStore((s) => s.setForce2D);
  const setPhase = useGameStore((s) => s.setPhase);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(61,214,198,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(91,141,239,0.1),transparent_45%)]" />

      <header className="sticky top-0 z-40 border-b border-panel-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <a href="#home" className="text-sm font-semibold tracking-[0.2em]">
            {PROFILE.name.toUpperCase()}
          </a>
          <nav className="hidden items-center gap-4 text-xs tracking-[0.15em] text-muted md:flex">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="hover:text-accent">
                {s.label.toUpperCase()}
              </a>
            ))}
          </nav>
          {webglOk && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setForce2D(false);
                setPhase("intro");
              }}
            >
              Enter 3D World
            </Button>
          )}
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 pb-24">
        <section id="home" className="flex min-h-[70vh] flex-col justify-center py-16">
          <p className="text-xs tracking-[0.35em] text-accent">MERN STACK DEVELOPER</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
            {PROFILE.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Full-Stack Engineer with {PROFILE.experienceYears} years of experience building
            scalable web applications using React, Next.js, Node.js, TypeScript and MongoDB.
          </p>
          <p className="mt-3 font-mono text-sm text-accent-secondary">{PROFILE.stackLine}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href="#contact">Contact</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#projects">View Projects</a>
            </Button>
          </div>
        </section>

        <section id="about" className="py-16">
          <h2 className="text-2xl font-semibold tracking-wide">About</h2>
          <p className="mt-4 max-w-3xl text-muted leading-relaxed">
            {PROFILE.tagline} I design and ship production web applications across the MERN
            stack — from component architecture and REST APIs to performance optimization,
            authentication, and AI-assisted development workflows.
          </p>
        </section>

        <section id="experience" className="py-16">
          <h2 className="text-2xl font-semibold tracking-wide">Experience</h2>
          <div className="mt-8 space-y-6">
            {EXPERIENCE.map((role) => (
              <article
                key={role.company}
                className="rounded-xl border border-panel-border bg-white/[0.03] p-6"
              >
                <h3 className="text-xl font-semibold">{role.company}</h3>
                <p className="mt-1 text-accent">{role.title}</p>
                <p className="mt-1 font-mono text-xs text-muted">{role.period}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {role.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded border border-accent/20 bg-accent/10 px-2 py-1 text-xs"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="py-16">
          <h2 className="text-2xl font-semibold tracking-wide">Projects</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {PROJECTS.map((project) => (
              <article
                key={project.id}
                className="rounded-xl border border-panel-border bg-white/[0.03] p-5"
              >
                <h3 className="font-semibold">{project.name}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-accent-warm/15 px-1.5 py-0.5 text-[10px] text-accent-warm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted">{project.description}</p>
                <ul className="mt-3 space-y-1 text-xs text-muted">
                  {project.keyFeatures.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <details className="mt-4 text-sm">
                  <summary className="cursor-pointer text-accent">Case study</summary>
                  <div className="mt-3 space-y-3 text-muted">
                    <p>
                      <strong className="text-foreground">Problem:</strong>{" "}
                      {project.caseStudy.problem}
                    </p>
                    <p>
                      <strong className="text-foreground">Solution:</strong>{" "}
                      {project.caseStudy.solution}
                    </p>
                    <p>
                      <strong className="text-foreground">Architecture:</strong>{" "}
                      {project.caseStudy.architecture}
                    </p>
                    <p>
                      <strong className="text-foreground">Outcome:</strong>{" "}
                      {project.caseStudy.outcome}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.liveDemo && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noreferrer"
                          >
                            LIVE DEMO
                          </a>
                        </Button>
                      )}
                      {project.github && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                          >
                            GITHUB
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </details>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="py-16">
          <h2 className="text-2xl font-semibold tracking-wide">Skills</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-10">
            <h3 className="text-sm tracking-[0.2em] text-accent">ARCHITECTURE</h3>
            <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-sm">
              {ARCHITECTURE_FLOW.map((node, i) => (
                <span key={node} className="flex items-center gap-2">
                  <span className="rounded border border-panel-border px-3 py-1.5">{node}</span>
                  {i < ARCHITECTURE_FLOW.length - 1 && <span className="text-accent">→</span>}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {ARCHITECTURE_SIDES.map((s) => (
                <span
                  key={s}
                  className="rounded border border-accent-secondary/40 px-3 py-1 text-xs text-accent-secondary"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <h3 className="text-sm tracking-[0.2em] text-accent">PERFORMANCE</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {PERFORMANCE_TOPICS.map((t) => (
                <span
                  key={t}
                  className="rounded border border-success/30 bg-success/5 px-3 py-1.5 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="ai" className="py-16">
          <h2 className="text-2xl font-semibold tracking-wide">AI Development</h2>
          <p className="mt-4 max-w-3xl text-muted italic">{PROFILE.aiStatement}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {AI_NODES.map((n) => (
              <span key={n} className="rounded border border-panel-border px-2 py-1 text-xs">
                {n}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {AI_TOOLS.map((t) => (
              <span
                key={t}
                className="rounded bg-accent-secondary/15 px-2 py-1 text-xs text-accent-secondary"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs">
            {AI_WORKFLOW.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded border border-accent/40 px-2 py-1">{step}</span>
                {i < AI_WORKFLOW.length - 1 && <span className="text-accent">→</span>}
              </span>
            ))}
          </div>
        </section>

        <section id="education" className="py-16">
          <h2 className="text-2xl font-semibold tracking-wide">Education</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {EDUCATION.map((edu) => (
              <article
                key={edu.degree}
                className="rounded-xl border border-panel-border bg-white/[0.03] p-5"
              >
                <h3 className="text-xl font-semibold">{edu.degree}</h3>
                <p className="mt-1 text-accent">{edu.institution}</p>
                <p className="mt-1 font-mono text-xs text-muted">{edu.period}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="py-16">
          <h2 className="text-2xl font-semibold tracking-wide">Contact</h2>
          <p className="mt-3 text-lg text-muted">{PROFILE.contactQuote}</p>
          <div className="mt-6 space-y-3">
            <a
              href={PROFILE.emailHref}
              className="flex items-center gap-3 rounded-lg border border-panel-border p-4 hover:bg-white/5"
            >
              <Mail className="h-5 w-5 text-accent" />
              {PROFILE.email}
            </a>
            <a
              href={PROFILE.phoneHref}
              className="flex items-center gap-3 rounded-lg border border-panel-border p-4 hover:bg-white/5"
            >
              <Phone className="h-5 w-5 text-accent" />
              {PROFILE.phone}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a href={PROFILE.emailHref}>
                <Mail className="h-4 w-4" /> EMAIL
              </a>
            </Button>
            {PROFILE.linkedin && (
              <Button variant="secondary" asChild>
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin className="h-4 w-4" /> LINKEDIN
                </a>
              </Button>
            )}
            {PROFILE.github && (
              <Button variant="secondary" asChild>
                <a href={PROFILE.github} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" /> GITHUB
                </a>
              </Button>
            )}
          </div>
        </section>
      </main>

      {/* SEO-friendly crawlable content duplicate is the main content above */}
      <footer className="border-t border-panel-border/60 py-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} {PROFILE.name} · {PROFILE.cityName}
      </footer>
    </div>
  );
}
