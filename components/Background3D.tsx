"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

function AnimatedAvatar() {
  const group = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) {
      // Move left to right
      group.current.position.x += delta * 2.5;

      // Wrap around screen (assuming camera is at z=8, fov=45, x ranges ~-12 to 12)
      if (group.current.position.x > 15) {
        group.current.position.x = -15;
      }

      // Simple walking animation
      const t = state.clock.elapsedTime * 6; // Walking speed
      
      // Bobbing body
      group.current.position.y = Math.sin(t * 2) * 0.1;

      // Swinging limbs
      if (leftLeg.current && rightLeg.current) {
        leftLeg.current.rotation.x = Math.sin(t) * 0.6;
        rightLeg.current.rotation.x = -Math.sin(t) * 0.6;
      }
      if (leftArm.current && rightArm.current) {
        leftArm.current.rotation.x = -Math.sin(t) * 0.6;
        rightArm.current.rotation.x = Math.sin(t) * 0.6;
      }
    }
  });

  return (
    <group ref={group} position={[-15, 0, -2]}>
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#4fd1e5" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.4, 0.8, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Arms */}
      <group position={[-0.6, 1.1, 0]}>
        <mesh ref={leftArm} position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.15, 0.6, 8, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
      <group position={[0.6, 1.1, 0]}>
        <mesh ref={rightArm} position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.15, 0.6, 8, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* Legs */}
      <group position={[-0.2, 0.2, 0]}>
        <mesh ref={leftLeg} position={[0, -0.5, 0]}>
          <capsuleGeometry args={[0.18, 0.8, 8, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
      </group>
      <group position={[0.2, 0.2, 0]}>
        <mesh ref={rightLeg} position={[0, -0.5, 0]}>
          <capsuleGeometry args={[0.18, 0.8, 8, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

export function Background3D() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#050505]">
      <Canvas camera={{ position: [0, 1, 10], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#4fd1e5" />
        
        {/* Animated 3D character */}
        <AnimatedAvatar />
        
        {/* Atmosphere/particles */}
        <Sparkles count={300} scale={15} size={2.5} speed={0.3} opacity={0.4} color="#4fd1e5" />
      </Canvas>
      {/* Vignette overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-70 pointer-events-none" />
    </div>
  );
}
