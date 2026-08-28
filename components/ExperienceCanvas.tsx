"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function DataLattice() {
  const points = useRef<THREE.Points>(null);
  const lines = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const coords: number[] = [];
    for (let row = 0; row < 19; row++) {
      for (let col = 0; col < 31; col++) {
        const x = (col - 15) * .34;
        const y = (row - 9) * .34;
        coords.push(x, y, -2.7 + Math.sin(x * 1.25) * .1 + Math.cos(y * 1.7) * .08);
      }
    }
    return new Float32Array(coords);
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    const scroll = typeof window === "undefined" ? 0 : window.scrollY / Math.max(document.documentElement.scrollHeight, 1);
    points.current.rotation.z = Math.sin(t * .08) * .025;
    points.current.rotation.x = Math.sin(t * .11) * .012;
    points.current.position.y = -scroll * .5;
    if (lines.current) lines.current.rotation.z = -t * .012;
  });

  return <>
    <points ref={points} position={[.8, 0, 0]}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]}/></bufferGeometry>
      <pointsMaterial color="#4fd1e5" size={.013} transparent opacity={.27} sizeAttenuation depthWrite={false}/>
    </points>
    <group ref={lines} position={[1.7, -.2, -2.3]}>
      {Array.from({length: 7}, (_, i) => <mesh key={i} rotation={[0, 0, i * Math.PI / 7]}>
        <ringGeometry args={[2.8 + i * .13, 2.805 + i * .13, 72, 1, i * .34, 1.1 + (i % 3) * .3]}/>
        <meshBasicMaterial color={i % 3 === 0 ? "#4fd1e5" : "#1769ff"} transparent opacity={i % 3 === 0 ? .08 : .11} side={THREE.DoubleSide}/>
      </mesh>)}
    </group>
  </>;
}

function SignalBeams() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.position.x = Math.sin(state.clock.elapsedTime * .18) * .35;
    group.current.children.forEach((child, index) => { child.scale.x = .65 + Math.sin(state.clock.elapsedTime * .7 + index) * .25; });
  });
  return <group ref={group} position={[1, 0, -1.8]}>
    {[-2.2,-1.35,-.4,.55,1.5,2.35].map((y, i) => <mesh key={y} position={[0,y,0]}>
      <planeGeometry args={[5.5,.006]}/><meshBasicMaterial color={i % 2 ? "#1769ff" : "#4fd1e5"} transparent opacity={i % 2 ? .11 : .2} blending={THREE.AdditiveBlending}/>
    </mesh>)}
  </group>;
}

function CometField() {
  const group = useRef<THREE.Group>(null);
  const specs = useMemo(() => Array.from({length: 10}, (_, i) => ({
    x: -6 + (i * 1.73) % 12,
    y: -4 + (i * 2.17) % 8,
    z: -1.3 - (i % 5) * .55,
    speed: .28 + (i % 4) * .1,
    length: .18 + (i % 5) * .13,
  })), []);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.children.forEach((child, index) => {
      child.position.x += delta * specs[index].speed;
      child.position.y += delta * specs[index].speed * .1;
      if (child.position.x > 6.5) { child.position.x = -6.5; child.position.y = specs[index].y; }
    });
    group.current.rotation.z = -.1 + Math.sin(state.clock.elapsedTime * .12) * .025;
  });
  return <group ref={group}>{specs.map((spec,i)=><mesh key={i} position={[spec.x,spec.y,spec.z]}>
    <planeGeometry args={[spec.length,.006]}/><meshBasicMaterial color={i%4===0?"#1769ff":"#4fd1e5"} transparent opacity={i%4===0?.2:.28} blending={THREE.AdditiveBlending} depthWrite={false}/>
  </mesh>)}</group>;
}

