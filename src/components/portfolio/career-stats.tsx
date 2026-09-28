"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { CAREER_STATS } from "@/data/portfolio";

type Stat = (typeof CAREER_STATS)[number];

function AnimatedNumber({
  value,
  suffix,
  active,
  reduce,
}: {
  value: number;
  suffix: string;
  active: boolean;
  reduce: boolean | null;
}) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, {
    stiffness: 60,
    damping: 18,
    restDelta: 0.001,
  });
  const display = useTransform(spring, (v) =>
    `${String(Math.round(v)).padStart(2, "0")}${suffix}`,
  );

  useEffect(() => {
    if (reduce) {
      motionVal.set(value);
      return;
    }
    motionVal.set(active ? value : 0);
  }, [active, value, reduce, motionVal]);

  return <motion.span>{display}</motion.span>;
}

function StatBlock({
  stat,
  index,
  active,
  reduce,
}: {
  stat: Stat;
  index: number;
  active: boolean;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40, rotateX: 28, z: -60 }}
      animate={
        active
          ? { opacity: 1, y: 0, rotateX: 0, z: 0 }
          : { opacity: 0.35, y: 24, rotateX: 18, z: -40 }
      }
      transition={{
        duration: 0.7,
        delay: reduce ? 0 : index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformStyle: "preserve-3d" }}
      className="hud-frame hud-scan relative flex min-h-[160px] flex-col items-center justify-center p-6 text-center sm:min-h-[180px] sm:p-8"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, rgba(${stat.accent},0.28), transparent 60%)`,
        }}
        aria-hidden
      />

      <p
        className="hud-title relative z-10 text-5xl leading-none tracking-[0.08em] sm:text-6xl"
        style={{
          color: `rgb(${stat.accent})`,
          textShadow: `0 0 28px rgba(${stat.accent},0.45)`,
          transform: "translateZ(24px)",
        }}
      >
        {"display" in stat && stat.display ? (
          <motion.span
            animate={
              reduce
                ? undefined
                : active
                  ? { scale: [0.6, 1.12, 1], rotate: [0, -8, 0] }
                  : { scale: 0.6 }
            }
            transition={{ duration: 0.85, delay: index * 0.12 }}
          >
            {stat.display}
          </motion.span>
        ) : (
          <AnimatedNumber
            value={stat.value ?? 0}
            suffix={stat.suffix}
            active={active}
            reduce={reduce}
          />
        )}
      </p>

      <div className="hud-line relative z-10 my-4 w-16" />

      <p className="relative z-10 text-[10px] tracking-[0.32em] text-muted sm:text-[11px]">
        {stat.label}
      </p>
    </motion.div>
  );
}

/**
 * Career stats grid with scroll-triggered count-up and 3D card entrance.
 */
export function CareerStats() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.35, once: false });

  return (
    <div
      ref={ref}
      className="mt-8"
      style={{ perspective: reduce ? undefined : 1100 }}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CAREER_STATS.map((stat, i) => (
          <StatBlock
            key={stat.id}
            stat={stat}
            index={i}
            active={inView}
            reduce={reduce}
          />
        ))}
      </div>
      <p className="mt-6 text-center text-[10px] tracking-[0.28em] text-muted">
        LIVE TELEMETRY · UPDATED WITH EVERY SHIP
      </p>
    </div>
  );
}
