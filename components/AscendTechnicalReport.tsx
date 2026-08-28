"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa6";

const flightStack = [
  ["FLIGHT AUTHORITY","Pixhawk 6C / PX4","Low-level attitude, velocity, yaw, motor mixing and immediate failsafes."],
  ["MISSION COMPUTER","Raspberry Pi 5 · 16 GB · 512 GB NVMe","Python mission supervisor, MAVSDK/MAVLink, logging, imagery and dashboard publication."],
  ["ARENA AWARENESS","SLAMTEC RPLidar A1M8","360° horizontal wall sectors, lane geometry support and collision checks."],
  ["LOCAL MOTION","Holybro H-Flow","Optical flow, time-of-flight range and IMU support for GPS-denied hover and altitude."],
  ["SURVEY VISION","Sony IMX500 AI Camera","12 MP HD mission capture, landing observations and on-sensor neural processing."],
  ["AI ACCELERATION","Hailo AI HAT+ 2 · 40 TOPS","Accelerated visual inference and post-flight analysis."],
];

const stationStack = [
  ["LANDING BED","22 × 22 in","Defined landing envelope with a low-friction centering surface."],
  ["ACTIVE CENTERING","4 × NEMA17 + T8 lead screws","Four-axis correction of residual X/Y landing offset."],
  ["TRAVEL SAFETY","8 × Omron limit switches","Repeatable homing and end-stop protection."],
  ["DOCK INTERFACE","Spring-loaded pogo matrix","Physically separated charging and Ethernet contact groups."],
  ["REAL-TIME CONTROL","Teensy 4.1","Stepper pulses, switches, interlocks and deterministic relay sequencing."],
  ["GROUND COMPUTE","Raspberry Pi 5 + 7 in display","Data transfer, post-processing, supervision and local operational UI."],
];

const mission = ["HEALTH CHECK","TAKEOFF","COVERAGE SURVEY","CAPTURE + LOG","RETURN","PRECISION LAND","CENTER + MATE","TRANSFER + CHARGE"];
const parameters = [
  ["Takeoff altitude","2.5 m","Controlled operating height"],
  ["Takeoff vertical speed","0.20 m/s","Conservative indoor climb"],
  ["Coverage speed","0.30 m/s","Imaging and safety trade-off"],
  ["Lane spacing","0.70 m","Coverage overlap"],
  ["Wall safety margin","1.50 m","Boundary clearance"],
  ["Collision stop distance","1.30 m","Immediate obstacle response"],
  ["Collision hold","5 s","Transient/noise handling"],
  ["Low-battery action","15% RTL","Reserve for return and landing"],
];

function ReportReveal({children,className=""}:{children:React.ReactNode;className?:string}) {
  return <motion.div className={className} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-8%"}} transition={{duration:.8,ease:[.16,1,.3,1]}}>{children}</motion.div>;
}