function WarpField() {
  const group = useRef<THREE.Group>(null);
  const lastScroll = useRef(0);
  const boost = useRef(0);
  const specs = useMemo(() => Array.from({length:24},(_,index)=>({
    x: -5.4 + (index * 2.37) % 10.8,
    y: -3.4 + (index * 1.91) % 6.8,
    z: -6 + (index % 8) * 1.05,
    size: .018 + (index % 4) * .009,
  })),[]);

  useFrame((state,delta) => {
    if (!group.current) return;
    const scroll = typeof window === "undefined" ? 0 : window.scrollY;
    const impulse = Math.min(Math.abs(scroll-lastScroll.current)/Math.max(delta, .001)/1500, 1);
    boost.current = THREE.MathUtils.damp(boost.current, impulse, 5, delta);
    lastScroll.current = scroll;
    group.current.children.forEach((child,index)=>{
      child.position.z += delta * (.3 + boost.current * 8);
      const closeness = THREE.MathUtils.clamp((child.position.z+6)/10,0,1);
      child.scale.setScalar(.55+closeness*(1.2+boost.current*1.8));
      ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = .08+closeness*.34+boost.current*.24;
      if(child.position.z>4.2){child.position.z=-6.2;child.position.x=specs[index].x;child.position.y=specs[index].y;}
    });
    group.current.rotation.z = state.pointer.x * -.025;
  });

  return <group ref={group}>{specs.map((spec,index)=><mesh key={index} position={[spec.x,spec.y,spec.z]} rotation={[0,0,Math.atan2(spec.y,spec.x)-Math.PI/2]}>
    <planeGeometry args={[spec.size,spec.size*(3+(index%4))]}/><meshBasicMaterial color={index%5===0?"#ffffff":"#4fd1e5"} transparent opacity={.16} blending={THREE.AdditiveBlending} depthWrite={false}/>
  </mesh>)}</group>;
}

function CameraChoreography() {
  useFrame((state) => {
    const scroll = typeof window === "undefined" ? 0 : window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const targetX = state.pointer.x * .18;
    const targetY = state.pointer.y * .1 - scroll * .16;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, .035);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, .035);
    state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, state.pointer.x * -.006, .04);
  });
  return null;
}

function EnergyCoreBlast() {
  const core = useRef<THREE.Group>(null);
  const rays = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!core.current || !rays.current) return;
    const t = state.clock.elapsedTime;
    const charge = Math.pow(Math.max(0, Math.sin(t * .52)), 10);
    core.current.rotation.y += delta * .11;
    core.current.rotation.z -= delta * .045;
    core.current.scale.setScalar(1 + Math.sin(t * 1.4) * .035 + charge * .24);
    rays.current.children.forEach((ray, index) => {
      const flicker = .2 + charge * (1.2 + (index % 5) * .13);
      ray.scale.y = flicker;
      ((ray as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = .025 + charge * .25;
    });
  });
  return <group ref={core} position={[1.65, .2, -1.25]}>
    <mesh><sphereGeometry args={[1.18,20,20]}/><meshBasicMaterial color="#00b9ff" wireframe transparent opacity={.07}/></mesh>
    <mesh><icosahedronGeometry args={[.72,1]}/><meshBasicMaterial color="#4fd1e5" wireframe transparent opacity={.2} blending={THREE.AdditiveBlending}/></mesh>
    <mesh><sphereGeometry args={[.17,14,14]}/><meshBasicMaterial color="#d9fbff" transparent opacity={.88} blending={THREE.AdditiveBlending}/></mesh>
    {[1.38,1.68,2.02].map((radius,index)=><mesh key={radius} rotation={[index*.48,index*.72,index*.34]}><torusGeometry args={[radius,.009,6,80]}/><meshBasicMaterial color={index===1?"#1769ff":"#4fd1e5"} transparent opacity={index===1?.16:.3} blending={THREE.AdditiveBlending}/></mesh>)}
    <group ref={rays}>{Array.from({length:16},(_,index)=>{const angle=index*Math.PI*2/16;return <mesh key={index} rotation={[0,0,angle]} position={[Math.cos(angle)*1.28,Math.sin(angle)*1.28,-.08]}><planeGeometry args={[.012,.95+(index%4)*.22]}/><meshBasicMaterial color={index%5===0?"#ffffff":"#4fd1e5"} transparent opacity={.03} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>})}</group>
  </group>;
}

