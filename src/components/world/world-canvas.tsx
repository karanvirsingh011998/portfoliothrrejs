"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload, SoftShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGameStore } from "@/store/game-store";
import { CityWorld } from "./city-world";
import { PlayerController } from "./player-controller";
import { LivingCity } from "./living-city";
import { CameraDirector } from "./camera-director";
import { isTouchDevice } from "@/lib/utils";

function SceneLights() {
  const quality = useGameStore((s) => s.resolvedQuality);
  return (
    <>
      <color attach="background" args={["#050814"]} />
      <fog attach="fog" args={["#070b16", 28, 70]} />
      <ambientLight intensity={0.35} color="#8ea4c8" />
      <directionalLight
        castShadow={quality !== "low"}
        position={[12, 20, 8]}
        intensity={0.55}
        color="#b8c7e8"
        shadow-mapSize-width={quality === "high" ? 2048 : 1024}
        shadow-mapSize-height={quality === "high" ? 2048 : 1024}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight args={["#1e293b", "#020617", 0.4]} />
    </>
  );
}

function QualityResolver() {
  const graphicsQuality = useGameStore((s) => s.graphicsQuality);
  const setResolvedQuality = useGameStore((s) => s.setResolvedQuality);
  const setIsMobile = useGameStore((s) => s.setIsMobile);

  useEffect(() => {
    const mobile = isTouchDevice() || window.innerWidth < 768;
    setIsMobile(mobile);

    if (graphicsQuality !== "auto") {
      setResolvedQuality(graphicsQuality);
      return;
    }

    const cores = navigator.hardwareConcurrency || 4;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
    if (mobile || cores <= 4 || mem <= 4) {
      setResolvedQuality("low");
    } else if (cores <= 8) {
      setResolvedQuality("medium");
    } else {
      setResolvedQuality("high");
    }
  }, [graphicsQuality, setResolvedQuality, setIsMobile]);

  return null;
}

export function WorldCanvas() {
  const phase = useGameStore((s) => s.phase);
  const quality = useGameStore((s) => s.resolvedQuality);
  const reduceMotion = useGameStore((s) => s.reduceMotion);

  const dpr = useMemo(() => {
    if (quality === "low") return [0.7, 1] as [number, number];
    if (quality === "medium") return [1, 1.5] as [number, number];
    return [1, 2] as [number, number];
  }, [quality]);

  if (phase === "intro" || phase === "fallback") return null;

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        shadows={quality !== "low"}
        dpr={dpr}
        camera={{ position: [0, 12, 22], fov: 50, near: 0.1, far: 120 }}
        gl={{
          antialias: quality !== "low",
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.setClearColor("#050814");
        }}
      >
        <QualityResolver />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <SceneLights />
        {quality === "high" && !reduceMotion ? (
          <SoftShadows size={12} samples={8} focus={0.8} />
        ) : null}
        <Suspense fallback={null}>
          <CityWorld />
          <LivingCity />
          <PlayerController />
          <CameraDirector />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
