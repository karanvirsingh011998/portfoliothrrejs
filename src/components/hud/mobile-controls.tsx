"use client";

import { useCallback, useRef } from "react";
import { useGameStore } from "@/store/game-store";

export function MobileControls() {
  const isMobile = useGameStore((s) => s.isMobile);
  const phase = useGameStore((s) => s.phase);
  const paused = useGameStore((s) => s.paused);
  const worldMode = useGameStore((s) => s.worldMode);
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const lookActive = useRef(false);
  const lastLook = useRef<{ x: number; y: number } | null>(null);

  const emitJoystick = useCallback((x: number, y: number) => {
    window.dispatchEvent(new CustomEvent("kv-joystick", { detail: { x, y } }));
  }, []);

  const onJoyStart = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateJoy(e);
  };

  const updateJoy = (e: React.PointerEvent) => {
    const el = baseRef.current;
    const knob = knobRef.current;
    if (!el || !knob) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const max = rect.width / 2 - 10;
    const len = Math.hypot(dx, dy) || 1;
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    emitJoystick(dx / max, dy / max);
  };

  const onJoyEnd = () => {
    if (knobRef.current) knobRef.current.style.transform = "translate(0px, 0px)";
    emitJoystick(0, 0);
  };

  const onLookStart = (e: React.PointerEvent) => {
    lookActive.current = true;
    lastLook.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onLookMove = (e: React.PointerEvent) => {
    if (!lookActive.current || !lastLook.current) return;
    const dx = e.clientX - lastLook.current.x;
    const dy = e.clientY - lastLook.current.y;
    lastLook.current = { x: e.clientX, y: e.clientY };
    window.dispatchEvent(new CustomEvent("kv-look", { detail: { dx, dy } }));
  };

  const onLookEnd = () => {
    lookActive.current = false;
    lastLook.current = null;
  };

  if (!isMobile || phase !== "playing" || paused || worldMode !== "explore")
    return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {/* Look pad — right half */}
      <div
        className="pointer-events-auto absolute inset-y-0 right-0 w-1/2"
        onPointerDown={onLookStart}
        onPointerMove={onLookMove}
        onPointerUp={onLookEnd}
        onPointerCancel={onLookEnd}
      />

      {/* Joystick — left */}
      <div
        ref={baseRef}
        className="pointer-events-auto absolute bottom-28 left-6 flex h-28 w-28 items-center justify-center rounded-full border border-panel-border bg-black/40"
        onPointerDown={onJoyStart}
        onPointerMove={updateJoy}
        onPointerUp={onJoyEnd}
        onPointerCancel={onJoyEnd}
      >
        <div
          ref={knobRef}
          className="h-12 w-12 rounded-full bg-accent/80 shadow-lg will-change-transform"
        />
      </div>
    </div>
  );
}