export function AscendTechnicalReport() {
  const {scrollYProgress}=useScroll();
  const progress=useSpring(scrollYProgress,{stiffness:110,damping:28,restDelta:.001});
  return <main className="report-page min-h-screen bg-ink text-white">
    <motion.div style={{scaleX:progress}} className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-cyan"/>
    <header className="case-nav fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 md:px-10"><Link href="/projects/autonomous-drone-mapping" className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.18em] text-white/65 transition hover:text-white"><FaArrowLeft/> Case study</Link><span className="font-mono text-[8px] tracking-[.2em] text-cyan">ASCEND / TECHNICAL REPORT</span></header>

    <section className="report-hero relative flex min-h-screen items-end overflow-hidden px-5 pb-14 pt-32 md:px-10 md:pb-20 lg:px-16">
      <img src="/reports/ascend/image24.png" alt="ASCEND drone flying above its automated base station" className="absolute inset-0 h-full w-full object-cover object-center"/>
      <div className="report-hero__grade absolute inset-0"/>
      <div className="relative z-10 mx-auto w-full max-w-7xl"><motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.35,duration:.7}} className="eyebrow">ISRO ROBOTICS CHALLENGE · URSC 2026</motion.p><motion.h1 initial={{opacity:0,y:45}} animate={{opacity:1,y:0}} transition={{delay:.45,duration:1,ease:[.16,1,.3,1]}} className="display mt-7 max-w-5xl text-6xl font-medium md:text-8xl lg:text-[8vw]">ASCEND<span className="text-cyan">.</span></motion.h1><motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9,duration:.8}} className="mt-6 max-w-2xl text-lg leading-8 text-white/68">Autonomous GPS-denied micro-UAV and automated base station—from indoor survey and target acquisition to docking, wired offload and guarded charging.</motion.p><div className="mt-10 flex flex-wrap gap-3"><span className="report-chip">TEAM IIC_SIT</span><span className="report-chip">TEAM 10144</span><span className="report-chip">FINAL FIELD CONFIGURATION</span></div></div>
    </section>

    <section className="border-b border-white/10 px-5 py-24 md:px-10 md:py-32 lg:px-16"><div className="mx-auto max-w-7xl"><ReportReveal><div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]"><div><p className="eyebrow">System brief</p><h2 className="display mt-7 text-5xl font-medium md:text-7xl">ONE COMPLETE<br/>MISSION LOOP<span className="text-cyan">.</span></h2></div><div className="self-end"><p className="text-xl leading-9 text-white/65">ASCEND treats autonomy as a complete lifecycle: initialize, fly, observe, return, dock, transfer evidence and safely prepare for the next mission.</p><p className="mt-7 border-l border-cyan/45 pl-5 text-sm leading-7 text-white/45">The official report lists Anant Prafulla Hejib as a Team IIC_SIT member. This page presents the documented team system; role-specific ownership should be supported in an interview or accompanying contribution record.</p></div></div></ReportReveal><div className="report-metrics mt-20 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">{[["GPS","DENIED"],["40","TOPS AI"],["12 MP","SURVEY CAMERA"],["03","DEMO ATTEMPTS"]].map(([value,label])=><div key={label} className="bg-[#050809] p-7"><strong className="display text-4xl font-medium text-white">{value}</strong><p className="mt-4 font-mono text-[8px] tracking-[.16em] text-white/35">{label}</p></div>)}</div></div></section>

    <section className="bg-[#050809] px-5 py-24 md:px-10 md:py-32 lg:px-16"><div className="mx-auto max-w-7xl"><ReportReveal><p className="eyebrow">Mission lifecycle</p><h2 className="mt-6 text-4xl font-medium md:text-6xl">From arming to evidence.</h2></ReportReveal><div className="mission-rail mt-16">{mission.map((step,index)=><motion.div key={step} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.05}} className="mission-step"><span>{String(index+1).padStart(2,"0")}</span><strong>{step}</strong>{index<mission.length-1&&<i><FaArrowRight/></i>}</motion.div>)}</div></div></section>

    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-16"><div className="mx-auto max-w-7xl"><ReportReveal><div className="mb-14 flex flex-col justify-between gap-6 border-b border-white/10 pb-7 md:flex-row md:items-end"><div><p className="eyebrow">Aerial architecture</p><h2 className="mt-5 text-4xl font-medium md:text-6xl">Layered flight authority.</h2></div><p className="max-w-md text-sm leading-7 text-white/42">PX4 retains low-level control while the companion computer produces bounded mission goals through explicit health and safety gates.</p></div></ReportReveal><div className="grid gap-5 lg:grid-cols-2"><div className="report-stack">{flightStack.map(([label,value,copy])=><article key={label}><span>{label}</span><h3>{value}</h3><p>{copy}</p></article>)}</div><figure className="report-figure self-start"><img src="/reports/ascend/image14.png" alt="ASCEND current sensor inputs and control architecture"/><figcaption>Current sensing, mission-supervisor and PX4 control hierarchy from the submitted report.</figcaption></figure></div></div></section>

    <section className="border-y border-white/10 bg-[#050809] px-5 py-24 md:px-10 md:py-32 lg:px-16"><div className="mx-auto max-w-7xl"><ReportReveal><div className="grid items-end gap-8 lg:grid-cols-2"><div><p className="eyebrow">Automated base station v6.1</p><h2 className="display mt-6 text-5xl font-medium md:text-7xl">LAND. CENTER.<br/>CONNECT<span className="text-cyan">.</span></h2></div><p className="max-w-lg text-lg leading-8 text-white/55">The ground system corrects landing offset, protects the connector interface, verifies contact, transfers mission files and only then enables charging.</p></div></ReportReveal><div className="mt-16 grid gap-5 lg:grid-cols-[1.05fr_.95fr]"><figure className="report-figure"><img src="/reports/ascend/image5.png" alt="ASCEND automated base station"/><figcaption>Four-axis lead-screw centering bed and protected docking enclosure.</figcaption></figure><div className="report-stack">{stationStack.map(([label,value,copy])=><article key={label}><span>{label}</span><h3>{value}</h3><p>{copy}</p></article>)}</div></div></div></section>

    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-16"><div className="mx-auto max-w-7xl"><ReportReveal><p className="eyebrow">Frozen mission parameters</p><h2 className="mt-6 text-4xl font-medium md:text-6xl">Conservative by design.</h2></ReportReveal><div className="report-table mt-14">{parameters.map(([parameter,value,purpose])=><div key={parameter}><span>{parameter}</span><strong>{value}</strong><p>{purpose}</p></div>)}</div></div></section>

    <section className="border-y border-white/10 bg-[#050809] px-5 py-24 md:px-10 md:py-32 lg:px-16"><div className="mx-auto max-w-7xl"><ReportReveal><p className="eyebrow">Post-flight intelligence</p><h2 className="display mt-6 text-5xl font-medium md:text-7xl">FROM HD FRAMES<br/>TO VERIFIED TARGETS<span className="text-cyan">.</span></h2><p className="mt-7 max-w-3xl text-lg leading-8 text-white/52">Original imagery is transferred through the dock, converted for analysis and matched using SIFT descriptors, KNN candidate matching and RANSAC geometric validation. Coordinates, proof frames and stitched outputs remain traceable to the mission archive.</p></ReportReveal><figure className="report-figure mt-14"><img src="/reports/ascend/image25.png" alt="ASCEND VSLAM mapping and target analysis dashboard"/><figcaption>Ground-station VSLAM mapping and target-analysis interface captured in the report.</figcaption></figure><div className="mt-5 grid gap-5 md:grid-cols-2"><figure className="report-figure"><img src="/reports/ascend/image19.png" alt="SIFT feature correspondence for red oxide target"/><figcaption>Feature correspondence and coordinate evidence for a locked target.</figcaption></figure><figure className="report-figure"><img src="/reports/ascend/image21.jpg" alt="SIFT feature correspondence for jagged rocks target"/><figcaption>Geometrically validated match for the jagged-rock target.</figcaption></figure></div></div></section>

    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-16"><div className="mx-auto max-w-7xl"><ReportReveal><div className="grid gap-12 lg:grid-cols-[.6fr_1.4fr]"><div><p className="eyebrow">Validation</p><h2 className="display mt-6 text-5xl font-medium md:text-7xl">THIRD ATTEMPT.<br/>FULL LOOP<span className="text-cyan">.</span></h2></div><div><p className="text-xl leading-9 text-white/65">Team records dated 04 July 2026 document successful autonomous takeoff, survey, coordinate determination, return/landing support, charging and data validation on the third demonstration attempt after hardware correction and software tuning.</p><div className="mt-10 grid gap-3 sm:grid-cols-2">{["PX4 offboard-loss failsafe","Sensor freshness and range gates","Hold / back-off / skip response","Default-OFF charging relay","Limit-switch travel protection","Contact verification before power"].map(item=><div key={item} className="border border-white/10 p-4 text-sm text-white/52"><span className="mr-3 text-cyan">●</span>{item}</div>)}</div></div></div></ReportReveal></div></section>

    <section className="border-t border-white/10 bg-[#050809] px-5 py-20 md:px-10 lg:px-16"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 lg:flex-row lg:items-end"><div><p className="eyebrow">Source documents</p><h2 className="mt-5 text-3xl font-medium md:text-5xl">Review the submitted engineering record.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/42">The downloads are the user-supplied DOCX reports used to prepare this web presentation. Values marked for final verification in the source remain report-controlled.</p></div><div className="flex flex-col gap-3 sm:flex-row"><a download href="/reports/ascend/ASCEND-Final-Project-Report.docx" className="report-download"><FaDownload/> Full project report</a><a download href="/reports/ascend/ASCEND-Final-Specifications.docx" className="report-download"><FaDownload/> Final specifications</a></div></div></section>
  </main>;
}
