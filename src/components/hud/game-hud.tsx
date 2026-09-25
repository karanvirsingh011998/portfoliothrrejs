"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LOCATIONS, PROFILE } from "@/data/portfolio";
import { useGameStore } from "@/store/game-store";

function MiniMap() {
  const playerPosition = useGameStore((s) => s.playerPosition);
  const nearbyLocationId = useGameStore((s) => s.nearbyLocationId);
  const worldSize = 56;
  const mapSize = 120;
  const scale = mapSize / worldSize;
  const px = 60 + playerPosition[0] * scale;
  const pz = 60 + playerPosition[2] * scale;

  return (
    <div className="hud-frame hud-scan relative h-[120px] w-[120px] p-1">
      <div className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,214,198,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(61,214,198,0.12) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      {LOCATIONS.map((loc) => {
        const x = 60 + loc.position[0] * scale;
        const z = 60 + loc.position[2] * scale;
        const active = nearbyLocationId === loc.id;
        return (
          <div
            key={loc.id}
            title={loc.name}
            className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: x,
              top: z,
              background: loc.mapColor,
              boxShadow: active ? `0 0 10px ${loc.mapColor}` : `0 0 4px ${loc.mapColor}`,
              transform: `translate(-50%, -50%) scale(${active ? 1.6 : 1})`,
            }}
          />
        );
      })}
      <div
        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white bg-accent"
        style={{ left: px, top: pz }}
      />
      <span className="hud-label absolute bottom-1.5 left-2">TACTICAL</span>
    </div>
  );
}

