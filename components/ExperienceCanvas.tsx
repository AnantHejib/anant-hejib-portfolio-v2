"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const lidarVertexShader = `
uniform float uTime;
uniform float uScanProgress;

attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;
varying float vHeight;

void main() {
  vColor = aColor;
  vHeight = position.y;
  
  // Calculate distance from the scanning plane (scanning along Z axis)
  float distToScan = position.z - uScanProgress;
  
  // Base alpha is very low, but spikes incredibly bright exactly at the scan line
  // and leaves a trailing fade behind it.
  float alpha = 0.05; 
  
  if (distToScan < 0.0 && distToScan > -4.0) {
    // Trailing glow
    alpha = mix(0.8, 0.05, abs(distToScan) / 4.0);
  } else if (abs(distToScan) < 0.1) {
    // Leading bright edge
    alpha = 1.0;
  }
  
  vAlpha = alpha;
  
  // Optional: subtle vertical bobbing for a holographic glitch feel
  vec3 pos = position;
  pos.y += sin(uTime * 5.0 + position.x * 2.0) * 0.02 * (1.0 - alpha);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // Thicker points at the scan line
  gl_PointSize = (alpha > 0.8 ? 3.0 : 1.5) * (15.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const lidarFragmentShader = `
varying vec3 vColor;
varying float vAlpha;
varying float vHeight;

void main() {
  // Soft round points
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;
  
  // Add a slight color gradient based on height (Green at bottom, Blue/Cyan at top)
  vec3 bottomColor = vec3(0.0, 1.0, 0.5); // Neon Green
  vec3 topColor = vec3(0.1, 0.4, 1.0);    // Deep Blue
  
  vec3 heightColor = mix(bottomColor, topColor, clamp(vHeight / 3.0, 0.0, 1.0));
  vec3 finalColor = mix(vColor, heightColor, 0.5);
  
  gl_FragColor = vec4(finalColor, vAlpha);
}
`;

function LiDARRoom() {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Procedurally generate a "Server Room / Factory Floor" point cloud
  const { positions, colors } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    
    const cyan = new THREE.Color("#4fd1e5");
    const green = new THREE.Color("#00ff88");

    const addPoint = (x: number, y: number, z: number, c: THREE.Color) => {
      pos.push(x, y, z);
      // Introduce subtle noise to make it look like a real LiDAR scan
      const noiseColor = c.clone().multiplyScalar(0.8 + Math.random() * 0.4);
      col.push(noiseColor.r, noiseColor.g, noiseColor.b);
    };

    // Floor (Grid pattern)
    for (let x = -8; x <= 8; x += 0.2) {
      for (let z = -8; z <= 8; z += 0.2) {
        if (Math.random() > 0.3) {
          addPoint(x + (Math.random()-0.5)*0.05, 0 + (Math.random()-0.5)*0.02, z + (Math.random()-0.5)*0.05, cyan);
        }
      }
    }

    // Walls
    for (let x = -8; x <= 8; x += 0.15) {
      for (let y = 0; y <= 4; y += 0.15) {
        if (Math.random() > 0.5) {
          addPoint(x, y, -8, cyan); // Back wall
          addPoint(x, y, 8, cyan);  // Front wall
        }
      }
    }
    for (let z = -8; z <= 8; z += 0.15) {
      for (let y = 0; y <= 4; y += 0.15) {
        if (Math.random() > 0.5) {
          addPoint(-8, y, z, cyan); // Left wall
          addPoint(8, y, z, cyan);  // Right wall
        }
      }
    }

    // Server Racks / Tables in the center
    const createRack = (cx: number, cz: number, width: number, depth: number, height: number) => {
      for (let x = cx - width/2; x <= cx + width/2; x += 0.1) {
        for (let z = cz - depth/2; z <= cz + depth/2; z += 0.1) {
          for (let y = 0; y <= height; y += 0.1) {
            // Only draw edges/surfaces to save points and look holographic
            const isEdge = 
              (x > cx - width/2 + 0.1 && x < cx + width/2 - 0.1) &&
              (z > cz - depth/2 + 0.1 && z < cz + depth/2 - 0.1) &&
              (y > 0.1 && y < height - 0.1);
            
            if (!isEdge && Math.random() > 0.2) {
              addPoint(x, y, z, green);
            }
          }
        }
      }
    };

    // Rows of server racks
    createRack(-3, -3, 1.5, 4, 2.5);
    createRack(0, -3, 1.5, 4, 2.5);
    createRack(3, -3, 1.5, 4, 2.5);
    
    createRack(-3, 3, 1.5, 4, 2.5);
    createRack(0, 3, 1.5, 4, 2.5);
    createRack(3, 3, 1.5, 4, 2.5);

    return { 
      positions: new Float32Array(pos), 
      colors: new Float32Array(col)
    };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScanProgress: { value: -10.0 }
  }), []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = time;
      
      // Move scanline slowly from front to back (-10 to +10)
      let progress = shaderRef.current.uniforms.uScanProgress.value;
      progress += delta * 2.5; // Scanning speed
      if (progress > 12.0) {
        progress = -10.0; // Reset loop
      }
      shaderRef.current.uniforms.uScanProgress.value = progress;
    }

    if (groupRef.current) {
      // Slowly pan the camera around the room
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.2;
      groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, -6]} rotation={[0.4, 0.5, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderRef}
          vertexShader={lidarVertexShader}
          fragmentShader={lidarFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Scanning Laser Plane matching the uScanProgress */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        {/* We move this mesh in the render loop to match the scan plane, but doing it in the shader is cleaner. 
            Alternatively, let's just let the points do the heavy lifting! */}
      </mesh>
    </group>
  );
}

export default function ExperienceCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }} dpr={[1, 2]}>
        <color attach="background" args={["#030508"]} />
        <LiDARRoom />
      </Canvas>
      {/* Cyber overlay elements */}
      <div className="absolute inset-0 pointer-events-none border border-cyan-500/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
      <div className="absolute top-4 left-4 text-cyan-400 font-mono text-[10px] tracking-widest opacity-60">
        LIDAR_SCAN_ACTIVE // BLDG_4
      </div>
      <div className="absolute bottom-4 right-4 text-cyan-400 font-mono text-[10px] tracking-widest opacity-60">
        REC <span className="animate-pulse text-red-500">●</span>
      </div>
    </div>
  );
}
