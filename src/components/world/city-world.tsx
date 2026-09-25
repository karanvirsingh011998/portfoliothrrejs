"use client";

import { Text } from "@react-three/drei";
import { useMemo } from "react";
import { LOCATIONS, PROJECTS } from "@/data/portfolio";
import type { WorldLocation } from "@/types/portfolio";
import { useGameStore } from "@/store/game-store";

function Building({
  location,
  width,
  height,
  depth,
  color,
  accent,
}: {
  location: WorldLocation;
  width: number;
  height: number;
  depth: number;
  color: string;
  accent: string;
}) {
  const [x, , z] = location.position;
  const quality = useGameStore((s) => s.resolvedQuality);
  const windows = useMemo(() => {
    if (quality === "low") return [];
    const items: { px: number; py: number; pz: number }[] = [];
    const cols = Math.max(2, Math.floor(width / 1.4));
    const rows = Math.max(2, Math.floor(height / 1.6));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.push({
          px: -width / 2 + 0.8 + c * ((width - 1.6) / Math.max(cols - 1, 1)),
          py: 1.2 + r * ((height - 2) / Math.max(rows - 1, 1)),
          pz: depth / 2 + 0.02,
        });
      }
    }
    return items;
  }, [width, height, depth, quality]);

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.15} />
      </mesh>
      {/* Glass facade strip */}
      <mesh position={[0, height * 0.45, depth / 2 + 0.05]}>
        <boxGeometry args={[width * 0.7, height * 0.55, 0.08]} />
        <meshStandardMaterial
          color={accent}
          transparent
          opacity={0.35}
          emissive={accent}
          emissiveIntensity={0.25}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      {windows.map((w, i) => (
        <mesh key={i} position={[w.px, w.py, w.pz]}>
          <boxGeometry args={[0.35, 0.45, 0.05]} />
          <meshStandardMaterial
            color="#9fd6ff"
            emissive="#5b8def"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
      {/* Sign */}
      <Text
        position={[0, height + 0.8, 0]}
        fontSize={0.55}
        color="#e8eef8"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {location.name.toUpperCase()}
      </Text>
      {/* Entrance marker */}
      <mesh position={[0, 0.05, depth / 2 + 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.45, 32]} />
        <meshStandardMaterial
          color={location.mapColor}
          emissive={location.mapColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

function StreetLight({ position }: { position: [number, number, number] }) {
  const quality = useGameStore((s) => s.resolvedQuality);
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 3, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.35, 2.9, 0]}>
        <boxGeometry args={[0.7, 0.08, 0.2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.55, 2.75, 0]}>
        <boxGeometry args={[0.25, 0.12, 0.18]} />
        <meshStandardMaterial
          color="#fde68a"
          emissive="#fbbf24"
          emissiveIntensity={1.2}
        />
      </mesh>
      {quality !== "low" && (
        <pointLight
          position={[0.55, 2.6, 0]}
          intensity={2.2}
          distance={10}
          color="#fde68a"
        />
      )}
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 1, 5]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <coneGeometry args={[0.7, 1.4, 6]} />
        <meshStandardMaterial color="#14532d" />
      </mesh>
    </group>
  );
}

function ProjectStation({
  index,
  position,
}: {
  index: number;
  position: [number, number, number];
}) {
  const project = PROJECTS[index];
  const colors = ["#5b8def", "#3dd6c6", "#f0a46e", "#a78bfa", "#4ade80", "#fb7185"];
  const color = colors[index % colors.length];
  const arch = project.archetype;

  return (
    <group position={position}>
      {arch === "showroom" || arch === "portal" ? (
        <>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.8, 0.5, 0.95]} />
            <meshStandardMaterial color={color} metalness={0.45} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.85, -0.05]} castShadow>
            <boxGeometry args={[1.2, 0.45, 0.75]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </>
      ) : arch === "logistics" ? (
        <>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[2.0, 0.9, 1.0]} />
            <meshStandardMaterial color={color} metalness={0.2} />
          </mesh>
          <mesh position={[0.85, 0.35, 0]} castShadow>
            <boxGeometry args={[0.55, 0.5, 0.95]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </>
      ) : arch === "medtech" ? (
        <>
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.65, 1.2, 8]} />
            <meshStandardMaterial color={color} metalness={0.5} />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial color="#e0f2fe" emissive="#38bdf8" emissiveIntensity={0.6} />
          </mesh>
        </>
      ) : arch === "comms" ? (
        <>
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[0.4, 1.6, 0.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 1.9, 0]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[1.4, 0.08, 0.8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[1.4, 1.0, 1.0]} />
            <meshStandardMaterial color={color} metalness={0.35} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <boxGeometry args={[0.9, 0.5, 0.15]} />
            <meshStandardMaterial color="#0f172a" emissive={color} emissiveIntensity={0.5} />
          </mesh>
        </>
      )}
      {/* wheels for wheeled archetypes */}
      {(arch === "showroom" || arch === "portal" || arch === "logistics") &&
        [
          [-0.55, 0.2, 0.5],
          [0.55, 0.2, 0.5],
          [-0.55, 0.2, -0.5],
          [0.55, 0.2, -0.5],
        ].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 10]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        ))}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.2}
        maxWidth={2.4}
        color="#e8eef8"
        anchorX="center"
      >
        {project.name}
      </Text>
    </group>
  );
}