export function GameHUD() {
  const phase = useGameStore((s) => s.phase);
  const worldMode = useGameStore((s) => s.worldMode);
  const isMobile = useGameStore((s) => s.isMobile);
  const nearbyLocationId = useGameStore((s) => s.nearbyLocationId);
  const coords = useGameStore((s) => s.coords);
  const showFirstMission = useGameStore((s) => s.showFirstMission);
  const missionToast = useGameStore((s) => s.missionToast);
  const enterLocation = useGameStore((s) => s.enterLocation);
  const openSystem = useGameStore((s) => s.openSystem);
  const setExploreWithMouse = useGameStore((s) => s.setExploreWithMouse);
  const mouseExplore = useGameStore((s) => s.exploreWithMouse);
  const setShowFirstMission = useGameStore((s) => s.setShowFirstMission);
  const setPhase = useGameStore((s) => s.setPhase);
  const [clock, setClock] = useState("00:00:00");

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

  useEffect(() => {
    if (phase === "playing" && showFirstMission === false && missionToast === null) {
      // after cinematic ends, first mission is set in cinematic overlay
    }
  }, [phase, showFirstMission, missionToast]);

  if (phase !== "playing" && phase !== "cinematic") return null;
  if (worldMode === "interior") return null;

  const nearby = LOCATIONS.find((l) => l.id === nearbyLocationId);
  const district = nearby?.district ?? "CENTRAL DISTRICT";

  return (
    <div className="pointer-events-none fixed inset-0 z-30 font-mono">
      {/* Corner brackets */}
      <div className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-l border-t border-accent/70" />
      <div className="pointer-events-none absolute right-3 top-3 h-8 w-8 border-r border-t border-accent/70" />
      <div className="pointer-events-none absolute bottom-3 left-3 h-8 w-8 border-b border-l border-accent/70" />
      <div className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 border-b border-r border-accent/70" />

      {/* Top-left system panel */}
      <div className="pointer-events-auto absolute left-5 top-5 w-[min(340px,calc(100vw-2.5rem))]">
        <div className="hud-frame hud-scan px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="hud-label">{PROFILE.systemId}</span>
            <span className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-success">
              <span className="hud-status-dot" /> ONLINE
            </span>
          </div>
          <div className="hud-line my-2" />
          <p className="hud-title text-sm text-foreground sm:text-base">
            {PROFILE.name.toUpperCase()}
          </p>
          <p className="mt-1 text-[10px] tracking-[0.22em] text-muted">
            {PROFILE.title.toUpperCase()}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="sys-chip">{PROFILE.experienceYears} YRS</span>
            <span className="sys-chip">MERN</span>
          </div>
          <div className="mt-3 sys-terminal space-y-1 text-[10px] text-muted">
            <div className="flex justify-between gap-2">
              <span>LOCATION</span>
              <span className="text-foreground/80">
                DEVELOPER CITY / {district}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span>COORDS</span>
              <span className="text-accent">
                X {coords.x.toFixed(1)} · Z {coords.z.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span>SYS.TIME</span>
              <span>{clock}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top-right */}
      <div className="pointer-events-auto absolute right-5 top-5 flex flex-col items-end gap-2">
        <div className="hud-frame px-3 py-2 text-[10px] tracking-[0.25em] text-muted">
          {PROFILE.worldCodename}
        </div>
        <button
          type="button"
          onClick={() => openSystem("pause")}
          className="hud-frame px-4 py-2 text-[11px] tracking-[0.3em] text-accent hover:bg-accent/10"
        >
          MENU // ESC
        </button>
      </div>

      {/* First mission / toast */}
      <AnimatePresence>
        {(showFirstMission || missionToast) && worldMode === "explore" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto absolute left-5 top-52 max-w-sm sm:top-56"
          >
            <div className="mission-banner hud-scan px-4 py-3">
              <p className="hud-label">NEW MISSION</p>
              <p className="mt-1 text-sm tracking-[0.12em] text-foreground">
                {missionToast ?? "Explore the Developer World"}
              </p>
              <p className="mt-2 text-[10px] tracking-[0.15em] text-muted">
                Approach a district marker · Press E to enter
              </p>
              <button
                type="button"
                className="mt-2 text-[10px] tracking-[0.2em] text-accent/80 hover:text-accent"
                onClick={() => {
                  setShowFirstMission(false);
                  useGameStore.getState().setMissionToast(null);
                }}
              >
                DISMISS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transit skip */}
      {worldMode === "transit" && (
        <div className="pointer-events-auto absolute right-5 top-24">
          <button
            type="button"
            className="hud-frame px-4 py-2 text-[11px] tracking-[0.25em] text-accent"
            onClick={() => useGameStore.getState().setSkipTransit(true)}
          >
            SKIP TRANSIT
          </button>
        </div>
      )}

      {/* Controls */}
      {worldMode === "explore" && (
        <div className="pointer-events-none absolute bottom-5 left-5 space-y-1 text-[10px] tracking-[0.18em] text-muted">
          {isMobile ? (
            <>
              <p>JOYSTICK — MOVE</p>
              <p>DRAG — LOOK</p>
              <p>TAP — INTERACT</p>
            </>
          ) : (
            <>
              <p>WASD — MOVE</p>
              <p>MOUSE — LOOK</p>
              <p>E — INTERACT</p>
              <p>ESC — SYSTEMS</p>
              {mouseExplore && <p className="text-accent">HOLD — WALK</p>}
            </>
          )}
          {!isMobile && (
            <button
              type="button"
              className="pointer-events-auto mt-2 block text-accent hover:underline"
              onClick={() => setExploreWithMouse(!mouseExplore)}
            >
              {mouseExplore ? "KEYBOARD MODE" : "EXPLORE WITH MOUSE"}
            </button>
          )}
        </div>
      )}

      {worldMode === "explore" && (
        <div className="pointer-events-auto absolute bottom-5 right-5">
          <MiniMap />
        </div>
      )}

      {/* Proximity interact */}
      <AnimatePresence>
        {nearby && worldMode === "explore" && phase === "playing" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-auto absolute bottom-28 left-1/2 flex w-[min(420px,90vw)] -translate-x-1/2 flex-col items-center"
          >
            <div className="hud-frame hud-scan w-full px-5 py-4 text-center">
              <p className="hud-label">DISTRICT SIGNAL</p>
              <p className="hud-title mt-2 text-lg text-foreground">
                {nearby.name.toUpperCase()}
              </p>
              <p className="mt-1 text-[10px] tracking-[0.25em] text-muted">
                {nearby.district}
              </p>
              <div className="hud-line my-3" />
              <p className="text-xs tracking-[0.3em] text-accent">
                {nearby.interactionLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={() => enterLocation(nearby.id)}
              className="mt-3 border border-accent bg-accent/15 px-6 py-2.5 text-xs tracking-[0.35em] text-accent hover:bg-accent/25"
            >
              {isMobile ? "TAP TO ENTER" : "[ E ] INITIATE ENTRY"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* unused setPhase silence */}
      <span className="hidden">{String(!!setPhase)}</span>
    </div>
  );
}
