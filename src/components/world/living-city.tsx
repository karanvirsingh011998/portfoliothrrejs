"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/store/game-store";
import { DISTRICT_LABELS } from "@/data/portfolio";

function FloatingParticles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = 1 + Math.random() * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.02;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + dt * (0.15 + (i % 5) * 0.03);
      if (y > 16) y = 1;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#3dd6c6"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Drone({
  path,
  speed = 1,
  color = "#5b8def",
}: {
  path: [number, number, number][];
  speed?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(Math.random());

  useFrame((_, dt) => {
    if (!ref.current || path.length < 2) return;
    t.current = (t.current + dt * speed * 0.08) % 1;
    const seg = t.current * (path.length - 1);
    const i = Math.floor(seg);
    const f = seg - i;
    const a = path[i];
    const b = path[Math.min(i + 1, path.length - 1)];
    ref.current.position.set(
      a[0] + (b[0] - a[0]) * f,
      a[1] + (b[1] - a[1]) * f + Math.sin(t.current * Math.PI * 4) * 0.15,
      a[2] + (b[2] - a[2]) * f
    );
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.35, 0.08, 0.35]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <pointLight intensity={0.6} distance={4} color={color} />
    </group>
  );
}

function TrafficLight({
  start,
  end,
  delay = 0,
}: {
  start: [number, number, number];
  end: [number, number, number];
  delay?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * 0.12 + delay) % 1;
    ref.current.position.set(
      start[0] + (end[0] - start[0]) * t,
      0.4,
      start[2] + (end[2] - start[2]) * t
    );
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.5, 0.25, 0.9]} />
      <meshStandardMaterial
        color="#0f172a"
        emissive="#3dd6c6"
        emissiveIntensity={0.35}
      />
    </mesh>
  );
}

function AnimatedBillboard({
  position,
  lines,
}: {
  position: [number, number, number];
  lines: string[];
}) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const [line, setLine] = useState(0);
  const last = useRef(0);

  useFrame(({ clock }) => {
    if (mat.current) {
      mat.current.emissiveIntensity = 0.35 + Math.sin(clock.elapsedTime * 3) * 0.2;
    }
    const idx = Math.floor(clock.elapsedTime * 0.45) % lines.length;
    if (idx !== last.current) {
      last.current = idx;
      setLine(idx);
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[0.08, 4.4, 0.08]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0, 4.6, 0]}>
        <boxGeometry args={[3.6, 1.6, 0.12]} />
        <meshStandardMaterial
          ref={mat}
          color="#020617"
          emissive="#3dd6c6"
          emissiveIntensity={0.5}
        />
      </mesh>
      <Text
        position={[0, 4.6, 0.1]}
        fontSize={0.28}
        color="#3dd6c6"
        anchorX="center"
        maxWidth={3.2}
      >
        {lines[line]}
      </Text>
    </group>
  );
}

function DataStream({ position }: { position: [number, number, number] }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const y = ((clock.elapsedTime * 1.5 + i * 0.4) % 6) + 1;
      m.position.y = y;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.2 + y / 8;
    });
  });

  return (
    <group position={position}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[0, 1 + i, 0]}
        >
          <boxGeometry args={[0.08, 0.35, 0.08]} />
          <meshStandardMaterial
            color="#5b8def"
            emissive="#5b8def"
            emissiveIntensity={1.2}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function HoverHologram({
  position,
  label,
}: {
  position: [number, number, number];
  label: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y =
      position[1] + Math.sin(clock.elapsedTime + position[0]) * 0.25;
    ref.current.rotation.y = clock.elapsedTime * 0.4;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <ringGeometry args={[0.6, 0.75, 24]} />
        <meshStandardMaterial
          color="#3dd6c6"
          emissive="#3dd6c6"
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text position={[0, 0.9, 0]} fontSize={0.22} color="#e8eef8" anchorX="center">
        {label}
      </Text>
    </group>
  );
}

function FlickerWindow({ position }: { position: [number, number, number] }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!mat.current) return;
    const flicker =
      Math.sin(clock.elapsedTime * 7 + position[0] * 3) > 0.85 ? 0.2 : 0.7;
    mat.current.emissiveIntensity = flicker;
  });
  return (
    <mesh position={position}>
      <boxGeometry args={[0.4, 0.5, 0.05]} />
      <meshStandardMaterial
        ref={mat}
        color="#93c5fd"
        emissive="#3b82f6"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

export function LivingCity() {
  const quality = useGameStore((s) => s.resolvedQuality);
  const reduceMotion = useGameStore((s) => s.reduceMotion);

  if (reduceMotion) return null;

  const particleCount = quality === "low" ? 30 : quality === "medium" ? 60 : 100;

  return (
    <group>
      <FloatingParticles count={particleCount} />

      {quality !== "low" && (
        <>
          <Drone
            path={[
              [-20, 8, -10],
              [0, 9, -5],
              [20, 8, -8],
              [10, 10, 10],
              [-15, 8, 12],
              [-20, 8, -10],
            ]}
            speed={1.1}
            color="#3dd6c6"
          />
          <Drone
            path={[
              [22, 6, 15],
              [-5, 7, 18],
              [-18, 6, 0],
              [5, 8, -18],
              [22, 6, 15],
            ]}
            speed={0.85}
            color="#a78bfa"
          />
        </>
      )}

      <TrafficLight start={[-2, 0, -24]} end={[-2, 0, 24]} delay={0} />
      <TrafficLight start={[2, 0, 24]} end={[2, 0, -24]} delay={0.4} />
      {quality !== "low" && (
        <>
          <TrafficLight start={[-24, 0, -2]} end={[24, 0, -2]} delay={0.2} />
          <TrafficLight start={[24, 0, 2]} end={[-24, 0, 2]} delay={0.6} />
        </>
      )}

      <AnimatedBillboard
        position={[7, 0, -7]}
        lines={["KARANVIR CITY", "SHIP QUALITY CODE", "MERN // FULL-STACK", "04+ YRS ONLINE"]}
      />
      <AnimatedBillboard
        position={[-9, 0, 9]}
        lines={["REACT · NEXT", "NODE · MONGO", "PERF FIRST", "AI ASSISTED"]}
      />

      <DataStream position={[-14, 0, -10]} />
      <DataStream position={[14, 0, -8]} />
      <DataStream position={[0, 0, -16]} />

      {DISTRICT_LABELS.map((d) => (
        <HoverHologram
          key={d.text}
          position={[d.position[0], 3.5, d.position[2]]}
          label={d.text}
        />
      ))}

      {quality === "high" &&
        [
          [-16, 4, -11],
          [-15, 6, -11],
          [14, 5, 16],
          [0, 4, -17],
        ].map((p, i) => (
          <FlickerWindow key={i} position={p as [number, number, number]} />
        ))}
    </group>
  );
}
