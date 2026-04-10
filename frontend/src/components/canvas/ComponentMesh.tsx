"use client";

import { useRef } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { CanvasComponent } from "../CabinetBuilder";

interface ComponentMeshProps {
  comp: CanvasComponent;
  materialColor: THREE.ColorRepresentation;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, pos: [number, number, number]) => void;
  orbitRef: React.RefObject<any>;
}

const T = 0.75 / 12; // 3/4" panel thickness in feet

// ─── Hollow cabinet shell (5 panels, open front) ──────────────────────────────

interface MatProps {
  color: THREE.ColorRepresentation;
  roughness: number;
  metalness: number;
  emissive: string;
  emissiveIntensity: number;
}

function HollowBox({ w, h, d, ...mat }: { w: number; h: number; d: number } & MatProps) {
  const m = <meshStandardMaterial {...mat} />;
  return (
    <>
      {/* Back panel */}
      <mesh position={[0, 0, -d / 2 + T / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, h, T]} />{m}
      </mesh>
      {/* Left side */}
      <mesh position={[-w / 2 + T / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, h, d]} />{m}
      </mesh>
      {/* Right side */}
      <mesh position={[w / 2 - T / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, h, d]} />{m}
      </mesh>
      {/* Top panel */}
      <mesh position={[0, h / 2 - T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w - T * 2, T, d]} />{m}
      </mesh>
      {/* Bottom panel */}
      <mesh position={[0, -h / 2 + T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w - T * 2, T, d]} />{m}
      </mesh>
    </>
  );
}

// ─── Component mesh ───────────────────────────────────────────────────────────

export function ComponentMesh({
  comp,
  materialColor,
  isSelected,
  onSelect,
  onMove,
  orbitRef,
}: ComponentMeshProps) {
  const groupRef = useRef<THREE.Group>(null!);

  const w  = comp.width    / 12;
  const h  = comp.height   / 12;
  const d  = comp.depth    / 12;
  const px = comp.position[0] / 12;
  const py = comp.position[1] / 12;
  const pz = comp.position[2] / 12;

  const matProps: MatProps = {
    color: materialColor,
    roughness: comp.type === "shelf" || comp.type === "divider" ? 0.75 : 0.65,
    metalness: 0.05,
    emissive: isSelected ? "#e8c99a" : "#000000",
    emissiveIntensity: isSelected ? 0.35 : 0,
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(comp.id);
  };

  const handleTransformChange = () => {
    if (!groupRef.current) return;
    const p = groupRef.current.position;
    onMove(comp.id, [p.x * 12, p.y * 12, p.z * 12]);
  };

  return (
    <>
      <group ref={groupRef} position={[px, py, pz]} onClick={handleClick}>
        {comp.type === "box" ? (
          <HollowBox w={w} h={h} d={d} {...matProps} />
        ) : (
          <mesh castShadow receiveShadow>
            {getGeometry(comp.type, w, h, d)}
            <meshStandardMaterial {...matProps} />
          </mesh>
        )}
      </group>

      {isSelected && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode="translate"
          size={0.55}
          onChange={handleTransformChange}
          onMouseDown={() => { if (orbitRef.current) orbitRef.current.enabled = false; }}
          onMouseUp={()   => { if (orbitRef.current) orbitRef.current.enabled = true;  }}
        />
      )}
    </>
  );
}

// ─── Geometry by component type ──────────────────────────────────────────────

function getGeometry(type: string, w: number, h: number, d: number) {
  switch (type) {
    case "shelf":    return <boxGeometry args={[w, T, d]} />;
    case "divider":  return <boxGeometry args={[T, h, d]} />;
    case "toe-kick": return <boxGeometry args={[w, h, T]} />;
    case "door":
    case "drawer":   return <boxGeometry args={[w, h, T * 1.2]} />;
    default:         return <boxGeometry args={[w, h, d]} />;
  }
}