function OrbitalRig() {
  const rig = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!rig.current || !core.current) return;
    const viewport = typeof window === "undefined" ? 1 : window.innerHeight;
    const progress = typeof window === "undefined" ? 0 : Math.min(window.scrollY / (viewport * 6), 1);
    rig.current.rotation.z += delta * .025;
    rig.current.rotation.x = 1.1 + Math.sin(state.clock.elapsedTime * .2) * .12;
    rig.current.position.y = -progress * .8;
    core.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4) * .08);
  });

  return <group ref={rig} position={[1.3, 0, -1.7]}>
    {[2.25, 3.05, 3.9].map((radius, i) => <mesh key={radius} rotation={[i * .24, i * .5, i * .8]}>
      <torusGeometry args={[radius, i === 0 ? .009 : .004, 6, 96, Math.PI * (1.25 + i * .22)]}/>
      <meshBasicMaterial color={i === 1 ? "#ffffff" : "#4fd1e5"} transparent opacity={i === 1 ? .09 : .24}/>
    </mesh>)}
    <mesh ref={core} position={[0, 0, .2]}>
      <icosahedronGeometry args={[.1, 1]}/>
      <meshBasicMaterial color="#4fd1e5" transparent opacity={.85}/>
    </mesh>
  </group>;
}

function PointerGravityWell() {
  const well = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!well.current) return;
    const targetX = 1.25 + state.pointer.x * 1.15;
    const targetY = .25 + state.pointer.y * .72;
    well.current.position.x = THREE.MathUtils.damp(well.current.position.x, targetX, 4.2, delta);
    well.current.position.y = THREE.MathUtils.damp(well.current.position.y, targetY, 4.2, delta);
    well.current.rotation.z += delta * .09;
    well.current.rotation.x = .18 + state.pointer.y * .12;
  });
  return <group ref={well} position={[1.25,.25,-1.1]}>
    {[.62,.88,1.18].map((radius,index)=><mesh key={radius} rotation={[index*.42,index*.24,index*.68]}>
      <torusGeometry args={[radius,.006,5,72,index === 1 ? Math.PI*1.45 : Math.PI*1.82]}/>
      <meshBasicMaterial color={index===1?"#ffffff":"#4fd1e5"} transparent opacity={index===1?.12:.25} blending={THREE.AdditiveBlending} depthWrite={false}/>
    </mesh>)}
    <mesh><sphereGeometry args={[.045,10,10]}/><meshBasicMaterial color="#dffcff" blending={THREE.AdditiveBlending}/></mesh>
  </group>;
}

function ArtifactMaterial({lite,color="#4fd1e5",wireframe=false,opacity=1}:{lite:boolean;color?:string;wireframe?:boolean;opacity?:number}) {
  return lite
    ? <meshBasicMaterial color={color} wireframe={wireframe} transparent opacity={opacity}/>
    : <meshStandardMaterial color={color} emissive={color} emissiveIntensity={.2} metalness={.78} roughness={.28} wireframe={wireframe} transparent opacity={opacity}/>;
}

