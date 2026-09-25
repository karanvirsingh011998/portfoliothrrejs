"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HERO_ROLES } from "@/data/portfolio";

const INTERVAL_MS = 1500;
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Cycles hero roles with fade + vertical slide + blur + scale.
 * Fixed-height slot prevents layout shift across titles.
 */
export function RotatingRole({
  className = "",
}: {
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_ROLES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduce]);

  const role = HERO_ROLES[index];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: "1.5em" }}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Invisible longest title reserves width/height to avoid shift on wrap */}
      <span
        className="invisible block select-none"
        aria-hidden
      >
        GENERATIVE AI DEVELOPER
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={role}
          className="absolute inset-0 flex items-center"
          initial={
            reduce
              ? false
              : {
                  opacity: 0,
                  y: 14,
                  filter: "blur(8px)",
                  scale: 0.96,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
          }}
          exit={
            reduce
              ? undefined
              : {
                  opacity: 0,
                  y: -12,
                  filter: "blur(6px)",
                  scale: 0.98,
                }
          }
          transition={{ duration: 0.45, ease }}
        >
          {role}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
