"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
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
import { RotatingRole } from "@/components/portfolio/rotating-role";

const SECTIONS = [
  { id: "home", label: "HOME", code: "00", hue: "0 200 180" },
  { id: "experience", label: "EXPERIENCE", code: "01", hue: "91 141 239" },
  { id: "projects", label: "PROJECTS", code: "02", hue: "232 160 102" },
  { id: "skills", label: "TECH STACK", code: "03", hue: "61 214 198" },
  { id: "ai", label: "AI LAB", code: "04", hue: "167 139 250" },
  { id: "performance", label: "PERFORMANCE", code: "05", hue: "74 222 128" },
  { id: "education", label: "EDUCATION", code: "06", hue: "251 191 36" },
  { id: "contact", label: "CONTACT", code: "07", hue: "251 113 133" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, delay: i * 0.07, ease: easeOut },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.35 }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

function TypeLine({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <motion.span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ delay: i * 0.018, duration: 0.25 }}
          className="inline-block"
          style={{ whiteSpace: ch === " " ? "pre" : undefined }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

function FloatingOrbs({ accent }: { accent: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 280 + i * 80,
            height: 280 + i * 80,
            background: `radial-gradient(circle, rgba(${accent},0.28), transparent 70%)`,
            left: `${15 + i * 28}%`,
            top: `${10 + i * 18}%`,
          }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function SectionShell({
  id,
  children,
  accentRgb,
  active,
}: {
  id: string;
  children: React.ReactNode;
  accentRgb: string;
  active: boolean;
}) {
  return (
    <section
      id={id}
      className="relative flex min-h-[100dvh] w-full snap-start snap-always flex-col justify-center px-5 py-24 sm:px-10 lg:px-16"
    >
      <FloatingOrbs accent={accentRgb} />
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: active
            ? `radial-gradient(ellipse at 30% 20%, rgba(${accentRgb},0.22), transparent 55%)`
            : `radial-gradient(ellipse at 30% 20%, rgba(${accentRgb},0.08), transparent 55%)`,
        }}
        transition={{ duration: 0.8 }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `linear-gradient(rgba(${accentRgb},0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(${accentRgb},0.15) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />
      {/* scanning sweep when active */}
      {active && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-white/[0.04] to-transparent"
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
        />
      )}
      <div className="relative z-10 mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function ScrollPortfolio() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<SectionId>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [clock, setClock] = useState("00:00:00");
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [booting, setBooting] = useState(true);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ container: scrollerRef });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const progressPct = useTransform(progress, (v) => `${Math.round(v * 100)}%`);
  const progressWidth = useTransform(progress, (v) => `${v * 100}%`);

  const activeMeta = useMemo(
    () => SECTIONS.find((s) => s.id === active) ?? SECTIONS[0],
    [active]
  );

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), reduce ? 0 : 1600);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setClock(
        [d.getHours(), d.getMinutes(), d.getSeconds()]
          .map((n) => String(n).padStart(2, "0"))
          .join(":")
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Auto-cycle experience roles when on that section
  useEffect(() => {
    if (active !== "experience" || reduce) return;
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % EXPERIENCE.length);
    }, 6000);
    return () => clearInterval(id);
  }, [active, reduce]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActive(visible.target.id as SectionId);
        }
      },
      { root, threshold: [0.4, 0.55, 0.7] }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursor({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const goTo = useCallback((id: SectionId) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const role = EXPERIENCE[roleIndex];
  const selectedProject = PROJECTS.find((p) => p.id === projectId);
  const sectionIndex = SECTIONS.findIndex((s) => s.id === active);

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-background text-foreground">
      {/* Cursor spotlight */}
      {!reduce && (
        <div
          className="pointer-events-none fixed inset-0 z-[5] transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${cursor.x}% ${cursor.y}%, rgba(${activeMeta.hue},0.12), transparent 45%)`,
          }}
        />
      )}

      {/* Boot overlay */}
      <AnimatePresence>
        {booting && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p
              className="hud-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {PROFILE.systemId}
            </motion.p>
            <motion.div
              className="mt-6 h-[2px] w-48 overflow-hidden bg-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </motion.div>
            <motion.p
              className="mt-4 text-[10px] tracking-[0.35em] text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.4 }}
            >
              INITIALIZING INTERFACE
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top progress bar */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-[2px] origin-left bg-accent shadow-[0_0_12px_var(--accent)]"
        style={{ width: progressWidth }}
      />

      {/* Fixed HUD */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-4 p-4 pt-3 sm:p-5 sm:pt-4">
        <motion.div
          className="pointer-events-auto hud-frame hud-scan max-w-[min(340px,calc(100vw-5rem))] px-4 py-3"
          key={active}
          initial={reduce ? false : { opacity: 0.6, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="hud-label">{PROFILE.systemId}</span>
            <span className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-success">
              <span className="hud-status-dot" /> ONLINE
            </span>
          </div>
          <div className="hud-line my-2" />
          <p className="hud-title text-sm">{PROFILE.name.toUpperCase()}</p>
          <p className="mt-1 text-[10px] tracking-[0.2em] text-muted">
            {PROFILE.title.toUpperCase()}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="mt-3 sys-terminal text-[10px] text-muted"
            >
              <div className="flex justify-between gap-2">
                <span>SECTOR</span>
                <span className="text-accent">
                  {activeMeta.code} — {activeMeta.label}
                </span>
              </div>
              <div className="mt-1 flex justify-between gap-2">
                <span>PROGRESS</span>
                <motion.span className="text-foreground/80">{progressPct}</motion.span>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <div className="hud-frame hidden px-3 py-2 text-[10px] tracking-[0.25em] text-muted sm:block">
            {PROFILE.worldCodename}
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="hud-frame px-4 py-2 text-[11px] tracking-[0.3em] text-accent hover:bg-accent/10"
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </header>

      {/* Side nav with live fill */}
      <nav className="pointer-events-none fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        {SECTIONS.map((s, i) => {
          const isActive = active === s.id;
          const passed = i <= sectionIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(s.id)}
              className="pointer-events-auto group flex items-center justify-end gap-3"
              aria-label={s.label}
            >
              <motion.span
                className="hidden text-[9px] tracking-[0.2em] xl:inline"
                animate={{
                  opacity: isActive ? 1 : 0,
                  x: isActive ? 0 : 6,
                  color: isActive ? "rgb(61,214,198)" : "rgb(122,138,163)",
                }}
              >
                {s.label}
              </motion.span>
              <motion.span
                className="relative block h-2.5 w-2.5 rotate-45 border"
                animate={{
                  borderColor: isActive
                    ? "rgb(61,214,198)"
                    : passed
                      ? "rgba(61,214,198,0.45)"
                      : "rgba(255,255,255,0.25)",
                  backgroundColor: isActive
                    ? "rgb(61,214,198)"
                    : "transparent",
                  scale: isActive ? 1.25 : 1,
                  boxShadow: isActive
                    ? "0 0 12px rgba(61,214,198,0.7)"
                    : "0 0 0 transparent",
                }}
                whileHover={{ scale: 1.4 }}
              />
            </button>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-between gap-4 p-4 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="hud-frame px-3 py-2 text-[10px] tracking-[0.18em] text-muted"
          >
            SECTOR {activeMeta.code} — {activeMeta.label}
          </motion.div>
        </AnimatePresence>
        <div className="hidden items-center gap-3 text-[10px] tracking-[0.2em] text-muted sm:flex">
          <span>SCROLL</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ↓
          </motion.span>
          <span>· {clock}</span>
        </div>
      </div>

      {/* Overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="hud-frame hud-scan w-full max-w-md p-6"
            >
              <p className="hud-label text-center">NAVIGATION</p>
              <h2 className="hud-title mt-2 text-center text-xl">
                {PROFILE.name.toUpperCase()}
              </h2>
              <div className="hud-line my-4" />
              <nav className="flex flex-col gap-1.5">
                {SECTIONS.map((s, i) => (
                  <motion.button
                    key={s.id}
                    type="button"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => goTo(s.id)}
                    className={`border px-4 py-2.5 text-left text-[11px] tracking-[0.22em] transition ${
                      active === s.id
                        ? "border-accent bg-accent/15 text-accent"
                        : "border-white/10 text-foreground hover:border-accent/40"
                    }`}
                  >
                    <span className="mr-3 text-muted">{s.code}</span>
                    {s.label}
                  </motion.button>
                ))}
              </nav>
              <button
                type="button"
                className="mt-5 w-full border border-accent/40 py-2.5 text-[11px] tracking-[0.3em] text-accent"
                onClick={() => setMenuOpen(false)}
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 backdrop-blur-md sm:p-8"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mx-auto max-w-3xl"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="hud-label">CASE STUDY</p>
                <button
                  type="button"
                  onClick={() => setProjectId(null)}
                  className="hud-frame px-4 py-2 text-[11px] tracking-[0.25em] text-accent"
                >
                  CLOSE
                </button>
              </div>
              <div className="hud-frame hud-scan p-6 sm:p-8">
                <h2 className="hud-title text-2xl sm:text-3xl">
                  {selectedProject.name.toUpperCase()}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedProject.stack.map((t) => (
                    <span key={t} className="sys-chip">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-6 space-y-4 sys-terminal text-[12px]">
                  {(
                    [
                      ["PROBLEM", selectedProject.caseStudy.problem],
                      ["SOLUTION", selectedProject.caseStudy.solution],
                      ["ARCHITECTURE", selectedProject.caseStudy.architecture],
                      ["OUTCOME", selectedProject.caseStudy.outcome],
                    ] as const
                  ).map(([label, body], i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                    >
                      <p className="text-accent">{label}</p>
                      <p className="mt-1 text-muted">{body}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedProject.liveDemo && (
                    <a
                      href={selectedProject.liveDemo}
                      target="_blank"
                      rel="noreferrer"
                      className="sys-chip hover:bg-accent/20"
                    >
                      LIVE DEMO
                    </a>
                  )}
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="sys-chip hover:bg-accent/20"
                    >
                      GITHUB
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll container */}
      <div
        ref={scrollerRef}
        className="h-[100dvh] snap-y snap-mandatory overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        {/* HOME */}
        <SectionShell
          id="home"
          accentRgb={SECTIONS[0].hue}
          active={active === "home"}
        >
          <Reveal>
            <p className="hud-label">BOOT SEQUENCE COMPLETE</p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="hud-title mt-4 text-4xl leading-tight sm:text-6xl lg:text-7xl">
              <TypeLine text={PROFILE.name.toUpperCase()} />
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <div className="mt-4 text-sm tracking-[0.35em] text-accent sm:text-base">
              <RotatingRole />
            </div>
          </Reveal>
          <Reveal delay={3}>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              MERN Stack Developer with {PROFILE.experienceYears} years of
              experience building scalable web applications using React, Next.js,
              Node.js, TypeScript and MongoDB.
            </p>
          </Reveal>
          <Reveal delay={4}>
            <p className="mt-4 font-mono text-[11px] tracking-[0.25em] text-accent-secondary">
              {PROFILE.stackLine}
            </p>
          </Reveal>
          <Reveal delay={5}>
            <div className="mt-10 flex flex-wrap gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => goTo("experience")}
                className="border border-accent bg-accent/15 px-6 py-3 text-[11px] tracking-[0.3em] text-accent hover:bg-accent/25"
              >
                BEGIN — EXPERIENCE
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => goTo("contact")}
                className="hud-frame px-6 py-3 text-[11px] tracking-[0.3em]"
              >
                CONTACT
              </motion.button>
            </div>
          </Reveal>
          <Reveal delay={6}>
            <motion.p
              className="mt-16 text-[10px] tracking-[0.35em] text-muted"
              animate={{ opacity: [0.4, 1, 0.4], y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ↓ SCROLL TO CONTINUE
            </motion.p>
          </Reveal>
        </SectionShell>

        {/* EXPERIENCE */}
        <SectionShell
          id="experience"
          accentRgb={SECTIONS[1].hue}
          active={active === "experience"}
        >
          <Reveal>
            <p className="hud-label">SECTOR 01 — ENGINEERING HQ</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="hud-title mt-3 text-3xl sm:text-5xl">EXPERIENCE</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 lg:grid-cols-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={role.company}
                initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -30, filter: "blur(6px)" }}
                transition={{ duration: 0.45 }}
                className="hud-frame hud-scan lg:col-span-7 p-6 sm:p-8"
              >
                <p className="text-[10px] tracking-[0.3em] text-muted">
                  {roleIndex === 0 ? "ACTIVE MISSION" : "PREVIOUS MISSION"}
                </p>
                <h3 className="hud-title mt-3 text-2xl sm:text-3xl">
                  {role.company.toUpperCase()}
                </h3>
                <p className="mt-2 text-sm tracking-[0.15em] text-accent">
                  {role.title.toUpperCase()}
                </p>
                <p className="mt-2 font-mono text-xs text-muted">{role.period}</p>
                <div className="hud-line my-5" />
                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                >
                  {role.highlights.map((h) => (
                    <motion.span
                      key={h}
                      variants={fadeUp}
                      className="sys-chip"
                      whileHover={{ scale: 1.06 }}
                    >
                      {h}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <div className="flex flex-col gap-3 lg:col-span-5">
              {EXPERIENCE.map((e, i) => (
                <motion.button
                  key={e.company}
                  type="button"
                  onClick={() => setRoleIndex(i)}
                  whileHover={{ x: 4 }}
                  className={`hud-frame p-4 text-left transition ${
                    i === roleIndex ? "border-accent/60 bg-accent/10" : ""
                  }`}
                >
                  <p className="hud-label">{i === 0 ? "CURRENT" : "ARCHIVE"}</p>
                  <p className="mt-1 text-sm tracking-[0.12em]">
                    {e.company.toUpperCase()}
                  </p>
                  <p className="mt-1 text-[10px] text-muted">{e.period}</p>
                  {i === roleIndex && (
                    <motion.div
                      layoutId="role-indicator"
                      className="mt-3 h-[2px] bg-accent"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </SectionShell>

        {/* PROJECTS */}
        <SectionShell
          id="projects"
          accentRgb={SECTIONS[2].hue}
          active={active === "projects"}
        >
          <Reveal>
            <p className="hud-label">SECTOR 02 — PROJECT GARAGE</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="hud-title mt-3 text-3xl sm:text-5xl">PROJECTS</h2>
          </Reveal>
          <motion.div
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
          >
            {PROJECTS.map((project, i) => (
              <motion.button
                key={project.id}
                type="button"
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setProjectId(project.id)}
                className="hud-frame hud-scan group p-5 text-left"
              >
                <div className="flex justify-between gap-2">
                  <p className="hud-label">BAY {String(i + 1).padStart(2, "0")}</p>
                  <span className="text-[9px] tracking-[0.2em] text-accent-warm">
                    {project.archetype.toUpperCase()}
                  </span>
                </div>
                <p className="hud-title mt-3 text-base leading-snug transition group-hover:text-accent-warm">
                  {project.name.toUpperCase()}
                </p>
                <div className="hud-line my-3" />
                <p className="line-clamp-2 text-[10px] tracking-[0.1em] text-muted">
                  {project.missionObjective}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 3).map((s) => (
                    <span key={s} className="sys-chip-warm sys-chip text-[9px]">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-[10px] tracking-[0.25em] text-accent">
                  OPEN CASE STUDY →
                </p>
              </motion.button>
            ))}
          </motion.div>
        </SectionShell>

        {/* SKILLS */}
        <SectionShell
          id="skills"
          accentRgb={SECTIONS[3].hue}
          active={active === "skills"}
        >
          <Reveal>
            <p className="hud-label">SECTOR 03 — DEV LAB</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="hud-title mt-3 text-3xl sm:text-5xl">TECH STACK</h2>
          </Reveal>
          <motion.div
            className="mt-8 flex flex-wrap gap-2"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >
            {SKILLS.map((s) => (
              <motion.span
                key={s}
                variants={fadeUp}
                whileHover={{ scale: 1.08, y: -2 }}
                className="sys-chip cursor-default"
              >
                {s}
              </motion.span>
            ))}
          </motion.div>
          <Reveal delay={2}>
            <div className="mt-10 hud-frame hud-scan p-6">
              <p className="hud-label">ARCHITECTURE</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
                {ARCHITECTURE_FLOW.map((node, i) => (
                  <motion.span
                    key={node}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.12 }}
                  >
                    <span className="border border-accent/50 bg-accent/10 px-4 py-2 tracking-[0.2em]">
                      {node.toUpperCase()}
                    </span>
                    {i < ARCHITECTURE_FLOW.length - 1 && (
                      <motion.span
                        className="text-accent"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    )}
                  </motion.span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {ARCHITECTURE_SIDES.map((s) => (
                  <span
                    key={s}
                    className="sys-chip border-accent-secondary/40 text-accent-secondary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </SectionShell>

        {/* AI */}
        <SectionShell
          id="ai"
          accentRgb={SECTIONS[4].hue}
          active={active === "ai"}
        >
          <Reveal>
            <p className="hud-label">SECTOR 04 — AI LAB</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="hud-title mt-3 text-3xl sm:text-5xl">AI DEVELOPMENT</h2>
          </Reveal>
          <Reveal delay={2}>
            <motion.div
              className="mx-auto mt-8 flex h-28 w-28 items-center justify-center rounded-full border border-purple-400/40 bg-purple-500/10"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(167,139,250,0.2)",
                  "0 0 50px rgba(167,139,250,0.45)",
                  "0 0 20px rgba(167,139,250,0.2)",
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              <span className="hud-title text-sm text-purple-200">AI CORE</span>
            </motion.div>
          </Reveal>
          <Reveal delay={3}>
            <p className="mt-6 max-w-2xl text-center text-sm italic text-muted sm:mx-auto">
              {PROFILE.aiStatement}
            </p>
          </Reveal>
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-2"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >
            {AI_NODES.map((n) => (
              <motion.span
                key={n}
                variants={fadeUp}
                className="sys-chip border-purple-400/40 text-purple-200"
              >
                {n}
              </motion.span>
            ))}
          </motion.div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {AI_TOOLS.map((t) => (
              <span key={t} className="sys-chip">
                {t}
              </span>
            ))}
          </div>
          <Reveal delay={4}>
            <div className="mt-10 hud-frame p-5">
              <p className="hud-label text-center">WORKFLOW</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] tracking-[0.2em]">
                {AI_WORKFLOW.map((step, i) => (
                  <motion.span
                    key={step}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0.3 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <motion.span
                      className="border border-purple-400/50 px-3 py-1.5 text-purple-100"
                      animate={{
                        borderColor: [
                          "rgba(192,132,252,0.4)",
                          "rgba(192,132,252,0.9)",
                          "rgba(192,132,252,0.4)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    >
                      {step}
                    </motion.span>
                    {i < AI_WORKFLOW.length - 1 && (
                      <span className="text-purple-300">→</span>
                    )}
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>
        </SectionShell>

        {/* PERFORMANCE */}
        <SectionShell
          id="performance"
          accentRgb={SECTIONS[5].hue}
          active={active === "performance"}
        >
          <Reveal>
            <p className="hud-label">SECTOR 05 — PERFORMANCE CENTER</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="hud-title mt-3 text-3xl sm:text-5xl">PERFORMANCE</h2>
          </Reveal>
          <motion.div
            className="mt-8 grid gap-2 sm:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
          >
            {PERFORMANCE_TOPICS.map((t) => (
              <motion.div
                key={t}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                className="hud-frame px-3 py-3 text-[11px] tracking-[0.15em]"
              >
                <motion.span
                  className="mr-2 inline-block text-success"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  ▓
                </motion.span>
                {t.toUpperCase()}
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              "FAST API REQUESTS",
              "EFFICIENT DATABASE QUERIES",
              "OPTIMIZED FRONTEND RENDERING",
            ].map((item, i) => (
              <Reveal key={item} delay={i}>
                <div className="hud-frame hud-scan p-5 text-center">
                  <motion.div
                    className="mx-auto mb-3 h-1 w-16 bg-success/60"
                    animate={{ scaleX: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.8, delay: i * 0.2, repeat: Infinity }}
                  />
                  <p className="text-[11px] tracking-[0.2em] text-muted">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionShell>

        {/* EDUCATION */}
        <SectionShell
          id="education"
          accentRgb={SECTIONS[6].hue}
          active={active === "education"}
        >
          <Reveal>
            <p className="hud-label">SECTOR 06 — UNIVERSITY</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="hud-title mt-3 text-3xl sm:text-5xl">EDUCATION</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {EDUCATION.map((edu, i) => (
              <Reveal key={edu.degree} delay={i}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="hud-frame hud-scan p-6 sm:p-8"
                >
                  <p className="hud-label">RECORD</p>
                  <h3 className="hud-title mt-3 text-3xl text-accent-warm">
                    {edu.degree}
                  </h3>
                  <p className="mt-2 tracking-[0.12em]">{edu.institution}</p>
                  <p className="mt-2 font-mono text-xs text-muted">{edu.period}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </SectionShell>

        {/* CONTACT */}
        <SectionShell
          id="contact"
          accentRgb={SECTIONS[7].hue}
          active={active === "contact"}
        >
          <Reveal>
            <p className="hud-label">SECTOR 07 — CONNECT HUB</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="hud-title mt-3 text-3xl sm:text-5xl">CONTACT</h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-4 text-lg tracking-[0.08em] text-muted">
              {PROFILE.contactQuote}
            </p>
          </Reveal>
          <div className="mt-8 max-w-xl space-y-3">
            {[
              {
                href: PROFILE.emailHref,
                icon: Mail,
                label: PROFILE.email,
              },
              {
                href: PROFILE.phoneHref,
                icon: Phone,
                label: PROFILE.phone,
              },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i + 2}>
                <motion.a
                  href={item.href}
                  whileHover={{ x: 6, borderColor: "rgba(61,214,198,0.5)" }}
                  className="hud-frame flex items-center gap-3 px-4 py-4"
                >
                  <item.icon className="h-4 w-4 text-accent" />
                  <span className="text-sm tracking-[0.08em]">{item.label}</span>
                </motion.a>
              </Reveal>
            ))}
          </div>
          <Reveal delay={4}>
            <div className="mt-6 flex flex-wrap gap-3">
              <motion.a
                href={PROFILE.emailHref}
                whileHover={{ scale: 1.04 }}
                className="border border-accent bg-accent/15 px-4 py-2 text-[11px] tracking-[0.25em] text-accent"
              >
                EMAIL
              </motion.a>
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
          </Reveal>
          <Reveal delay={5}>
            <p className="mt-16 text-[10px] tracking-[0.2em] text-muted">
              © {new Date().getFullYear()} {PROFILE.name.toUpperCase()}
            </p>
          </Reveal>
        </SectionShell>
      </div>
    </div>
  );
}