function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0b1220" roughness={0.95} />
      </mesh>
      {/* Roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[6, 56]} />
        <meshStandardMaterial color="#161f2e" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[56, 6]} />
        <meshStandardMaterial color="#161f2e" />
      </mesh>
      {/* Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial color="#132033" />
      </mesh>
      {/* Sidewalks near roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.2, 0.025, 0]}>
        <planeGeometry args={[1.2, 56]} />
        <meshStandardMaterial color="#1a2436" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.2, 0.025, 0]}>
        <planeGeometry args={[1.2, 56]} />
        <meshStandardMaterial color="#1a2436" />
      </mesh>
    </group>
  );
}

function StarsField() {
  const points = useMemo(() => {
    const arr = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 120;
      arr[i * 3 + 1] = 20 + Math.random() * 40;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#c7d2fe" sizeAttenuation />
    </points>
  );
}

export function CityWorld() {
  const quality = useGameStore((s) => s.resolvedQuality);
  const loc = (id: string) => LOCATIONS.find((l) => l.id === id)!;

  const streetLights = useMemo(() => {
    const lights: [number, number, number][] = [];
    for (let i = -24; i <= 24; i += 8) {
      lights.push([3.6, 0, i], [-3.6, 0, i], [i, 0, 3.6], [i, 0, -3.6]);
    }
    return quality === "low" ? lights.filter((_, idx) => idx % 3 === 0) : lights;
  }, [quality]);

  const trees = useMemo(() => {
    const list: [number, number, number][] = [
      [-8, 0, -6],
      [8, 0, -8],
      [-10, 0, 6],
      [10, 0, 8],
      [-22, 0, 0],
      [22, 0, 2],
      [0, 0, 10],
      [4, 0, -14],
      [-4, 0, 16],
    ];
    return quality === "low" ? list.slice(0, 4) : list;
  }, [quality]);

  const garage = loc("project-garage");

  return (
    <group>
      <Ground />
      {quality !== "low" && <StarsField />}

      <Building
        location={loc("engineering-hq")}
        width={8}
        height={10}
        depth={6}
        color="#1e3a5f"
        accent="#5b8def"
      />
      <Building
        location={loc("dev-lab")}
        width={7}
        height={8}
        depth={6}
        color="#134e4a"
        accent="#3dd6c6"
      />
      <Building
        location={loc("ai-lab")}
        width={7}
        height={9}
        depth={6}
        color="#312e81"
        accent="#a78bfa"
      />
      <Building
        location={loc("performance-center")}
        width={8}
        height={7}
        depth={5}
        color="#14532d"
        accent="#4ade80"
      />
      <Building
        location={loc("university")}
        width={7}
        height={6}
        depth={5}
        color="#78350f"
        accent="#fbbf24"
      />
      <Building
        location={loc("connect-hub")}
        width={8}
        height={8}
        depth={6}
        color="#881337"
        accent="#fb7185"
      />

      {/* Project Garage shell */}
      <group position={garage.position}>
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[12, 6, 8]} />
          <meshStandardMaterial color="#292524" roughness={0.7} metalness={0.2} />
        </mesh>
        <mesh position={[0, 2.2, 4.1]}>
          <boxGeometry args={[8, 3.5, 0.1]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#f0a46e"
            emissiveIntensity={0.2}
            transparent
            opacity={0.4}
          />
        </mesh>
        <Text
          position={[0, 6.5, 0]}
          fontSize={0.55}
          color="#e8eef8"
          anchorX="center"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          PROJECT GARAGE
        </Text>
        <mesh position={[0, 0.05, 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.45, 32]} />
          <meshStandardMaterial
            color={garage.mapColor}
            emissive={garage.mapColor}
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
        {PROJECTS.map((_, i) => (
          <ProjectStation
            key={i}
            index={i}
            position={[((i % 3) - 1) * 3.2, 0, Math.floor(i / 3) * 2.8 - 1]}
          />
        ))}
      </group>

      {streetLights.map((p, i) => (
        <StreetLight key={i} position={p} />
      ))}
      {trees.map((p, i) => (
        <Tree key={i} position={p} />
      ))}

      {/* Billboards handled by LivingCity */}

      {/* Central monument */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.6, 0.9, 2.4, 6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <octahedronGeometry args={[0.7]} />
        <meshStandardMaterial
          color="#3dd6c6"
          emissive="#3dd6c6"
          emissiveIntensity={0.8}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}
