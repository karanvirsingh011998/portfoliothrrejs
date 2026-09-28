"use client";

import { useRef, type RefObject } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { BUILD_PROCESS } from "@/data/portfolio";

type Step = (typeof BUILD_PROCESS)[number];

function StepNode({
  step,
  index,
  total,
  progress,
  reduce,
}: {
  step: Step;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  const threshold = index / Math.max(total - 1, 1);
  const active = useTransform(progress, (v) =>
    reduce ? 1 : Math.min(1, Math.max(0, (v - threshold + 0.12) / 0.18)),
  );
  const glow = useTransform(active, [0, 1], [0.15, 1]);
  const scale = useTransform(active, [0, 1], [0.92, 1]);
  const y = useTransform(active, [0, 1], [18, 0]);
  const z = useTransform(active, [0, 1], [-40, 0]);
  const boxShadow = useTransform(
    active,
    [0, 1],
    ["0 0 0 rgba(61,214,198,0)", "0 0 24px rgba(61,214,198,0.55)"],
  );

  return (
    <motion.div
      style={{ opacity: glow, scale, y, z, transformStyle: "preserve-3d" }}
      className="relative grid gap-3 sm:grid-cols-[4.5rem_1fr] sm:items-start"
    >
      <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2">
        <motion.div
          style={{ boxShadow }}
          className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center border border-accent/50 bg-[#04070f] font-mono text-xs tracking-[0.2em] text-accent"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.div>
        {index < total - 1 && (
          <div className="hidden h-full min-h-8 w-px bg-white/10 sm:block" aria-hidden />
        )}
      </div>

      <div className="hud-frame hud-scan min-w-0 p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="hud-title text-base tracking-[0.18em] sm:text-lg">
            {step.title}
          </p>
          {index < total - 1 && (
            <span className="text-[10px] tracking-[0.3em] text-accent/70">↓ NEXT</span>
          )}
        </div>
        <div className="hud-line my-3" />
        <p className="text-[12px] leading-relaxed tracking-[0.04em] text-muted">
          {step.summary}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Scroll-driven 3D process timeline for the "How I Build" sector.
 * Progress lights each stage as the section moves through the viewport.
 */
export function BuildProcessTimeline({
  scrollContainer,
}: {
  scrollContainer?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: ref,
    offset: ["start 0.75", "end 0.4"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  const railFill = useTransform(progress, [0, 1], ["0%", "100%"]);
  const tilt = useTransform(progress, [0, 1], [8, -4]);
  const depth = useTransform(progress, [0, 0.5, 1], [12, 0, -8]);

  return (
    <div ref={ref} className="mt-8">
      <div
        className="relative mx-auto max-w-3xl"
        style={{ perspective: reduce ? undefined : 1200 }}
      >
        <motion.div
          style={
            reduce
              ? undefined
              : {
                  rotateX: tilt,
                  rotateY: depth,
                  transformStyle: "preserve-3d",
                }
          }
          className="relative"
        >
          {/* Vertical energy rail */}
          <div
            className="pointer-events-none absolute left-[1.35rem] top-5 bottom-5 hidden w-px bg-white/10 sm:block"
            aria-hidden
          >
            <motion.div
              className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-accent via-accent-secondary to-accent-warm"
              style={{ height: railFill }}
            />
          </div>

          {/* Mobile progress bar */}
          <div className="mb-5 h-1 overflow-hidden border border-white/10 bg-white/5 sm:hidden">
            <motion.div
              className="h-full origin-left bg-accent"
              style={{ scaleX: progress }}
            />
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            {BUILD_PROCESS.map((step, i) => (
              <StepNode
                key={step.id}
                step={step}
                index={i}
                total={BUILD_PROCESS.length}
                progress={progress}
                reduce={reduce}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <p className="mt-6 text-center text-[10px] tracking-[0.28em] text-muted">
        PROCESS LOCKED · SEVEN STAGES · SHIP WITH INTENT
      </p>
    </div>
  );
}