function DroneArtifact({lite}:{lite:boolean}) {
  const rotorPoints=[[-.72,.42], [.72,.42],[-.72,-.42],[.72,-.42]] as const;
  return <group scale={.72} rotation={[.35,-.25,-.12]}>
    <mesh scale={[.72,.22,.18]}><boxGeometry/><ArtifactMaterial lite={lite} color="#d8f7fb"/></mesh>
    <mesh rotation={[0,0,.48]} scale={[1.62,.055,.055]}><boxGeometry/><ArtifactMaterial lite={lite}/></mesh>
    <mesh rotation={[0,0,-.48]} scale={[1.62,.055,.055]}><boxGeometry/><ArtifactMaterial lite={lite} color="#1769ff"/></mesh>
    {rotorPoints.map(([x,y],index)=><group key={`${x}-${y}`} position={[x,y,.02]}><mesh><torusGeometry args={[.28,.018,6,lite?18:36]}/><ArtifactMaterial lite={lite} color={index%2?"#1769ff":"#4fd1e5"}/></mesh><mesh scale={[.07,.07,.08]}><cylinderGeometry args={[1,1,1,10]}/><ArtifactMaterial lite={lite} color="#e9fdff"/></mesh></group>)}
    <mesh position={[0,-.08,.22]} scale={[.18,.12,.09]}><sphereGeometry args={[1,lite?8:16,lite?6:12]}/><ArtifactMaterial lite={lite} color="#1769ff"/></mesh>
  </group>;
}

function VisionArtifact({lite}:{lite:boolean}) {
  return <group rotation={[.1,.28,0]}>
    {[.42,.65,.88].map((radius,index)=><mesh key={radius} rotation={[index*.18,index*.1,index*.35]}><torusGeometry args={[radius,.025-index*.005,6,lite?28:56]}/><ArtifactMaterial lite={lite} color={index===1?"#1769ff":"#4fd1e5"} opacity={.82-index*.12}/></mesh>)}
    <mesh scale={.25}><sphereGeometry args={[1,lite?10:20,lite?8:16]}/><ArtifactMaterial lite={lite} color="#dffcff"/></mesh>
    <mesh position={[0,0,.12]} scale={.09}><sphereGeometry args={[1,10,8]}/><meshBasicMaterial color="#06141d"/></mesh>
  </group>;
}

function AICoreArtifact({lite}:{lite:boolean}) {
  return <group rotation={[.3,.2,.18]}>
    <mesh><icosahedronGeometry args={[.68,lite?0:1]}/><ArtifactMaterial lite={lite} wireframe opacity={.72}/></mesh>
    <mesh scale={.31}><icosahedronGeometry args={[1,1]}/><ArtifactMaterial lite={lite} color="#1769ff"/></mesh>
    {!lite&&[.9,1.08].map((radius,index)=><mesh key={radius} rotation={[index*.8,.5,index*.5]}><torusGeometry args={[radius,.012,5,48]}/><ArtifactMaterial lite={lite} color={index?"#4fd1e5":"#ffffff"} opacity={.55}/></mesh>)}
  </group>;
}

function FintechArtifact({lite}:{lite:boolean}) {
  return <group rotation={[.12,-.35,.08]}>
    <mesh rotation={[Math.PI/2,0,0]} scale={[.78,.78,.16]}><cylinderGeometry args={[1,1,1,lite?20:48]}/><ArtifactMaterial lite={lite} color="#1769ff"/></mesh>
    <mesh position={[0,0,.18]}><torusGeometry args={[.58,.025,6,lite?24:48]}/><ArtifactMaterial lite={lite} color="#dffcff"/></mesh>
    {[-.2,0,.2].map((x,index)=><mesh key={x} position={[x,-.08+index*.08,.22]} scale={[.07,.22+index*.08,.035]}><boxGeometry/><ArtifactMaterial lite={lite} color="#4fd1e5"/></mesh>)}
  </group>;
}

function CodeArtifact({lite}:{lite:boolean}) {
  return <group rotation={[.5,.6,.08]}>
    <mesh><boxGeometry args={[1.25,1.25,1.25]}/><ArtifactMaterial lite={lite} color="#4fd1e5" wireframe opacity={.68}/></mesh>
    <mesh scale={.48}><octahedronGeometry/><ArtifactMaterial lite={lite} color="#1769ff"/></mesh>
  </group>;
}

