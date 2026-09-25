"use client";

import { create } from "zustand";
import type {
  GraphicsQuality,
  LocationId,
  WorldMode,
  WorldSystem,
} from "@/types/portfolio";

type Vec3 = [number, number, number];

type GameState = {
  phase: "intro" | "cinematic" | "playing" | "fallback";
  worldMode: WorldMode;
  force2D: boolean;
  webglOk: boolean;
  isMobile: boolean;
  exploreWithMouse: boolean;
  soundEnabled: boolean;
  reduceMotion: boolean;
  graphicsQuality: GraphicsQuality;
  resolvedQuality: Exclude<GraphicsQuality, "auto">;
  paused: boolean;
  activeSystem: WorldSystem;
  selectedProjectId: string | null;
  experienceRoleIndex: number;
  nearbyLocationId: LocationId | null;
  visitedLocations: LocationId[];
  completedMissions: string[];
  playerPosition: Vec3;
  playerRotation: number;
  transitTarget: LocationId | null;
  skipTransit: boolean;
  pointerLocked: boolean;
  menuOpen: boolean;
  missionToast: string | null;
  showFirstMission: boolean;
  coords: { x: number; z: number };

  setPhase: (phase: GameState["phase"]) => void;
  setWorldMode: (mode: WorldMode) => void;
  setForce2D: (v: boolean) => void;
  setWebglOk: (v: boolean) => void;
  setIsMobile: (v: boolean) => void;
  setExploreWithMouse: (v: boolean) => void;
  setSoundEnabled: (v: boolean) => void;
  setReduceMotion: (v: boolean) => void;
  setGraphicsQuality: (q: GraphicsQuality) => void;
  setResolvedQuality: (q: Exclude<GraphicsQuality, "auto">) => void;
  setPaused: (v: boolean) => void;
  openSystem: (system: WorldSystem, projectId?: string | null) => void;
  closeSystem: () => void;
  /** Alias for navigation menus */
  openPanel: (system: WorldSystem, projectId?: string | null) => void;
  closePanel: () => void;
  setNearbyLocation: (id: LocationId | null) => void;
  visitLocation: (id: LocationId) => void;
  completeMission: (id: string) => void;
  setPlayerPosition: (pos: Vec3) => void;
  setPlayerRotation: (r: number) => void;
  setCoords: (x: number, z: number) => void;
  beginTransit: (id: LocationId) => void;
  finishTransit: () => void;
  setSkipTransit: (v: boolean) => void;
  setExperienceRoleIndex: (i: number) => void;
  setPointerLocked: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  setMissionToast: (msg: string | null) => void;
  setShowFirstMission: (v: boolean) => void;
  enterWorld: () => void;
  skipIntro: () => void;
  enterLocation: (id: LocationId) => void;
  returnToWorld: () => void;
};

const systemForLocation = (id: LocationId): WorldSystem => {
  const map: Record<LocationId, WorldSystem> = {
    "engineering-hq": "experience",
    "project-garage": "projects",
    "dev-lab": "skills",
    "ai-lab": "ai",
    "performance-center": "performance",
    university: "education",
    "connect-hub": "contact",
  };
  return map[id];
};

const missionForLocation = (id: LocationId): string | null => {
  const map: Partial<Record<LocationId, string>> = {
    "engineering-hq": "mission-01",
    "dev-lab": "mission-02",
    "project-garage": "mission-03",
    "ai-lab": "mission-04",
    "connect-hub": "mission-05",
  };
  return map[id] ?? null;
};

