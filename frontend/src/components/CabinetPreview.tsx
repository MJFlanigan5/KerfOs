"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, GizmoHelper, GizmoViewport } from "@react-three/drei";
import * as THREE from "three";
import { Cabinet, Material } from "./CabinetBuilder";

interface CabinetPreviewProps {
  cabinet: Cabinet;
  material: Material | null;
}

// ─── Cabinet mesh ────────────────────────────────────────────────────────────

function CabinetMesh({ cabinet, material }: CabinetPreviewProps) {
  const color = getMaterialColor(material?.type);
  const thickness = (material?.thickness ?? 0.75) / 12;

  // Convert inches → feet for Three.js world units
  const w = cabinet.width  / 12;
  const h = cabinet.height / 12;
  const d = cabinet.depth  / 12;

  return (
    <group position={[0, h / 2, 0]}>
      {/* Cabinet box (hollow shell via 5 panels) */}

      {/* Bottom */}
      <mesh position={[0, -h / 2 + thickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, thickness, d]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Top */}
      <mesh position={[0, h / 2 - thickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, thickness, d]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Left side */}
      <mesh position={[-w / 2 + thickness / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[thickness, h, d]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Right side */}
      <mesh position={[w / 2 - thickness / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[thickness, h, d]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Back */}
      <mesh position={[0, 0, -d / 2 + thickness / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, h, thickness]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.02} />
      </mesh>

      {/* Door front */}
      <mesh position={[0, 0, d / 2 - thickness / 2]} castShadow receiveShadow>
        <boxGeometry args={[w - thickness * 2 - 0.02, h - thickness * 2 - 0.02, thickness]} />
        <meshStandardMaterial color={color} roughness={0.65} metalness={0.08} />
      </mesh>

      {/* Door handle */}
      <mesh
        position={[w / 2 - thickness * 3, 0, d / 2 + thickness * 0.5]}
        castShadow
      >
        <boxGeometry args={[0.025, 0.18, 0.025]} />
        <meshStandardMaterial color={0x888888} roughness={0.25} metalness={0.85} />
      </mesh>
    </group>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function Scene({ cabinet, material }: CabinetPreviewProps) {
  return (
    <>
      <Environment preset="studio" />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <CabinetMesh cabinet={cabinet} material={material} />

      <Grid
        position={[0, 0, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.4}
        cellColor="#3a2a1a"
        sectionSize={2}
        sectionThickness={0.8}
        sectionColor="#c45d2c22"
        fadeDistance={18}
        fadeStrength={1.2}
        infiniteGrid
      />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={1}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.05}
      />

      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport
          axisColors={["#c45d2c", "#e8c99a", "#888"]}
          labelColor="#f5f0eb"
        />
      </GizmoHelper>
    </>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function CabinetPreview({ cabinet, material }: CabinetPreviewProps) {
  const h = cabinet.height / 12;

  return (
    <div style={{ width: "100%", height: "100%", background: "var(--k-canvas-bg)" }}>
      <Canvas
        shadows
        camera={{
          position: [h * 1.6, h * 1.2, h * 2.2],
          fov: 42,
          near: 0.01,
          far: 100,
        }}
        gl={{ antialias: true }}
      >
        <Scene cabinet={cabinet} material={material} />
      </Canvas>

      {/* Dimension overlay */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        background: "rgba(26,18,11,0.85)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--k-canvas-border)",
        padding: "8px 12px",
        borderRadius: "3px",
        pointerEvents: "none",
      }}>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--k-canvas-text)", marginBottom: "2px" }}>
          {cabinet.name}
        </div>
        <div style={{ fontSize: "11px", color: "var(--k-canvas-text-muted)", fontVariantNumeric: "tabular-nums" }}>
          {cabinet.width}" W × {cabinet.height}" H × {cabinet.depth}" D
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMaterialColor(materialType?: string): THREE.ColorRepresentation {
  switch (materialType) {
    case "plywood":  return "#c9956a";
    case "mdf":      return "#9b836b";
    case "hardwood": return "#b8864e";
    default:         return "#c9956a";
  }
}
