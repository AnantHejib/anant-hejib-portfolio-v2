"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;

attribute float aAngle;
attribute float aRadius;
attribute float aSpeed;
attribute float aSize;

varying vec3 vColor;

void main() {
  vColor = color;
  
  // Base orbital rotation
  float currentAngle = aAngle + uTime * aSpeed * 0.4;
  
  // Calculate position in orbit
  vec3 pos = position;
  pos.x = cos(currentAngle) * aRadius;
  pos.z = sin(currentAngle) * aRadius;
  
  // Get screen-space position to calculate mouse distance
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // Map normalized mouse (-1 to 1) to rough view coordinates
  vec2 mouseWorld = uMouse * vec2(12.0, 8.0);
  
  // Calculate 2D distance between particle and mouse
  float dist = distance(mvPosition.xy, mouseWorld);
  
  // Repulsion force (strongest near mouse, tapering off)
  float force = smoothstep(5.0, 0.0, dist);
  
  // Push particles away from mouse radially
  vec2 pushDir = normalize(mvPosition.xy - mouseWorld);
  pos.x += pushDir.x * force * 1.5;
  pos.z += pushDir.y * force * 1.5;
  
  // Add vertical distortion wave based on mouse interaction
  pos.y += sin(dist * 2.0 - uTime * 4.0) * force * 0.5;

  mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // Dynamic size based on camera distance and mouse force
  gl_PointSize = aSize * (40.0 / -mvPosition.z) * (1.0 + force * 1.5);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;

void main() {
  // Create a soft glowing circular particle
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;
  
  // Soft edge glow
  float alpha = smoothstep(0.5, 0.1, dist);
  
  // Brighter core
  vec3 finalColor = mix(vColor, vec3(1.0), smoothstep(0.2, 0.0, dist));
  
  gl_FragColor = vec4(finalColor, alpha);
}
`;

function BlackHoleAccretionDisk() {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const ringRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Generate 15,000 particles
  const { positions, colors, angles, radii, speeds, sizes } = useMemo(() => {
    const count = 15000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const ang = new Float32Array(count);
    const rad = new Float32Array(count);
    const spd = new Float32Array(count);
    const siz = new Float32Array(count);

    const cyan = new THREE.Color("#4fd1e5");
    const blue = new THREE.Color("#1769ff");
    const darkBlue = new THREE.Color("#0a2b5e");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      // Density distribution: packed at event horizon (r=2.2), sparser outward
      const r = 2.2 + Math.pow(Math.random(), 2.5) * 8.0;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * (0.2 + (r - 2.2) * 0.15); 

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      ang[i] = angle;
      rad[i] = r;
      spd[i] = 1.0 / Math.pow(r, 0.8); // Fast at center, slow at edges
      siz[i] = Math.random() * 0.8 + 0.2; // Varied sizes

      // Color mapping
      let mixedColor = new THREE.Color();
      const t = (r - 2.2) / 8.0;
      if (t < 0.1) {
        mixedColor.lerpColors(white, cyan, t / 0.1);
      } else if (t < 0.4) {
        mixedColor.lerpColors(cyan, blue, (t - 0.1) / 0.3);
      } else {
        mixedColor.lerpColors(blue, darkBlue, (t - 0.4) / 0.6);
      }

      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return { positions: pos, colors: col, angles: ang, radii: rad, speeds: spd, sizes: siz };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  }), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Update shader uniforms
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = time;
      
      // Smoothly interpolate mouse position for fluid interaction
      shaderRef.current.uniforms.uMouse.value.lerp(mouse, 0.1);
    }

    // Subtle tilt & gyroscopic rotation of the whole system
    if (ringRef.current) {
      ringRef.current.rotation.x = 1.1 + mouse.y * 0.1;
      ringRef.current.rotation.y = mouse.x * 0.2;
      ringRef.current.rotation.z = time * 0.05;
    }
  });

  return (
    <group ref={ringRef} position={[0, 0.5, -4]}>
      {/* Central Black Void (Event Horizon) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Luminous Inner Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.01, 2.3, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* GPU Accelerated Particle System (15,000 particles) */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aAngle" args={[angles, 1]} />
          <bufferAttribute attach="attributes-aRadius" args={[radii, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          vertexColors
          depthWrite={false}
          blending={THREE.AdditiveBlending}
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
