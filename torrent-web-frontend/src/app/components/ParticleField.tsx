"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleWave() {
  const ref = useRef<THREE.Points>(null);
  const count = 1500; // Reduced for better performance

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create a spread pattern
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;

      // Cyan to purple gradient
      const t = Math.random();
      colors[i3] = t * 0.48; // R (purple influence)
      colors[i3 + 1] = 0.9 + t * 0.1; // G (cyan base)
      colors[i3 + 2] = 1; // B (full blue)
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    
    const time = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    ref.current.rotation.y = time * 0.05;
    
    // Wave effect on particles
    const posArray = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const z = positions[i3 + 2];
      
      posArray[i3 + 1] = positions[i3 + 1] + 
        Math.sin(x * 0.5 + time) * 0.5 +
        Math.cos(z * 0.5 + time * 0.5) * 0.3;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}


export function ParticleField() {
  return (
    <div className="fixed inset-0 z-0 opacity-50">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 75 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={1}
        frameloop="always"
      >
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 10, 30]} />
        <ambientLight intensity={0.5} />
        <ParticleWave />
      </Canvas>
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#050505]/50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_70%)] pointer-events-none" />
    </div>
  );
}

