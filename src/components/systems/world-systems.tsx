"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
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
import { useGameStore } from "@/store/game-store";
import type { Project } from "@/types/portfolio";

function ExitBar({ label }: { label: string }) {
  const returnToWorld = useGameStore((s) => s.returnToWorld);
  return (
    <div className="pointer-events-auto fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="hud-frame px-3 py-2">
        <p className="hud-label">{PROFILE.systemId}</p>
        <p className="mt-0.5 text-[11px] tracking-[0.2em] text-foreground">{label}</p>
      </div>
      <button
        type="button"
        onClick={returnToWorld}
        className="hud-frame px-4 py-2 text-[11px] tracking-[0.28em] text-accent hover:bg-accent/10"
      >
        ← RETURN TO CITY
      </button>
    </div>
  );
}

function ExperienceInterior() {
  const roleIndex = useGameStore((s) => s.experienceRoleIndex);
  const setRole = useGameStore((s) => s.setExperienceRoleIndex);
  const role = EXPERIENCE[roleIndex];
  const isCurrent = roleIndex === 0;

  const techStack = isCurrent
    ? ["React", "Next.js", "TypeScript", "Tailwind", "shadcn/ui"]
    : ["MERN", "JWT", "OAuth", "MongoDB", "Socket.io"];
  const coreWork = isCurrent
    ? ["Architecture", "Performance", "APIs", "Code Reviews", "Mentoring"]
    : ["Admin dashboards", "RBAC", "CI/CD", "REST APIs", "Production"];

  return (
    <div className="interior-shell">
      <ExitBar label="ENGINEERING HQ // COMMAND CENTER" />
      {/* Atmospheric stage */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(91,141,239,0.18),transparent_50%),radial-gradient(ellipse_at_80%_60%,rgba(61,214,198,0.1),transparent_45%),linear-gradient(180deg,#020617_0%,#0a1628_50%,#020617_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(91,141,239,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(91,141,239,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="pointer-events-auto relative mx-auto flex h-full max-w-6xl flex-col justify-center gap-4 px-4 pb-8 pt-20 sm:gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={role.company}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45 }}
            className="grid gap-4 lg:grid-cols-12"
          >
            {/* Main holographic screen */}
            <div className="hud-frame hud-scan relative lg:col-span-6 min-h-[280px] p-6 sm:p-8">
              <p className="hud-label">PRIMARY DISPLAY</p>
              <p className="mt-4 text-[10px] tracking-[0.35em] text-muted">
                {isCurrent ? "ACTIVE MISSION" : "PREVIOUS MISSION"}
              </p>
              <h2 className="hud-title mt-2 text-3xl text-foreground sm:text-4xl">
                {role.company.toUpperCase()}
              </h2>
              <p className="mt-3 text-sm tracking-[0.15em] text-accent">
                {role.title.toUpperCase()}
              </p>
              <p className="mt-2 font-mono text-xs text-muted">{role.period}</p>
              <div className="hud-line my-5" />
              <p className="sys-terminal text-[11px] text-muted">
                OPERATOR // {PROFILE.name.toUpperCase()}
              </p>
            </div>

            {/* Tech stack screen */}
            <div className="hud-frame hud-scan lg:col-span-3 p-5">
              <p className="hud-label">TECH STACK</p>
              <div className="mt-4 flex flex-col gap-2">
                {techStack.map((t) => (
                  <div key={t} className="sys-row text-[11px]">
                    <span className="text-accent">▸</span>
                    <span className="flex-1 tracking-[0.15em]">{t.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core work screen */}
            <div className="hud-frame hud-scan lg:col-span-3 p-5">
              <p className="hud-label">CORE WORK</p>
              <div className="mt-4 flex flex-col gap-2">
                {coreWork.map((t) => (
                  <div key={t} className="sys-row text-[11px]">
                    <span className="text-accent-secondary">◆</span>
                    <span className="flex-1 tracking-[0.12em]">{t.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Full highlight stream */}
        <div className="hud-frame p-4 sm:p-5">
          <p className="hud-label">SIGNAL STREAM — HIGHLIGHTS</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {role.highlights.map((h) => (
              <span key={h} className="sys-chip">
                {h}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {EXPERIENCE.map((e, i) => (
              <button
                key={e.company}
                type="button"
                onClick={() => setRole(i)}
                className={`px-3 py-2 text-[10px] tracking-[0.2em] border ${
                  i === roleIndex
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-white/10 text-muted hover:border-accent/40"
                }`}
              >
                {i === 0 ? "CURRENT" : "ARCHIVE"} · {e.company.toUpperCase()}
              </button>
            ))}
          </div>
          {roleIndex === 0 && (
            <button
              type="button"
              onClick={() => setRole(1)}
              className="text-[11px] tracking-[0.25em] text-accent hover:underline"
            >
              NEXT MISSION → WITS INNOVATION LAB
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectDetailOS({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="interior-shell">
      <div className="pointer-events-auto fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="hud-frame px-3 py-2">
          <p className="hud-label">PROJECT.OS — CASE STUDY</p>
          <p className="text-[11px] tracking-[0.15em]">{project.name.toUpperCase()}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="hud-frame px-4 py-2 text-[11px] tracking-[0.25em] text-accent"
        >
          ← GARAGE
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,160,102,0.12),transparent_55%),#030712]" />

      <div className="pointer-events-auto relative mx-auto grid h-full max-w-6xl gap-4 px-4 pb-8 pt-20 lg:grid-cols-2">
        <div className="hud-frame hud-scan flex flex-col justify-center p-6 sm:p-8">
          <p className="hud-label">ENVIRONMENT</p>
          <div className="mt-6 flex flex-1 flex-col items-center justify-center">
            <div className="relative flex h-48 w-full max-w-sm items-center justify-center border border-accent-warm/30 bg-accent-warm/5">
              <div className="absolute left-2 top-2 h-3 w-3 border-l border-t border-accent-warm" />
              <div className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-accent-warm" />
              <p className="hud-title text-center text-xl text-accent-warm">
                {project.archetype.toUpperCase()}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {project.stack.map((s) => (
                <span key={s} className="sys-chip-warm sys-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hud-frame hud-scan overflow-y-auto p-6 sm:p-8">
          <p className="hud-label">MISSION BRIEF</p>
          <div className="mt-4 space-y-4 sys-terminal text-[12px]">
            <div>
              <p className="text-accent">PROBLEM</p>
              <p className="mt-1 text-muted">{project.caseStudy.problem}</p>
            </div>
            <div>
              <p className="text-accent">SOLUTION</p>
              <p className="mt-1 text-muted">{project.caseStudy.solution}</p>
            </div>
            <div>
              <p className="text-accent">ARCHITECTURE</p>
              <p className="mt-1 text-muted">{project.caseStudy.architecture}</p>
            </div>
            <div>
              <p className="text-accent">CHALLENGES</p>
              <ul className="mt-1 space-y-1 text-muted">
                {project.caseStudy.challenges.map((c) => (
                  <li key={c}>▸ {c}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-accent">OUTCOME</p>
              <p className="mt-1 text-muted">{project.caseStudy.outcome}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noreferrer"
                className="sys-chip hover:bg-accent/20"
              >
                LIVE DEMO
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="sys-chip hover:bg-accent/20"
              >
                GITHUB
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsInterior() {
  const openSystem = useGameStore((s) => s.openSystem);
  const selectedProjectId = useGameStore((s) => s.selectedProjectId);
  const activeSystem = useGameStore((s) => s.activeSystem);

  if (activeSystem === "project-detail") {
    const project = PROJECTS.find((p) => p.id === selectedProjectId);
    if (!project) return null;
    return (
      <ProjectDetailOS
        project={project}
        onBack={() => openSystem("projects")}
      />
    );
  }

  return (
    <div className="interior-shell">
      <ExitBar label="PROJECT GARAGE // UNDERGROUND BAY" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(232,160,102,0.15),transparent_50%),linear-gradient(180deg,#0c0a09,#1c1917_40%,#0c0a09)]" />

      <div className="pointer-events-auto relative mx-auto h-full max-w-6xl overflow-y-auto px-4 pb-10 pt-20">
        <div className="mb-6">
          <p className="hud-label">SELECT A STATION</p>
          <h2 className="hud-title mt-2 text-2xl sm:text-3xl">PROJECT BAYS</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <button
              key={project.id}
              type="button"
              onClick={() => openSystem("project-detail", project.id)}
              className="hud-frame hud-scan group relative p-5 text-left transition hover:border-accent-warm/50"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="hud-label">BAY {String(i + 1).padStart(2, "0")}</p>
                <span className="text-[9px] tracking-[0.2em] text-accent-warm">
                  {project.archetype.toUpperCase()}
                </span>
              </div>
              <p className="hud-title mt-3 text-base leading-snug text-foreground group-hover:text-accent-warm">
                {project.name.toUpperCase()}
              </p>
              <div className="hud-line my-3" />
              <p className="text-[10px] tracking-[0.12em] text-muted line-clamp-2">
                {project.missionObjective}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.keyFeatures.slice(0, 4).map((f) => (
                  <span key={f} className="sys-chip-warm sys-chip text-[9px]">
                    {f}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[10px] tracking-[0.3em] text-accent">
                INITIATE SHOWCASE →
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsInterior() {
  return (
    <div className="interior-shell">
      <ExitBar label="DEV LAB // HOLOGRAPHIC STACK" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(61,214,198,0.14),transparent_55%),#020617]" />
      <div className="pointer-events-auto relative mx-auto flex h-full max-w-5xl flex-col justify-center px-4 pb-8 pt-20">
        <p className="hud-label">NODE NETWORK</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span key={s} className="sys-chip">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-10 hud-frame hud-scan p-6">
          <p className="hud-label">ARCHITECTURE VISUALIZATION</p>
          <div className="mt-6 flex flex-col items-center gap-1 font-mono text-sm sm:flex-row sm:justify-center sm:gap-3">
            {ARCHITECTURE_FLOW.map((node, i) => (
              <div key={node} className="flex items-center gap-3">
                <span className="border border-accent/50 bg-accent/10 px-4 py-2 tracking-[0.2em]">
                  {node.toUpperCase()}
                </span>
                {i < ARCHITECTURE_FLOW.length - 1 && (
                  <span className="text-accent">↓</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {ARCHITECTURE_SIDES.map((s) => (
              <span key={s} className="sys-chip border-accent-secondary/40 text-accent-secondary">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIInterior() {
  return (
    <div className="interior-shell">
      <ExitBar label="AI LAB // RESEARCH CORE" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(167,139,250,0.2),transparent_50%),#030712]" />
      <div className="pointer-events-auto relative mx-auto flex h-full max-w-5xl flex-col justify-center px-4 pb-8 pt-20">
        <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border border-purple-400/40 bg-purple-500/10 shadow-[0_0_60px_rgba(167,139,250,0.35)]">
          <span className="hud-title text-sm text-purple-200">AI CORE</span>
        </div>
        <p className="text-center text-sm italic tracking-wide text-muted">
          {PROFILE.aiStatement}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {AI_NODES.map((n) => (
            <span key={n} className="sys-chip border-purple-400/40 text-purple-200">
              {n}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {AI_TOOLS.map((t) => (
            <span key={t} className="sys-chip">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-10 hud-frame p-5">
          <p className="hud-label text-center">WORKFLOW PIPELINE</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] tracking-[0.2em]">
            {AI_WORKFLOW.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="border border-purple-400/50 px-3 py-1.5 text-purple-100">
                  {step}
                </span>
                {i < AI_WORKFLOW.length - 1 && <span className="text-purple-300">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceInterior() {
  return (
    <div className="interior-shell">
      <ExitBar label="PERFORMANCE CENTER // PIPELINES" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(74,222,128,0.12),transparent_50%),#020617]" />
      <div className="pointer-events-auto relative mx-auto flex h-full max-w-5xl flex-col justify-center px-4 pb-8 pt-20">
        <p className="hud-label">DATA STREAMS</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {PERFORMANCE_TOPICS.map((t) => (
            <div key={t} className="hud-frame px-3 py-3 text-[11px] tracking-[0.15em]">
              <span className="text-success">▓</span> {t.toUpperCase()}
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            "FAST API REQUESTS",
            "EFFICIENT DATABASE QUERIES",
            "OPTIMIZED FRONTEND RENDERING",
          ].map((item) => (
            <div key={item} className="hud-frame hud-scan p-5 text-center">
              <div className="mx-auto mb-3 h-1 w-16 animate-pulse bg-success/60" />
              <p className="text-[11px] tracking-[0.2em] text-muted">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EducationInterior() {
  return (
    <div className="interior-shell">
      <ExitBar label="UNIVERSITY // ARCHIVES" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.1),transparent_50%),#0c0a09]" />
      <div className="pointer-events-auto relative mx-auto flex h-full max-w-3xl flex-col justify-center gap-4 px-4 pb-8 pt-20">
        {EDUCATION.map((edu) => (
          <div key={edu.degree} className="hud-frame hud-scan p-6 sm:p-8">
            <p className="hud-label">RECORD</p>
            <h3 className="hud-title mt-3 text-3xl text-accent-warm">{edu.degree}</h3>
            <p className="mt-2 tracking-[0.15em] text-foreground">{edu.institution}</p>
            <p className="mt-2 font-mono text-xs text-muted">{edu.period}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactInterior() {
  return (
    <div className="interior-shell">
      <ExitBar label="CONNECT HUB // SIGNAL UPLINK" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(251,113,133,0.15),transparent_50%),#030712]" />
      <div className="pointer-events-auto relative mx-auto flex h-full max-w-2xl flex-col justify-center px-4 pb-8 pt-20">
        <p className="hud-label text-center">TRANSMISSION</p>
        <h2 className="hud-title mt-3 text-center text-2xl sm:text-3xl">
          {PROFILE.contactQuote.toUpperCase()}
        </h2>
        <div className="mt-8 space-y-3">
          <a
            href={PROFILE.emailHref}
            className="hud-frame flex items-center gap-3 px-4 py-4 hover:bg-accent/5"
          >
            <Mail className="h-4 w-4 text-accent" />
            <span className="text-sm tracking-[0.1em]">{PROFILE.email}</span>
          </a>
          <a
            href={PROFILE.phoneHref}
            className="hud-frame flex items-center gap-3 px-4 py-4 hover:bg-accent/5"
          >
            <Phone className="h-4 w-4 text-accent" />
            <span className="text-sm tracking-[0.1em]">{PROFILE.phone}</span>
          </a>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={PROFILE.emailHref}
            className="border border-accent bg-accent/15 px-4 py-2 text-[11px] tracking-[0.25em] text-accent"
          >
            EMAIL
          </a>
          {PROFILE.linkedin && (
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hud-frame px-4 py-2 text-[11px] tracking-[0.25em]"
            >
              <Linkedin className="mr-2 inline h-3 w-3" />
              LINKEDIN
            </a>
          )}
          {PROFILE.github && (
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="hud-frame px-4 py-2 text-[11px] tracking-[0.25em]"
            >
              <Github className="mr-2 inline h-3 w-3" />
              GITHUB
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * In-world holographic systems — replaces generic portfolio panels.
 */
export function WorldSystems() {
  const activeSystem = useGameStore((s) => s.activeSystem);
  const worldMode = useGameStore((s) => s.worldMode);

  if (worldMode !== "interior") return null;
  if (
    activeSystem === "none" ||
    activeSystem === "pause" ||
    activeSystem === "missions"
  ) {
    return null;
  }

  if (activeSystem === "experience") return <ExperienceInterior />;
  if (activeSystem === "projects" || activeSystem === "project-detail")
    return <ProjectsInterior />;
  if (activeSystem === "skills") return <SkillsInterior />;
  if (activeSystem === "ai") return <AIInterior />;
  if (activeSystem === "performance") return <PerformanceInterior />;
  if (activeSystem === "education") return <EducationInterior />;
  if (activeSystem === "contact") return <ContactInterior />;
  return null;
}
