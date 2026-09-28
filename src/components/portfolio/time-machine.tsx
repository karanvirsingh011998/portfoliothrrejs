"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TIME_MACHINE } from "@/data/portfolio";

const YEARS = TIME_MACHINE.map((e) => e.year);
type Year = (typeof YEARS)[number];
const MIN_YEAR = YEARS[0];
const MAX_YEAR = YEARS[YEARS.length - 1];
const YEAR_SPAN = MAX_YEAR - MIN_YEAR;

function yearToT(year: number) {
  return (year - MIN_YEAR) / YEAR_SPAN;
}

function tToYear(t: number): Year {
  const clamped = Math.min(1, Math.max(0, t));
  const y = Math.round(MIN_YEAR + clamped * YEAR_SPAN);
  return (YEARS.includes(y as Year) ? y : MAX_YEAR) as Year;
}

function yearToX(year: number, spread = 5.2) {
  return (yearToT(year) - 0.5) * spread * 2;
}

function TimelineScene({
  year,
  reduce,
}: {
  year: number;
  reduce: boolean | null;
}) {
  const handleRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const targetX = useMemo(() => yearToX(year), [year]);
  const currentX = useRef(targetX);

  useFrame((_, dt) => {
    const mesh = handleRef.current;
    if (!mesh) return;
    const speed = reduce ? 1 : 1 - Math.exp(-10 * dt);
    currentX.current += (targetX - currentX.current) * speed;
    mesh.position.x = currentX.current;
    if (glowRef.current) {
      glowRef.current.position.x = currentX.current;
      const pulse = reduce ? 1 : 1 + Math.sin(performance.now() * 0.004) * 0.08;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <>
      <color attach="background" args={["#04070f"]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[0, 2.5, 3]} intensity={1.2} color="#3dd6c6" />
      <pointLight position={[-4, 1, 2]} intensity={0.4} color="#5b8def" />
      <pointLight position={[4, 1, 2]} intensity={0.35} color="#e8a066" />

      <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 11, 16]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.6}
          roughness={0.35}
          emissive="#0f766e"
          emissiveIntensity={0.25}
        />
      </mesh>

      {TIME_MACHINE.map((entry) => {
        const x = yearToX(entry.year);
        const active = entry.year === year;
        return (
          <group key={entry.year} position={[x, 0.15, 0]}>
            <mesh>
              <boxGeometry args={[0.18, active ? 0.55 : 0.35, 0.18]} />
              <meshStandardMaterial
                color={active ? "#3dd6c6" : "#334155"}
                emissive={active ? "#3dd6c6" : "#0f172a"}
                emissiveIntensity={active ? 0.7 : 0.15}
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
            <Text
              position={[0, -0.85, 0]}
              fontSize={0.26}
              color={active ? "#3dd6c6" : "#7a8aa3"}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.06}
            >
              {String(entry.year)}
            </Text>
          </group>
        );
      })}

      <mesh ref={handleRef} position={[targetX, 0.7, 0.2]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color="#e8eef8"
          emissive="#3dd6c6"
          emissiveIntensity={0.85}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={glowRef} position={[targetX, 0.7, 0.2]}>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshBasicMaterial color="#3dd6c6" transparent opacity={0.18} />
      </mesh>
    </>
  );
}

function stepYear(current: Year, delta: number): Year {
  const i = YEARS.indexOf(current);
  return YEARS[Math.min(YEARS.length - 1, Math.max(0, i + delta))]!;
}

/**
 * Interactive Time Machine — mobile-first year chips + desktop 3D rail.
 */
