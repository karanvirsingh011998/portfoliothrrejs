"use client";

import { MISSIONS, PROFILE, LOCATIONS } from "@/data/portfolio";
import { useGameStore } from "@/store/game-store";
import { Switch } from "@/components/ui/switch";
import type { GraphicsQuality, LocationId, WorldSystem } from "@/types/portfolio";

const NAV: { label: string; system: WorldSystem; location?: LocationId }[] = [
  { label: "RESUME WORLD", system: "none" },
  { label: "ENGINEERING HQ", system: "experience", location: "engineering-hq" },
  { label: "PROJECT GARAGE", system: "projects", location: "project-garage" },
  { label: "DEV LAB", system: "skills", location: "dev-lab" },
  { label: "AI LAB", system: "ai", location: "ai-lab" },
  { label: "PERFORMANCE", system: "performance", location: "performance-center" },
  { label: "UNIVERSITY", system: "education", location: "university" },
  { label: "CONNECT HUB", system: "contact", location: "connect-hub" },
];

export function PauseMenu() {
  const activeSystem = useGameStore((s) => s.activeSystem);
  const closeSystem = useGameStore((s) => s.closeSystem);
  const openSystem = useGameStore((s) => s.openSystem);
  const enterLocation = useGameStore((s) => s.enterLocation);
  const returnToWorld = useGameStore((s) => s.returnToWorld);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const setSoundEnabled = useGameStore((s) => s.setSoundEnabled);
  const reduceMotion = useGameStore((s) => s.reduceMotion);
  const setReduceMotion = useGameStore((s) => s.setReduceMotion);
  const graphicsQuality = useGameStore((s) => s.graphicsQuality);
  const setGraphicsQuality = useGameStore((s) => s.setGraphicsQuality);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const setForce2D = useGameStore((s) => s.setForce2D);

  if (activeSystem !== "pause" && activeSystem !== "missions") return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
      <div className="hud-frame hud-scan relative max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
        <p className="hud-label text-center">{PROFILE.systemId} — SYSTEMS</p>
        <h2 className="hud-title mt-2 text-center text-xl">
          {PROFILE.name.toUpperCase()}
        </h2>
        <div className="hud-line my-4" />

        {activeSystem === "pause" && (
          <>
            <nav className="flex flex-col gap-1.5">
              {NAV.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="border border-white/10 px-4 py-2.5 text-left text-[11px] tracking-[0.22em] text-foreground hover:border-accent/50 hover:bg-accent/5"
                  onClick={() => {
                    if (item.system === "none") {
                      returnToWorld();
                      closeSystem();
                      return;
                    }
                    if (item.location) {
                      closeSystem();
                      enterLocation(item.location);
                    } else {
                      openSystem(item.system);
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                className="mt-2 border border-accent/30 px-4 py-2.5 text-left text-[11px] tracking-[0.22em] text-accent"
                onClick={() => openSystem("missions")}
              >
                OPTIONAL MISSIONS
              </button>
            </nav>

            <div className="mt-6 space-y-4 border-t border-accent/20 pt-5">
              <p className="hud-label">SETTINGS</p>
              <label className="flex items-center justify-between gap-4 text-[11px] tracking-[0.15em]">
                <span>REDUCE MOTION</span>
                <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />
              </label>
              <label className="flex items-center justify-between gap-4 text-[11px] tracking-[0.15em]">
                <span>SOUND</span>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </label>
              <div>
                <p className="mb-2 text-[11px] tracking-[0.15em]">GRAPHICS</p>
                <div className="flex flex-wrap gap-2">
                  {(["auto", "low", "medium", "high"] as GraphicsQuality[]).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setGraphicsQuality(q)}
                      className={`px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase border ${
                        graphicsQuality === q
                          ? "border-accent bg-accent/20 text-accent"
                          : "border-white/15 text-muted"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="text-[11px] tracking-[0.2em] text-muted hover:text-accent"
                onClick={() => setForce2D(true)}
              >
                OPEN TRADITIONAL INTERFACE
              </button>
            </div>

            <button
              type="button"
              className="mt-6 w-full border border-accent/40 py-2.5 text-[11px] tracking-[0.3em] text-accent"
              onClick={closeSystem}
            >
              EXIT SYSTEMS
            </button>
          </>
        )}

        {activeSystem === "missions" && (
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.12em] text-muted">
              Optional objectives — explore freely or complete missions.
            </p>
            {MISSIONS.map((m) => {
              const done = completedMissions.includes(m.id);
              const loc = LOCATIONS.find((l) => l.id === m.locationId);
              return (
                <button
                  key={m.id}
                  type="button"
                  className="hud-frame w-full p-4 text-left"
                  onClick={() => {
                    if (loc) {
                      closeSystem();
                      enterLocation(loc.id);
                    }
                  }}
                >
                  <div className="flex justify-between gap-2">
                    <span className="hud-label">MISSION {m.number}</span>
                    {done && <span className="text-[10px] text-success">COMPLETE</span>}
                  </div>
                  <p className="mt-1 text-sm tracking-[0.12em]">{m.title.toUpperCase()}</p>
                  <p className="mt-1 text-[10px] text-muted">OBJ — {m.objective}</p>
                  <p className="mt-1 text-[10px] text-muted">RWD — {m.reward}</p>
                </button>
              );
            })}
            <button
              type="button"
              className="w-full border border-white/15 py-2 text-[11px] tracking-[0.25em]"
              onClick={() => openSystem("pause")}
            >
              BACK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
