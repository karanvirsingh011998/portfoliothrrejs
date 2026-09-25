"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type PlayerCharacterProps = {
  position: THREE.Vector3;
  rotationY: MutableRefObject<number>;
  moving: MutableRefObject<boolean>;
};

/**
 * Original stylized low-poly developer avatar.
 * Not based on any existing game character.
 */
export function PlayerCharacter({ position, rotationY, moving }: PlayerCharacterProps) {
  const group = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);
  const bob = useRef(0);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.position.copy(position);
    group.current.rotation.y = rotationY.current;

    if (moving.current) {
      bob.current += dt * 10;
      const swing = Math.sin(bob.current) * 0.45;
      if (leftLeg.current) leftLeg.current.rotation.x = swing;
      if (rightLeg.current) rightLeg.current.rotation.x = -swing;
      if (leftArm.current) leftArm.current.rotation.x = -swing * 0.6;
      if (rightArm.current) rightArm.current.rotation.x = swing * 0.6;
      group.current.position.y = position.y + Math.abs(Math.sin(bob.current)) * 0.04;
    } else {
      bob.current = 0;
      if (leftLeg.current) leftLeg.current.rotation.x = 0;
      if (rightLeg.current) rightLeg.current.rotation.x = 0;
      if (leftArm.current) leftArm.current.rotation.x = 0;
      if (rightArm.current) rightArm.current.rotation.x = 0;
    }
  });

  return (
    <group ref={group}>
      {/* Legs */}
      <mesh ref={leftLeg} position={[-0.16, 0.35, 0]} castShadow>
        <boxGeometry args={[0.18, 0.5, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh ref={rightLeg} position={[0.16, 0.35, 0]} castShadow>
        <boxGeometry args={[0.18, 0.5, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Sneakers */}
      <mesh position={[-0.16, 0.08, 0.05]} castShadow>
        <boxGeometry args={[0.22, 0.12, 0.32]} />
        <meshStandardMaterial color="#3dd6c6" />
      </mesh>
      <mesh position={[0.16, 0.08, 0.05]} castShadow>
        <boxGeometry args={[0.22, 0.12, 0.32]} />
        <meshStandardMaterial color="#3dd6c6" />
      </mesh>
      {/* Body / hoodie */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.55, 0.65, 0.35]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Hoodie hood */}
      <mesh position={[0, 1.18, -0.05]} castShadow>
        <boxGeometry args={[0.42, 0.2, 0.3]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Arms */}
      <mesh ref={leftArm} position={[-0.38, 0.85, 0]} castShadow>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh ref={rightArm} position={[0.38, 0.85, 0]} castShadow>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      {/* Backpack */}
      <mesh position={[0, 0.9, -0.28]} castShadow>
        <boxGeometry args={[0.35, 0.4, 0.18]} />
        <meshStandardMaterial color="#0f766e" />
      </mesh>
      {/* Laptop accessory on backpack */}
      <mesh position={[0, 0.95, -0.38]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.28, 0.02, 0.2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.05, -0.42]} rotation={[-0.8, 0, 0]} castShadow>
        <boxGeometry args={[0.28, 0.02, 0.18]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}
