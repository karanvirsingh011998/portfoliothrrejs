"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROFILE } from "@/data/portfolio";
import { useGameStore } from "@/store/game-store";
import { preferReducedMotion } from "@/lib/utils";

export function IntroScreen() {
  const phase = useGameStore((s) => s.phase);
  const enterWorld = useGameStore((s) => s.enterWorld);
  const skipIntro = useGameStore((s) => s.skipIntro);
  const setForce2D = useGameStore((s) => s.setForce2D);
  const setReduceMotion = useGameStore((s) => s.setReduceMotion);
  const isMobile = useGameStore((s) => s.isMobile);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (preferReducedMotion()) setReduceMotion(true);
  }, [setReduceMotion]);

  useEffect(() => {
    if (phase !== "intro") return;
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 2000);
    const t3 = setTimeout(() => setStep(3), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  if (phase !== "intro") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-accent/60" />
      <div className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r border-t border-accent/60" />
      <div className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b border-l border-accent/60" />
      <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-accent/60" />

      <button
        type="button"
        onClick={skipIntro}
        className="absolute right-8 top-8 z-10 text-[10px] tracking-[0.3em] text-muted hover:text-accent"
      >
        SKIP INTRO
      </button>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <p className="hud-label mb-6">{PROFILE.systemId}</p>
        <AnimatePresence mode="wait">
          {step >= 0 && (
            <motion.h1
              key="name"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hud-title text-4xl text-foreground sm:text-6xl"
            >
              {PROFILE.name.toUpperCase()}
            </motion.h1>
          )}
        </AnimatePresence>

        {step >= 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="mt-4 text-sm tracking-[0.35em] text-accent sm:text-base"
          >
            {PROFILE.title.toUpperCase()}
          </motion.p>
        )}

        {step >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-sm tracking-[0.4em] text-muted sm:text-base"
          >
            ENTER DEVELOPER CITY
          </motion.p>
        )}

        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <button
              type="button"
              onClick={enterWorld}
              className="border border-accent bg-accent/15 px-10 py-3 text-sm tracking-[0.35em] text-accent hover:bg-accent/25"
            >
              ENTER WORLD
            </button>
            <p className="max-w-md text-[11px] tracking-[0.2em] text-muted">
              {PROFILE.worldCodename}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setForce2D(true)}
                className="text-[10px] tracking-[0.25em] text-muted hover:text-accent"
              >
                SKIP 3D EXPERIENCE
              </button>
              {isMobile && (
                <button
                  type="button"
                  onClick={() => setForce2D(true)}
                  className="text-[10px] tracking-[0.25em] text-muted hover:text-accent"
                >
                  TRADITIONAL INTERFACE
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
