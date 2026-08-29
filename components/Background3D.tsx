"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Interactive Black Hole Accretion Disk & Vortex (inspired by Blackhole InfiVerse)
function BlackHoleAccretionDisk() {
  const pointsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Generate 3500 spiral particles forming a swirling black hole accretion disk
  const { positions, colors, initialAngles, radii, speeds } = useMemo(() => {
    const count = 3500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const rads = new Float32Array(count);
    const spds = new Float32Array(count);

    const cyan = new THREE.Color("#4fd1e5");
    const blue = new THREE.Color("#1769ff");
    const darkCyan = new THREE.Color("#0d4863");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      // Radius distribution: dense near the event horizon (r=2.2 to r=8.5)
      const r = 2.2 + Math.pow(Math.random(), 2.2) * 7.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * (0.35 + (r - 2.2) * 0.15); // thicker at outer edges

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      angles[i] = angle;
      rads[i] = r;
      // Keplerian-like speed: faster closer to center
      spds[i] = 0.8 / Math.sqrt(r);

      // Color mapping: hotter/brighter near event horizon
      let mixedColor = new THREE.Color();
      const t = (r - 2.2) / 7.5;
      if (t < 0.2) {
        mixedColor.lerpColors(white, cyan, t / 0.2);
      } else if (t < 0.6) {
        mixedColor.lerpColors(cyan, blue, (t - 0.2) / 0.4);
      } else {
        mixedColor.lerpColors(blue, darkCyan, (t - 0.6) / 0.4);
      }

      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return { positions: pos, colors: col, initialAngles: angles, radii: rads, speeds: spds };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < 3500; i++) {
      const currentAngle = initialAngles[i] + time * speeds[i] * 0.4;
      const r = radii[i];
      pos[i * 3] = Math.cos(currentAngle) * r;
      pos[i * 3 + 2] = Math.sin(currentAngle) * r;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Subtle tilt & mouse interaction
    if (ringRef.current) {
      ringRef.current.rotation.x = 1.1 + mouse.y * 0.15;
      ringRef.current.rotation.y = mouse.x * 0.25;
      ringRef.current.rotation.z = time * 0.03;
    }
  });

  return (
    <group ref={ringRef} position={[0, 0.5, -3]}>
      {/* Central Black Void (The Event Horizon) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Luminous Inner Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.02, 2.35, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Outer Cyan Gravitational Lens Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.35, 3.8, 64]} />
        <meshBasicMaterial color="#4fd1e5" transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Accretion Disk Swirling Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// Deep Cosmic Starfield & Floating Plasma Beams
function CosmicStarfield() {
  const starsRef = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyan = new THREE.Color("#4fd1e5");
    const blue = new THREE.Color("#1769ff");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25 - 5;

      const c = Math.random() > 0.5 ? cyan : blue;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Left to Right Animated Digital Avatar
function MovingDigitalTwin() {
  const group = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) {
      // Pacing left to right
      group.current.position.x += delta * 2.2;
      if (group.current.position.x > 14) {
        group.current.position.x = -14;
      }

      // Walking motion
      const t = state.clock.elapsedTime * 7;
      group.current.position.y = -2.2 + Math.sin(t * 2) * 0.08;

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
    <group ref={group} position={[-14, -2.2, 2]}>
      {/* Holographic Head with Cyan Glow */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshBasicMaterial color="#4fd1e5" wireframe />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
        <meshStandardMaterial color="#091118" emissive="#1769ff" emissiveIntensity={0.6} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Arms */}
      <group position={[-0.5, 1.1, 0]}>
        <mesh ref={leftArm} position={[0, -0.35, 0]}>
          <capsuleGeometry args={[0.12, 0.55, 6, 12]} />
          <meshBasicMaterial color="#4fd1e5" wireframe />
        </mesh>
      </group>
      <group position={[0.5, 1.1, 0]}>
        <mesh ref={rightArm} position={[0, -0.35, 0]}>
          <capsuleGeometry args={[0.12, 0.55, 6, 12]} />
          <meshBasicMaterial color="#4fd1e5" wireframe />
        </mesh>
      </group>

      {/* Legs */}
      <group position={[-0.2, 0.35, 0]}>
        <mesh ref={leftLeg} position={[0, -0.45, 0]}>
          <capsuleGeometry args={[0.15, 0.75, 6, 12]} />
          <meshStandardMaterial color="#05080d" roughness={0.5} />
        </mesh>
      </group>
      <group position={[0.2, 0.35, 0]}>
        <mesh ref={rightLeg} position={[0, -0.45, 0]}>
          <capsuleGeometry args={[0.15, 0.75, 6, 12]} />
          <meshStandardMaterial color="#05080d" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#03060a]">
      <Canvas camera={{ position: [0, 0, 9], fov: 48 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={3} color="#4fd1e5" distance={15} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />

        {/* 1. Interactive Swirling Black Hole Accretion Disk */}
        <BlackHoleAccretionDisk />

        {/* 2. Deep Cosmic Starfield */}
        <CosmicStarfield />

        {/* 3. Holographic Avatar Walking Across the Screen */}
        <MovingDigitalTwin />
      </Canvas>

      {/* Atmospheric Vignette & Deep Cosmic Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, transparent 20%, rgba(3, 6, 10, 0.6) 70%, rgba(3, 6, 10, 0.95) 100%)'
        }}
      />
    </div>
  );
}