function EngineeringArtifacts({lite}:{lite:boolean}) {
  const group=useRef<THREE.Group>(null);
  const bases=useMemo(()=>[[-2.85,1.65,-1.7],[2.95,1.28,-1.9],[-2.65,-1.55,-2.2],[2.72,-1.7,-2.05],[.25,2.45,-2.5]] as const,[]);
  useFrame((state,delta)=>{
    if(!group.current) return;
    const pageHeight=typeof document==="undefined"?1:Math.max(document.documentElement.scrollHeight-innerHeight,1);
    const progress=typeof window==="undefined"?0:window.scrollY/pageHeight;
    group.current.rotation.y=THREE.MathUtils.damp(group.current.rotation.y,(progress-.5)*1.1+state.pointer.x*.08,2.4,delta);
    group.current.rotation.x=THREE.MathUtils.damp(group.current.rotation.x,state.pointer.y*.05,2.4,delta);
    group.current.children.forEach((child,index)=>{
      child.position.y=bases[index][1]+Math.sin(state.clock.elapsedTime*(.35+index*.025)+index)*(.08+index*.012);
      child.rotation.y+=delta*(.06+index*.012);
    });
  });
  return <group ref={group}>
    <group position={bases[0]}><DroneArtifact lite={lite}/></group>
    <group position={bases[1]}><VisionArtifact lite={lite}/></group>
    <group position={bases[2]}><AICoreArtifact lite={lite}/></group>
    <group position={bases[3]}><FintechArtifact lite={lite}/></group>
    {!lite&&<group position={bases[4]}><CodeArtifact lite={lite}/></group>}
  </group>;
}

const splatVertexShader=`
  attribute float aScale;
  attribute vec3 color;
  uniform float uTime;
  uniform float uProgress;
  varying vec3 vColor;
  void main(){
    vColor=color;
    vec3 p=position;
    float drift=sin(uTime*.42+p.x*1.35+p.y*.8);
    p.z+=drift*.075;
    p.x+=sin(uProgress*6.283+p.y*.72)*.16;
    p.y+=cos(uProgress*4.8+p.x*.55)*.09;
    vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
    gl_Position=projectionMatrix*mvPosition;
    gl_PointSize=aScale*(92.0/max(1.0,-mvPosition.z));
  }
`;

const splatFragmentShader=`
  uniform float uOpacity;
  varying vec3 vColor;
  void main(){
    vec2 center=gl_PointCoord-vec2(.5);
    float radius=dot(center,center);
    float gaussian=exp(-radius*17.0);
    if(gaussian<.018) discard;
    float core=smoothstep(.16,0.0,radius);
    gl_FragColor=vec4(vColor+core*.12,gaussian*uOpacity);
  }
`;