export const useGameStore = create<GameState>((set, get) => ({
  phase: "intro",
  worldMode: "explore",
  force2D: false,
  webglOk: true,
  isMobile: false,
  exploreWithMouse: false,
  soundEnabled: false,
  reduceMotion: false,
  graphicsQuality: "auto",
  resolvedQuality: "medium",
  paused: false,
  activeSystem: "none",
  selectedProjectId: null,
  experienceRoleIndex: 0,
  nearbyLocationId: null,
  visitedLocations: [],
  completedMissions: [],
  playerPosition: [0, 0.9, 6],
  playerRotation: 0,
  transitTarget: null,
  skipTransit: false,
  pointerLocked: false,
  menuOpen: false,
  missionToast: null,
  showFirstMission: false,
  coords: { x: 0, z: 6 },

  setPhase: (phase) => set({ phase }),
  setWorldMode: (worldMode) => set({ worldMode }),
  setForce2D: (force2D) =>
    set({ force2D, phase: force2D ? "fallback" : get().phase }),
  setWebglOk: (webglOk) => set({ webglOk }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setExploreWithMouse: (exploreWithMouse) => set({ exploreWithMouse }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  setGraphicsQuality: (graphicsQuality) => set({ graphicsQuality }),
  setResolvedQuality: (resolvedQuality) => set({ resolvedQuality }),
  setPaused: (paused) => set({ paused }),

  openSystem: (activeSystem, projectId = null) =>
    set({
      activeSystem,
      selectedProjectId: projectId,
      paused: activeSystem === "pause" || activeSystem === "missions",
      menuOpen: activeSystem === "pause",
      worldMode:
        activeSystem === "none" ||
        activeSystem === "pause" ||
        activeSystem === "missions"
          ? get().worldMode
          : "interior",
    }),

  closeSystem: () =>
    set({
      activeSystem: "none",
      selectedProjectId: null,
      paused: false,
      menuOpen: false,
      worldMode: "explore",
      transitTarget: null,
      experienceRoleIndex: 0,
    }),

  openPanel: (system, projectId) => get().openSystem(system, projectId),
  closePanel: () => get().closeSystem(),

  setNearbyLocation: (nearbyLocationId) => set({ nearbyLocationId }),
  visitLocation: (id) => {
    const visited = get().visitedLocations;
    if (!visited.includes(id)) {
      set({ visitedLocations: [...visited, id] });
    }
  },
  completeMission: (id) => {
    const done = get().completedMissions;
    if (!done.includes(id)) {
      set({ completedMissions: [...done, id] });
    }
  },
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  setPlayerRotation: (playerRotation) => set({ playerRotation }),
  setCoords: (x, z) => set({ coords: { x, z } }),
  beginTransit: (id) =>
    set({
      worldMode: "transit",
      transitTarget: id,
      skipTransit: false,
      paused: true,
    }),
  finishTransit: () => {
    const id = get().transitTarget;
    if (!id) {
      set({ worldMode: "explore", paused: false });
      return;
    }
    get().visitLocation(id);
    const mid = missionForLocation(id);
    if (mid) get().completeMission(mid);
    set({
      worldMode: "interior",
      activeSystem: systemForLocation(id),
      paused: false,
      transitTarget: null,
      showFirstMission: false,
    });
  },
  setSkipTransit: (skipTransit) => set({ skipTransit }),
  setExperienceRoleIndex: (experienceRoleIndex) => set({ experienceRoleIndex }),
  setPointerLocked: (pointerLocked) => set({ pointerLocked }),
  setMenuOpen: (menuOpen) => set({ menuOpen, paused: menuOpen }),
  setMissionToast: (missionToast) => set({ missionToast }),
  setShowFirstMission: (showFirstMission) => set({ showFirstMission }),
  enterWorld: () =>
    set({
      phase: "cinematic",
      skipTransit: false,
      showFirstMission: false,
    }),
  skipIntro: () =>
    set({
      phase: "playing",
      worldMode: "explore",
      showFirstMission: true,
      missionToast: "Explore the Developer World",
    }),
  enterLocation: (id) => {
    if (get().reduceMotion) {
      get().visitLocation(id);
      const mid = missionForLocation(id);
      if (mid) get().completeMission(mid);
      set({
        worldMode: "interior",
        activeSystem: systemForLocation(id),
        transitTarget: null,
        showFirstMission: false,
      });
      return;
    }
    get().beginTransit(id);
  },
  returnToWorld: () =>
    set({
      worldMode: "explore",
      activeSystem: "none",
      selectedProjectId: null,
      paused: false,
      transitTarget: null,
      experienceRoleIndex: 0,
    }),
}));
