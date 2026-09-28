"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { PROFILE } from "@/data/portfolio";

const RESUME_LINES = [
  { w: "72%", label: "EXPERIENCE" },
  { w: "88%", label: null },
  { w: "64%", label: null },
  { w: "55%", label: "STACK" },
  { w: "80%", label: null },
  { w: "70%", label: null },
  { w: "48%", label: "EDUCATION" },
  { w: "76%", label: null },
] as const;

/**
 * Interactive 3D resume card with pointer tilt.
 * Links use PROFILE.resumeUrl for view + download actions.
 */
export function ResumeCard3D() {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [14, -14]), {
    stiffness: 180,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-16, 16]), {
    stiffness: 180,
    damping: 18,
  });
  const glareX = useTransform(rawX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(rawY, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(61,214,198,0.28), transparent 55%)`;

  function onMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px]" style={{ perspective: 1000 }}>
      <motion.div
        ref={cardRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={
          reduce
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
        className="relative aspect-[3/4] cursor-grab active:cursor-grabbing"
        animate={
          reduce
            ? undefined
            : {
                y: [0, -6, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
        }
        whileHover={reduce ? undefined : { z: 24 }}
      >
        {/* Shadow plate */}
        <div
          className="absolute inset-2 translate-y-4 rounded-sm bg-black/50 blur-xl"
          style={{ transform: "translateZ(-40px)" }}
          aria-hidden
        />

        {/* Card face */}
        <div
          className="hud-frame hud-scan relative flex h-full flex-col overflow-hidden bg-[#070d18]/95 p-5 sm:p-6"
          style={{ transform: "translateZ(0px)" }}
        >
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute inset-0 mix-blend-screen"
              style={{ background: glare }}
              aria-hidden
            />
          )}

          <div className="relative z-10 flex items-start justify-between gap-2">
            <div>
              <p className="hud-label">DOSSIER</p>
              <p className="hud-title mt-2 text-sm leading-snug sm:text-base">
                {PROFILE.name.toUpperCase()}
              </p>
              <p className="mt-1 text-[9px] tracking-[0.22em] text-accent">
                {PROFILE.title.toUpperCase()}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center border border-accent/40 bg-accent/10 font-mono text-[9px] tracking-[0.15em] text-accent">
              PDF
            </div>
          </div>

          <div className="hud-line my-4" />

          <div className="relative z-10 flex flex-1 flex-col gap-2.5">
            {RESUME_LINES.map((line, i) => (
              <div key={i} className="space-y-1">
                {line.label && (
                  <p className="text-[8px] tracking-[0.28em] text-accent/80">
                    {line.label}
                  </p>
                )}
                <div
                  className="h-1.5 rounded-sm bg-gradient-to-r from-white/25 to-white/5"
                  style={{ width: line.w }}
                />
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="font-mono text-[8px] tracking-[0.2em] text-muted">
              {PROFILE.experienceYears} YRS
            </span>
            <span className="font-mono text-[8px] tracking-[0.2em] text-muted">
              RESUME.PDF
            </span>
          </div>
        </div>

        {/* Edge accent for depth */}
        <div
          className="pointer-events-none absolute inset-y-3 -right-1 w-2 rounded-r-sm bg-accent/30"
          style={{ transform: "translateZ(-8px) rotateY(90deg)" }}
          aria-hidden
        />
      </motion.div>
    </div>
  );
}