export function TimeMachine() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [year, setYear] = useState<Year>(MAX_YEAR);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const entry = useMemo(
    () =>
      TIME_MACHINE.find((e) => e.year === year) ??
      TIME_MACHINE[TIME_MACHINE.length - 1],
    [year],
  );

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const t = (clientX - rect.left) / rect.width;
    setYear(tToYear(t));
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const t = yearToT(year);

  return (
    <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
      {/* Desktop / tablet 3D rail — hidden on phones to avoid clipped duplicate UI */}
      <div className="hud-frame hud-scan relative hidden h-[260px] overflow-hidden sm:block lg:h-[300px]">
        {mounted ? (
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 1.15, 7.2], fov: 40 }}
            gl={{ antialias: true, alpha: false }}
            className="h-full w-full touch-none"
          >
            <Suspense fallback={null}>
              <TimelineScene year={year} reduce={reduce} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] tracking-[0.3em] text-muted">
            INITIALIZING TIME STREAM…
          </div>
        )}
        <div className="pointer-events-none absolute left-4 top-4 hud-label">
          TEMPORAL RAIL
        </div>
        <div className="pointer-events-none absolute right-4 top-4 font-mono text-[11px] tracking-[0.2em] text-accent">
          YEAR {year}
        </div>
      </div>

      {/* Mobile status strip */}
      <div className="hud-frame hud-chrome flex items-center justify-between gap-3 px-4 py-3 sm:hidden">
        <div>
          <p className="hud-label">TEMPORAL RAIL</p>
          <p className="mt-1 text-[11px] tracking-[0.18em] text-muted">
            TAP A YEAR TO TRAVEL
          </p>
        </div>
        <p className="hud-title text-2xl text-accent">{year}</p>
      </div>

      {/* Mobile: large year chips (primary control) */}
      <div className="sm:hidden">
        <div className="grid grid-cols-3 gap-2">
          {YEARS.map((y) => {
            const active = y === year;
            return (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`min-h-12 border px-2 py-3 font-mono text-sm tracking-[0.18em] transition ${
                  active
                    ? "border-accent bg-accent/20 text-accent shadow-[0_0_16px_rgba(61,214,198,0.25)]"
                    : "border-white/15 text-muted hover:border-accent/40"
                }`}
              >
                {y}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setYear((y) => stepYear(y, -1))}
            disabled={year === MIN_YEAR}
            className="hud-frame flex-1 py-3 text-[11px] tracking-[0.25em] text-accent disabled:opacity-30"
          >
            ← PREV
          </button>
          <button
            type="button"
            onClick={() => setYear((y) => stepYear(y, 1))}
            disabled={year === MAX_YEAR}
            className="hud-frame flex-1 py-3 text-[11px] tracking-[0.25em] text-accent disabled:opacity-30"
          >
            NEXT →
          </button>
        </div>
      </div>

      {/* Desktop scrubber */}
      <div className="hidden px-1 sm:block">
        <div
          ref={trackRef}
          role="slider"
          aria-valuemin={MIN_YEAR}
          aria-valuemax={MAX_YEAR}
          aria-valuenow={year}
          aria-label="Career year scrubber"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setYear((y) => stepYear(y, -1));
            if (e.key === "ArrowRight") setYear((y) => stepYear(y, 1));
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative h-12 cursor-ew-resize touch-none select-none"
        >
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/15" />
          <div
            className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-accent"
            style={{ width: `${t * 100}%` }}
          />
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`relative z-10 flex h-8 w-8 items-center justify-center`}
                aria-label={`Jump to ${y}`}
              >
                <span
                  className={`block h-3 w-3 rotate-45 border transition ${
                    y === year
                      ? "scale-110 border-accent bg-accent shadow-[0_0_12px_rgba(61,214,198,0.7)]"
                      : "border-white/30 bg-[#04070f] hover:border-accent/60"
                  }`}
                />
              </button>
            ))}
          </div>
          <motion.div
            className="pointer-events-none absolute top-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-foreground shadow-[0_0_16px_rgba(61,214,198,0.55)]"
            animate={{ left: `${t * 100}%` }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          />
        </div>
        <div className="mt-1 flex justify-between px-1 font-mono text-[10px] tracking-[0.18em] text-muted">
          {YEARS.map((y) => (
            <span key={y} className={y === year ? "text-accent" : undefined}>
              {y}
            </span>
          ))}
        </div>
        <p className="mt-3 text-center text-[10px] tracking-[0.28em] text-muted">
          ◀ DRAG TO TRAVEL · OR TAP A YEAR ▶
        </p>
      </div>

      {/* Year briefing */}
      <AnimatePresence mode="wait">
        <motion.div
          key={entry.year}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="hud-frame hud-scan p-5 sm:p-6"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-2">
            <p className="hud-label">ERA {entry.year}</p>
            <p className="hud-title text-2xl text-accent sm:text-2xl">
              {entry.title}
            </p>
          </div>
          <div className="hud-line my-4" />
          <p className="text-sm leading-relaxed text-muted">{entry.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span key={tag} className="sys-chip">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
