"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PROFILE } from "@/data/portfolio";
import { useGameStore } from "@/store/game-store";

export function CinematicOverlay() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const reduceMotion = useGameStore((s) => s.reduceMotion);
  const setShowFirstMission = useGameStore((s) => s.setShowFirstMission);
  const setMissionToast = useGameStore((s) => s.setMissionToast);
  const [tick, setTick] = useState(0);

  const finish = () => {
    setPhase("playing");
    setShowFirstMission(true);
    setMissionToast("Explore the Developer World");
  };

  useEffect(() => {
    if (phase !== "cinematic") return;
    if (reduceMotion) {
      finish();
      return;
    }
    const timers = [
      setTimeout(() => setTick(1), 500),
      setTimeout(() => setTick(2), 1600),
      setTimeout(() => finish(), 3400),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reduceMotion]);

  if (phase !== "cinematic") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center bg-gradient-to-t from-black/80 via-transparent to-black/50 pb-24">
      <div className="pointer-events-auto absolute right-5 top-5">
        <button
          type="button"
          onClick={finish}
          className="hud-frame px-4 py-2 text-[11px] tracking-[0.28em] text-accent"
        >
          SKIP
        </button>
      </div>
      <div className="text-center">
        <p className="hud-label mb-3">{PROFILE.worldCodename}</p>
        {tick >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hud-title text-2xl text-accent sm:text-4xl"
          >
            {PROFILE.experienceYears} YEARS EXPERIENCE
          </motion.p>
        )}
        {tick >= 2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 font-mono text-[10px] tracking-[0.35em] text-foreground/80 sm:text-xs"
          >
            {PROFILE.stackLine}
          </motion.p>
        )}
      </div>
    </div>
  );
}
