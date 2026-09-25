"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LOCATIONS } from "@/data/portfolio";
import { useGameStore } from "@/store/game-store";

const TMP_FROM = new THREE.Vector3();
const TMP_TO = new THREE.Vector3();
const TMP_LOOK = new THREE.Vector3();
const TMP_LOOK_FROM = new THREE.Vector3();

/**
 * Cinematic camera director for location entry / return.
 * Runs 1–2s transitions; skippable via store.skipTransit.
 */
export function CameraDirector() {
  const { camera } = useThree();
  const worldMode = useGameStore((s) => s.worldMode);
  const transitTarget = useGameStore((s) => s.transitTarget);
  const skipTransit = useGameStore((s) => s.skipTransit);
  const finishTransit = useGameStore((s) => s.finishTransit);
  const reduceMotion = useGameStore((s) => s.reduceMotion);

  const progress = useRef(0);
  const active = useRef(false);
  const fromPos = useRef(new THREE.Vector3());
  const toPos = useRef(new THREE.Vector3());
  const fromLook = useRef(new THREE.Vector3());
  const toLook = useRef(new THREE.Vector3());

  useEffect(() => {
    if (worldMode !== "transit" || !transitTarget) {
      active.current = false;
      progress.current = 0;
      return;
    }

    const loc = LOCATIONS.find((l) => l.id === transitTarget);
    if (!loc) return;

    if (reduceMotion || skipTransit) {
      camera.position.set(...loc.approachCam);
      camera.lookAt(...loc.lookAt);
      finishTransit();
      return;
    }

    fromPos.current.copy(camera.position);
    toPos.current.set(...loc.approachCam);
    // approximate current look
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    fromLook.current.copy(camera.position).add(dir.multiplyScalar(8));
    toLook.current.set(...loc.lookAt);
    progress.current = 0;
    active.current = true;
  }, [worldMode, transitTarget, skipTransit, reduceMotion, camera, finishTransit]);

  useEffect(() => {
    if (skipTransit && worldMode === "transit") {
      finishTransit();
    }
  }, [skipTransit, worldMode, finishTransit]);

  useFrame((_, dt) => {
    if (!active.current || worldMode !== "transit") return;

    progress.current = Math.min(1, progress.current + dt / 1.45);
    const t = progress.current;
    const eased = t * t * (3 - 2 * t);

    TMP_FROM.copy(fromPos.current);
    TMP_TO.copy(toPos.current);
    camera.position.lerpVectors(TMP_FROM, TMP_TO, eased);

    TMP_LOOK_FROM.copy(fromLook.current);
    TMP_LOOK.copy(toLook.current);
    const look = TMP_LOOK_FROM.lerp(TMP_LOOK, eased);
    camera.lookAt(look);

    if (progress.current >= 1) {
      active.current = false;
      finishTransit();
    }
  });

  return null;
}