function ProjectGaussianField({lite}:{lite:boolean}) {
  const cloud=useRef<THREE.Points>(null);
  const material=useRef<THREE.ShaderMaterial>(null);
  const count=lite?150:520;
  const attributes=useMemo(()=>{
    const positions=new Float32Array(count*3);
    const colors=new Float32Array(count*3);
    const scales=new Float32Array(count);
    const palette=[new THREE.Color("#4fd1e5"),new THREE.Color("#1769ff"),new THREE.Color("#dffcff"),new THREE.Color("#5585b8")];
    const random=(seed:number)=>{const value=Math.sin(seed*91.345+17.13)*47453.5453;return value-Math.floor(value);};
    for(let index=0;index<count;index++){
      const cluster=index%5;
      const angle=random(index+2)*Math.PI*2;
      const spread=.28+random(index+8)*(.72+cluster*.08);
      const centerX=(cluster-2)*1.08;
      const centerY=Math.sin(cluster*1.7)*.72;
      positions[index*3]=centerX+Math.cos(angle)*spread;
      positions[index*3+1]=centerY+Math.sin(angle)*spread*.72;
      positions[index*3+2]=-2.2+random(index+21)*1.65+Math.sin(angle*2.0)*.18;
      const shade=palette[(index+cluster)%palette.length].clone().lerp(new THREE.Color("#ffffff"),random(index+44)*.12);
      colors.set([shade.r,shade.g,shade.b],index*3);
      scales[index]=lite?3.2+random(index+31)*5.5:4+random(index+31)*10;
    }
    return {positions,colors,scales};
  },[count,lite]);
  const uniforms=useMemo(()=>({uTime:{value:0},uProgress:{value:0},uOpacity:{value:0}}),[]);

  useFrame((state,delta)=>{
    if(!cloud.current||!material.current) return;
    const section=typeof document==="undefined"?null:document.getElementById("work");
    const bounds=section?.getBoundingClientRect();
    const active=Boolean(bounds&&bounds.bottom>-innerHeight*.15&&bounds.top<innerHeight*1.15);
    const sectionProgress=bounds?THREE.MathUtils.clamp((innerHeight-bounds.top)/(bounds.height+innerHeight),0,1):0;
    uniforms.uTime.value=state.clock.elapsedTime;
    uniforms.uProgress.value=sectionProgress;
    uniforms.uOpacity.value=THREE.MathUtils.damp(uniforms.uOpacity.value,active?(lite ? .36 : .88):0,3.5,delta);
    cloud.current.rotation.z=THREE.MathUtils.damp(cloud.current.rotation.z,(sectionProgress-.5)*.42,2.2,delta);
    cloud.current.rotation.y=THREE.MathUtils.damp(cloud.current.rotation.y,state.pointer.x*.12+sectionProgress*.28,2.2,delta);
    cloud.current.position.y=THREE.MathUtils.damp(cloud.current.position.y,(sectionProgress-.5)*-.55,2.1,delta);
  });

  return <points ref={cloud} position={[.7,0,-.35]} frustumCulled={false}>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[attributes.positions,3]}/>
      <bufferAttribute attach="attributes-color" args={[attributes.colors,3]}/>
      <bufferAttribute attach="attributes-aScale" args={[attributes.scales,1]}/>
    </bufferGeometry>
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={splatVertexShader} fragmentShader={splatFragmentShader} transparent depthWrite={false} blending={THREE.AdditiveBlending}/>
  </points>;
}

export default function ExperienceCanvas() {
  const [lite,setLite]=useState(false);
  useEffect(()=>{
    const device=navigator as Navigator & {deviceMemory?:number;connection?:{saveData?:boolean}};
    setLite((device.hardwareConcurrency||8)<=4||(device.deviceMemory||8)<=4||Boolean(device.connection?.saveData)||window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  },[]);
  return <Canvas dpr={lite ? 0.75 : [1, 1.1]} camera={{ position: [0, 0, 7.3], fov: 38 }} gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }} performance={{min:.35,max:1,debounce:220}}>
    <color attach="background" args={["#030405"]}/>
    {!lite&&<><ambientLight intensity={.65}/><directionalLight position={[3,4,6]} intensity={1.4} color="#dffcff"/><pointLight position={[-3,-2,3]} intensity={8} color="#1769ff" distance={9}/></>}
    <DataLattice/>
    <SignalBeams/>
    <CometField/>
    {!lite&&<WarpField/>}
    {!lite&&<EnergyCoreBlast/>}
    <OrbitalRig/>
    <EngineeringArtifacts lite={lite}/>
    <ProjectGaussianField lite={lite}/>
    {!lite&&<PointerGravityWell/>}
    <CameraChoreography/>
    <Sparkles count={lite ? 20 : 58} scale={[10, 8, 5]} size={1.1} speed={lite ? .08 : .18} color="#b8f7ff" opacity={lite ? .18 : .3}/>
    <fog attach="fog" args={["#030405", 6, 13]}/>
  </Canvas>;
}
