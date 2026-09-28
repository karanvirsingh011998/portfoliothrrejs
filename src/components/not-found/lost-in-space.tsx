"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PROFILE } from "@/data/portfolio";

/**
 * Immersive 404 experience — visitor drifted off the map of Developer World.
 */
export function LostInSpace() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-6 py-12 text-foreground">
      <Starfield reduceMotion={!!reduceMotion} />
      <DriftOrb reduceMotion={!!reduceMotion} />

      <div
        aria-hidden
        className="pointer-events-none absolute left-5 top-5 h-10 w-10 border-l border-t border-accent/55 sm:left-8 sm:top-8"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-5 top-5 h-10 w-10 border-r border-t border-accent/55 sm:right-8 sm:top-8"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-5 left-5 h-10 w-10 border-b border-l border-accent/55 sm:bottom-8 sm:left-8"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-5 right-5 h-10 w-10 border-b border-r border-accent/55 sm:bottom-8 sm:right-8"
      />

      <motion.div
        className="relative z-10 flex max-w-xl flex-col items-center text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <p className="hud-label mb-5">{PROFILE.worldCodename}</p>

        <motion.p
          className="font-mono text-[10px] tracking-[0.45em] text-danger sm:text-xs"
          animate={reduceMotion ? undefined : { opacity: [1, 0.35, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          NAVIGATION FAULT
        </motion.p>

        <h1 className="mt-3 flex flex-col items-center gap-2">
          <span className="hud-title text-[clamp(4rem,16vw,8rem)] leading-none text-accent/90">
            404
          </span>
          <span className="hud-title text-[clamp(1.15rem,4vw,1.75rem)] tracking-[0.32em] text-foreground">
            LOST IN SPACE
          </span>
        </h1>

        <p className="mt-5 max-w-md text-sm leading-relaxed tracking-wide text-muted">
          This sector isn&apos;t on the map. Your coordinates drifted past the edge of{" "}
          {PROFILE.cityName}. Reacquire the home beacon to continue exploring.
        </p>

        <p className="mt-6 font-mono text-[10px] tracking-[0.22em] text-muted/80">
          SIGNAL <span className="text-accent-warm">LOST</span>
          <span className="mx-3 text-muted/30">·</span>
          SECTOR UNKNOWN
          <span className="mx-3 text-muted/30">·</span>
          BEACON <span className="text-accent-warm">404</span>
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/"
            className="border border-accent bg-accent/15 px-10 py-3 text-sm tracking-[0.35em] text-accent transition-colors hover:bg-accent/25"
          >
            RETURN TO CITY
          </Link>
          <a
            href={PROFILE.emailHref}
            className="text-[10px] tracking-[0.3em] text-muted transition-colors hover:text-accent"
          >
            HAIL DEVELOPER
          </a>
        </div>
      </motion.div>
    </main>
  );
}

function Starfield({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 35%, rgba(91, 141, 239, 0.14), transparent 55%), radial-gradient(ellipse 60% 40% at 70% 70%, rgba(61, 214, 198, 0.08), transparent 50%), radial-gradient(ellipse 50% 35% at 20% 80%, rgba(232, 160, 102, 0.06), transparent 45%)",
        }}
      />
      <div className="lost-stars lost-stars--far" />
      <div className="lost-stars lost-stars--near" />
      {!reduceMotion && <div className="lost-stars lost-stars--drift" />}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61, 214, 198, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(61, 214, 198, 0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 75%)",
        }}
      />
    </div>
  );
}

function DriftOrb({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[38%] z-0 h-36 w-36 -translate-x-1/2 -translate-y-1/2 opacity-70 sm:h-48 sm:w-48"
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -12, 5, 0],
              rotate: [0, 4, -3, 0],
            }
      }
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="absolute inset-[18%] rounded-full border border-accent/25"
        style={{
          boxShadow:
            "inset 0 0 40px rgba(61, 214, 198, 0.12), 0 0 60px rgba(91, 141, 239, 0.15)",
          background:
            "radial-gradient(circle at 35% 30%, rgba(220, 230, 245, 0.18), rgba(8, 16, 32, 0.9) 55%, rgba(4, 7, 15, 1))",
        }}
      />
      <div className="absolute left-[22%] top-[28%] h-3 w-3 rounded-full bg-accent/50 blur-[1px]" />
      <div className="absolute bottom-[30%] right-[26%] h-2 w-8 rotate-[-18deg] rounded-full bg-accent-secondary/30" />
      <div
        className="absolute -inset-6 rounded-full border border-dashed border-accent/15"
        style={{
          animation: reduceMotion ? undefined : "lost-orbit 28s linear infinite",
        }}
      />
    </motion.div>
  );
}
