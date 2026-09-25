"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/game-store";

/**
 * Optional click-to-move when keyboard is unavailable.
 * Dispatches world-ground click intents for the player controller.
 */
export function MouseExploreHint() {
  const exploreWithMouse = useGameStore((s) => s.exploreWithMouse);
  const phase = useGameStore((s) => s.phase);
  const isMobile = useGameStore((s) => s.isMobile);
  const dragging = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!exploreWithMouse || isMobile || phase !== "playing") return;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !last.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      window.dispatchEvent(new CustomEvent("kv-look", { detail: { dx, dy } }));
    };
    const onUp = () => {
      dragging.current = false;
      last.current = null;
    };
    const onKeyMove = (e: KeyboardEvent) => {
      // Allow WASD even in mouse explore; also map hold-drag already above
      void e;
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("keydown", onKeyMove);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("keydown", onKeyMove);
    };
  }, [exploreWithMouse, isMobile, phase]);

  return null;
}
