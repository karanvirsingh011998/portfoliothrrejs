"use client";

import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { BUSINESS_CARD } from "@/data/portfolio";

const CONTACTS = [
  {
    label: "EMAIL",
    value: BUSINESS_CARD.email,
    href: BUSINESS_CARD.emailHref,
  },
  {
    label: "LINKEDIN",
    value: BUSINESS_CARD.linkedinLabel,
    href: BUSINESS_CARD.linkedin,
  },
  {
    label: "PORTFOLIO",
    value: BUSINESS_CARD.portfolioLabel,
    href: BUSINESS_CARD.portfolio,
  },
  {
    label: "WHATSAPP",
    value: BUSINESS_CARD.whatsapp,
    href: BUSINESS_CARD.whatsappHref,
  },
] as const;

/**
 * Premium interactive digital business card.
 * Uses CSS 3D (not canvas textures) so typography stays razor-sharp.
 */
export function DigitalBusinessCard() {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const pointerDown = useRef(false);
  const dragMoved = useRef(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), {
    stiffness: 160,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 160,
    damping: 20,
  });
  const glareX = useTransform(rawX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(rawY, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(61,214,198,0.22), transparent 55%)`;

  const onMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduce || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
      if (pointerDown.current) dragMoved.current = true;
    },
    [rawX, rawY, reduce]
  );

  const onLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    pointerDown.current = false;
  }, [rawX, rawY]);

  const onPointerDown = useCallback(() => {
    pointerDown.current = true;
    dragMoved.current = false;
  }, []);

  const onPointerUp = useCallback(() => {
    pointerDown.current = false;
  }, []);

  const onCardActivate = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a")) return;
      if (dragMoved.current) return;
      setFlipped((f) => !f);
    },
    []
  );

  return (
    <div className="w-full max-w-[440px]">
      <p className="hud-label mb-3">DIGITAL BUSINESS CARD</p>

      <div className="relative w-full" style={{ perspective: 1400 }}>
        {/* Soft ground shadow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 -bottom-2 h-8 rounded-[100%] bg-black/50 blur-xl"
        />

        <motion.div
          ref={cardRef}
          role="button"
          tabIndex={0}
          aria-label={
            flipped
              ? "Business card back. Click to flip to front."
              : "Business card front. Click to flip to back."
          }
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onClick={onCardActivate}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
          animate={
            reduce
              ? undefined
              : {
                  y: [0, -5, 0],
                }
          }
          transition={
            reduce
              ? undefined
              : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
          style={
            reduce
              ? { transformStyle: "preserve-3d" }
              : {
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }
          }
          className="relative aspect-[1.75/1] w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {/* Inner flip shell */}
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <CardFace side="front" glare={glare} reduce={!!reduce} />
            <CardFace side="back" glare={glare} reduce={!!reduce} />
          </motion.div>

          {/* Thickness edge */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-[6%] -right-[3px] w-[3px] rounded-r-sm bg-gradient-to-b from-accent/35 via-white/15 to-accent-secondary/30"
            style={{ transform: "translateZ(-6px)" }}
          />
        </motion.div>
      </div>

      <p className="mt-3 text-center font-mono text-[9px] tracking-[0.28em] text-muted">
        {flipped ? "CLICK FOR FRONT" : "CLICK TO FLIP"}
      </p>
    </div>
  );
}

function CardFace({
  side,
  glare,
  reduce,
}: {
  side: "front" | "back";
  glare: ReturnType<typeof useMotionTemplate>;
  reduce: boolean;
}) {
  const isBack = side === "back";

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-xl border border-white/10 bg-[#0b0e14]"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: isBack ? "rotateY(180deg)" : "rotateY(0deg)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(61,214,198,0.12)",
        backgroundImage:
          "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 42%, rgba(61,214,198,0.04) 100%)",
      }}
    >
      {/* Corner ticks */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-accent/60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-accent/60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-accent/60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-accent/60"
      />

      {/* Inner frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 rounded-lg border border-white/[0.06]"
      />

      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{ background: glare }}
          aria-hidden
        />
      )}

      {isBack ? <BackContent /> : <FrontContent />}
    </div>
  );
}

function FrontContent() {
  return (
    <div className="relative z-10 flex h-full flex-col justify-center px-6 py-5 sm:px-8 sm:py-6">
      <p className="font-mono text-[10px] tracking-[0.35em] text-accent sm:text-[11px]">
        KARANVIR.SINGH
      </p>
      <h3 className="mt-3 font-sans text-[1.55rem] font-semibold leading-none tracking-[0.06em] text-[#f2f6fc] sm:text-[1.85rem]">
        {BUSINESS_CARD.name}
      </h3>
      <div className="mt-3 h-px w-24 bg-gradient-to-r from-accent/70 to-transparent" />
      <p className="mt-3 font-sans text-sm tracking-[0.12em] text-foreground/80 sm:text-[15px]">
        {BUSINESS_CARD.title}
      </p>
      <p className="mt-auto pt-4 font-mono text-[9px] tracking-[0.28em] text-muted/70">
        DIGITAL BUSINESS CARD
      </p>
    </div>
  );
}

function BackContent() {
  return (
    <div className="relative z-10 flex h-full min-h-0 gap-3 overflow-hidden px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <h3 className="shrink-0 font-sans text-sm font-semibold tracking-[0.18em] text-[#f2f6fc] sm:text-base">
          LET&apos;S CONNECT
        </h3>
        <div className="mt-1.5 h-px w-16 shrink-0 bg-gradient-to-r from-accent/70 to-transparent" />

        <ul className="mt-2.5 flex min-h-0 flex-1 flex-col justify-between gap-1.5 pb-0.5 sm:mt-3 sm:gap-2">
          {CONTACTS.map((row) => (
            <li key={row.label} className="min-w-0">
              <a
                href={row.href}
                target={row.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="group block rounded-sm outline-none transition-colors focus-visible:ring-1 focus-visible:ring-accent"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="font-mono text-[8px] tracking-[0.24em] text-accent sm:text-[9px]">
                  {row.label}
                </p>
                <p className="mt-0.5 truncate font-sans text-[10px] leading-snug tracking-wide text-foreground/90 transition-colors group-hover:text-accent sm:text-[11px]">
                  {row.value}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex shrink-0 flex-col items-center justify-center self-center">
        <a
          href={BUSINESS_CARD.whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="group rounded-md border border-white/15 bg-white/[0.03] p-1.5 transition-all hover:border-accent/60 hover:bg-accent/10 hover:shadow-[0_0_20px_rgba(61,214,198,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Scan or open WhatsApp chat"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/whatsapp-qr.png"
            alt="WhatsApp QR code"
            width={96}
            height={96}
            className="h-[76px] w-[76px] rounded-sm bg-white object-contain p-1 transition-transform duration-300 group-hover:scale-[1.04] sm:h-[92px] sm:w-[92px]"
            draggable={false}
          />
        </a>
        <p className="mt-1.5 max-w-[100px] text-center font-mono text-[7px] leading-snug tracking-[0.06em] text-muted sm:text-[8px]">
          Scan to connect on WhatsApp
        </p>
      </div>
    </div>
  );
}

