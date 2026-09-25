"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LOCATIONS, SPAWN_POSITION } from "@/data/portfolio";
import { useGameStore } from "@/store/game-store";
import { PlayerCharacter } from "./player-character";

const MOVE_SPEED = 8;
const LOOK_SENS = 0.0022;
const WORLD_BOUNDS = 28;

type InputState = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  joystickX: number;
  joystickY: number;
  mouseForward: boolean;
};

export function PlayerController() {
  const { camera, gl } = useThree();
  const position = useRef(new THREE.Vector3(...SPAWN_POSITION));
  const velocity = useRef(new THREE.Vector3());
  const moving = useRef(false);
  const yaw = useRef(0);
  const pitch = useRef(0.25);
  const visualRotation = useRef(Math.PI);
  const cinematicStart = useRef<number | null>(null);
  const input = useRef<InputState>({
    forward: false,
    back: false,
    left: false,
    right: false,
    joystickX: 0,
    joystickY: 0,
    mouseForward: false,
  });

  const paused = useGameStore((s) => s.paused);
  const phase = useGameStore((s) => s.phase);
  const worldMode = useGameStore((s) => s.worldMode);
  const isMobile = useGameStore((s) => s.isMobile);
  const exploreWithMouse = useGameStore((s) => s.exploreWithMouse);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setPlayerRotation = useGameStore((s) => s.setPlayerRotation);
  const setCoords = useGameStore((s) => s.setCoords);
  const setNearbyLocation = useGameStore((s) => s.setNearbyLocation);
  const nearbyLocationId = useGameStore((s) => s.nearbyLocationId);
  const enterLocation = useGameStore((s) => s.enterLocation);
  const openSystem = useGameStore((s) => s.openSystem);
  const returnToWorld = useGameStore((s) => s.returnToWorld);
  const setPointerLocked = useGameStore((s) => s.setPointerLocked);

  const enterRef = useRef(enterLocation);
  const nearbyRef = useRef(nearbyLocationId);
  const openRef = useRef(openSystem);
  const returnRef = useRef(returnToWorld);
  const modeRef = useRef(worldMode);

  enterRef.current = enterLocation;
  nearbyRef.current = nearbyLocationId;
  openRef.current = openSystem;
  returnRef.current = returnToWorld;
  modeRef.current = worldMode;

  const obstacles = useMemo(
    () =>
      LOCATIONS.map((loc) => ({
        x: loc.position[0],
        z: loc.position[2],
        r: 3.2,
      })),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const k = e.code;
      if (k === "KeyW" || k === "ArrowUp") input.current.forward = down;
      if (k === "KeyS" || k === "ArrowDown") input.current.back = down;
      if (k === "KeyA" || k === "ArrowLeft") input.current.left = down;
      if (k === "KeyD" || k === "ArrowRight") input.current.right = down;
      if (k === "KeyE" && down && modeRef.current === "explore") {
        const nearby = nearbyRef.current;
        if (nearby) enterRef.current(nearby);
      }
      if (k === "Escape" && down) {
        if (modeRef.current === "interior") {
          returnRef.current();
        } else {
          openRef.current("pause");
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => onKey(e, true);
    const onKeyUp = (e: KeyboardEvent) => onKey(e, false);

    const onMouseMove = (e: MouseEvent) => {
      if (paused || phase !== "playing" || modeRef.current !== "explore") return;
      const locked = document.pointerLockElement === gl.domElement;
      if (!locked && !exploreWithMouse && !isMobile) return;
      yaw.current -= e.movementX * LOOK_SENS;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current - e.movementY * LOOK_SENS,
        0.05,
        0.9
      );
    };

    const onPointerDown = () => {
      if (isMobile || paused || phase !== "playing" || modeRef.current !== "explore")
        return;
      if (exploreWithMouse) {
        input.current.mouseForward = true;
        return;
      }
      gl.domElement.requestPointerLock();
    };

    const onPointerUp = () => {
      input.current.mouseForward = false;
    };

    const onLockChange = () => {
      setPointerLocked(document.pointerLockElement === gl.domElement);
    };

    const onJoystick = (e: Event) => {
      const detail = (e as CustomEvent).detail as { x: number; y: number };
      input.current.joystickX = detail.x;
      input.current.joystickY = detail.y;
    };

    const onLook = (e: Event) => {
      if (modeRef.current !== "explore") return;
      const detail = (e as CustomEvent).detail as { dx: number; dy: number };
      yaw.current -= detail.dx * 0.004;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current - detail.dy * 0.004,
        0.05,
        0.9
      );
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("kv-joystick", onJoystick);
    window.addEventListener("kv-look", onLook);
    gl.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointerlockchange", onLockChange);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("kv-joystick", onJoystick);
      window.removeEventListener("kv-look", onLook);
      gl.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerlockchange", onLockChange);
    };
  }, [
    gl,
    paused,
    phase,
    isMobile,
    exploreWithMouse,
    setPointerLocked,
  ]);

  useFrame((_, dt) => {
    if (phase === "intro") {
      cinematicStart.current = null;
      return;
    }

    if (phase === "cinematic") {
      if (cinematicStart.current === null) {
        cinematicStart.current = performance.now();
        camera.position.set(0, 28, 36);
      }
      const elapsed = performance.now() - cinematicStart.current;
      const t = Math.min(1, elapsed / 3200);
      const eased = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(
        new THREE.Vector3(0, 28, 36),
        new THREE.Vector3(0, 8, 14),
        eased
      );
      camera.lookAt(0, 1.5, 0);
      return;
    }

    cinematicStart.current = null;

    // Camera director owns transit; freeze player during transit/interior
    if (worldMode === "transit" || worldMode === "interior" || paused) {
      moving.current = false;
      return;
    }

    const i = input.current;
    const forward = new THREE.Vector3(
      -Math.sin(yaw.current),
      0,
      -Math.cos(yaw.current)
    );
    const right = new THREE.Vector3(
      Math.cos(yaw.current),
      0,
      -Math.sin(yaw.current)
    );

    const wish = new THREE.Vector3();
    if (i.forward) wish.add(forward);
    if (i.back) wish.sub(forward);
    if (i.left) wish.sub(right);
    if (i.right) wish.add(right);
    if (i.mouseForward) wish.add(forward);

    if (Math.abs(i.joystickX) > 0.05 || Math.abs(i.joystickY) > 0.05) {
      wish.add(forward.clone().multiplyScalar(-i.joystickY));
      wish.add(right.clone().multiplyScalar(i.joystickX));
    }

    if (wish.lengthSq() > 0) {
      wish.normalize().multiplyScalar(MOVE_SPEED);
      moving.current = true;
    } else {
      moving.current = false;
    }

    velocity.current.lerp(wish, 1 - Math.pow(0.001, dt));
    const next = position.current.clone().addScaledVector(velocity.current, dt);

    for (const ob of obstacles) {
      const dx = next.x - ob.x;
      const dz = next.z - ob.z;
      const dist = Math.hypot(dx, dz);
      if (dist < ob.r && dist > 0.001) {
        const push = (ob.r - dist) / dist;
        next.x += dx * push;
        next.z += dz * push;
      }
    }

    next.x = THREE.MathUtils.clamp(next.x, -WORLD_BOUNDS, WORLD_BOUNDS);
    next.z = THREE.MathUtils.clamp(next.z, -WORLD_BOUNDS, WORLD_BOUNDS);
    next.y = SPAWN_POSITION[1];
    position.current.copy(next);

    const camOffset = new THREE.Vector3(
      Math.sin(yaw.current) * 6,
      2.8 + pitch.current * 2,
      Math.cos(yaw.current) * 6
    );
    const camTarget = position.current.clone().add(new THREE.Vector3(0, 1.2, 0));
    const desiredCam = camTarget.clone().add(camOffset);
    camera.position.lerp(desiredCam, 1 - Math.pow(0.0008, dt));
    camera.lookAt(camTarget);

    visualRotation.current = yaw.current + Math.PI;

    if (Math.random() < 0.2 || moving.current) {
      setPlayerPosition([position.current.x, position.current.y, position.current.z]);
      setPlayerRotation(visualRotation.current);
      setCoords(position.current.x, position.current.z);
    }

    let nearest: (typeof LOCATIONS)[number] | null = null;
    let best = Infinity;
    for (const loc of LOCATIONS) {
      const d = Math.hypot(
        position.current.x - loc.position[0],
        position.current.z - loc.position[2]
      );
      if (d < loc.radius && d < best) {
        best = d;
        nearest = loc;
      }
    }
    setNearbyLocation(nearest?.id ?? null);
  });

  // Hide avatar during interiors for cinematic focus
  if (worldMode === "interior") return null;

  return (
    <PlayerCharacter
      position={position.current}
      rotationY={visualRotation}
      moving={moving}
    />
  );
}
