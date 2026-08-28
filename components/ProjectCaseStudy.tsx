"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";
import type { Project } from "@/lib/projects";

function SystemPreview({ project }: { project: Project }) {
  return <div className={`case-visual case-visual--${project.visual}`} aria-label={`${project.title} system visualization`}>
    <div className="case-visual__grid"/>
    <div className="case-visual__beam"/>
    <div className="case-visual__viewport">
      <div className="case-visual__meta"><span>LIVE SYSTEM GLIMPSE</span><span>BUILD_{project.id}</span></div>
      <div className="case-visual__stage" aria-hidden>
        {project.visual === "mapping" && <><div className="map-tile tile-a"/><div className="map-tile tile-b"/><div className="map-tile tile-c"/><div className="map-route"/><div className="map-drone">◆</div></>}
        {project.visual === "evasion" && <><div className="vision-feed"/><div className="vision-boundary"/><div className="vision-target"/><div className="vision-vector">AVOID</div></>}
        {project.visual === "protocol" && <><div className="protocol-node owner">OWNER</div><div className="protocol-link link-a"/><div className="protocol-node contract">SMART<br/>CONTRACT</div><div className="protocol-link link-b"/><div className="protocol-node beneficiary">BENEFICIARY</div></>}
        {project.visual === "vision" && <><div className="robot-frame"/><div className="robot-target"><span>OBJECT_01</span></div><div className="robot-crosshair"/><div className="robot-data">CONF 0.94<br/>TRACK LOCKED</div></>}
      </div>
      <div className="case-visual__telemetry"><span>PIPELINE / ACTIVE</span><span>LATENCY / NOMINAL</span><span>OUTPUT / VERIFIED</span></div>
    </div>
  </div>;
}

export function ProjectCaseStudy({ project, nextProject }: { project: Project; nextProject: Project }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: .001 });
  return <main className="case-page min-h-screen bg-ink text-white">
    <motion.div style={{scaleX:progress}} className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-cyan"/>
    <header className="case-nav fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 md:px-10">
      <Link href="/#work" className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.18em] text-white/65 transition hover:text-white"><FaArrowLeft/> All projects</Link>
      <span className="font-mono text-[8px] tracking-[.2em] text-cyan">ANANT HEJIB / CASE {project.id}</span>
    </header>

    <section className="relative grid min-h-screen items-end overflow-hidden px-5 pb-14 pt-32 md:px-10 md:pb-20 lg:px-16">
      <div className="case-aurora absolute inset-0"/>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-end gap-12 lg:grid-cols-[.82fr_1.18fr]">
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.9,ease:[.16,1,.3,1]}}>
          <div className="mb-7 flex items-center gap-3 font-mono text-[8px] tracking-[.2em] text-cyan"><span className="h-px w-10 bg-cyan"/>{project.type}</div>
          <h1 className="display text-6xl font-medium md:text-8xl lg:text-[7vw]">{project.title}<span className="text-cyan">.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/60">{project.headline}</p>
          <div className="mt-9 flex flex-wrap gap-2">{project.tags.map((tag)=><span key={tag} className="case-pill">{tag}</span>)}</div>
        </motion.div>
        <motion.div initial={{opacity:0,scale:.96,y:30}} animate={{opacity:1,scale:1,y:0}} transition={{duration:1.1,delay:.12,ease:[.16,1,.3,1]}}><SystemPreview project={project}/></motion.div>
      </div>
    </section>

    <section className="border-y border-white/10 bg-[#06090b] px-5 py-24 md:px-10 md:py-32 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.55fr_1fr]">
        <div><p className="eyebrow">The brief</p><h2 className="display mt-6 text-5xl font-medium md:text-7xl">CONTEXT<br/>BEFORE CODE<span className="text-cyan">.</span></h2></div>
        <div className="grid gap-12 sm:grid-cols-2"><div><p className="case-kicker">CHALLENGE</p><p className="mt-5 text-base leading-8 text-white/58">{project.challenge}</p></div><div><p className="case-kicker">ENGINEERING APPROACH</p><p className="mt-5 text-base leading-8 text-white/58">{project.approach}</p></div></div>
      </div>
    </section>

    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-6"><div><p className="eyebrow">System architecture</p><h2 className="mt-5 text-3xl font-medium md:text-5xl">From input to usable output.</h2></div><span className="hidden font-mono text-[8px] tracking-[.18em] text-white/30 md:block">PIPELINE / {project.status}</span></div>
        <div className="architecture-flow">{project.architecture.map((step,index)=><div key={step} className="architecture-node"><span>0{index+1}</span><strong>{step}</strong>{index < project.architecture.length-1 && <i><FaArrowRight/></i>}</div>)}</div>
        <div className="mt-20 grid gap-5 md:grid-cols-3">{project.outputs.map((output,index)=><motion.article key={output} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-10%"}} transition={{delay:index*.08,duration:.7}} className="case-output"><span>0{index+1}</span><p>{output}</p></motion.article>)}</div>
        <div className="mt-20 grid gap-8 border border-cyan/20 bg-cyan/[.035] p-7 md:grid-cols-[.3fr_1fr] md:p-10"><p className="case-kicker">OUTCOME</p><p className="text-xl leading-9 text-white/72">{project.impact}</p></div>
      </div>
    </section>

    <footer className="border-t border-white/10 px-5 py-20 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
        <div><p className="case-kicker">NEXT CASE STUDY</p><Link href={`/projects/${nextProject.slug}`} className="group mt-5 block text-4xl font-medium md:text-6xl">{nextProject.title}<FaArrowRight className="ml-4 inline text-2xl text-cyan transition group-hover:translate-x-2"/></Link></div>
        {project.reportPath ? <Link href={project.reportPath} className="inline-flex items-center gap-3 self-start bg-cyan px-5 py-4 font-mono text-[9px] font-bold uppercase tracking-[.15em] text-black transition hover:bg-white">{project.proofLabel}<FaArrowRight/></Link> : <a href={project.proof} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 self-start border border-white/15 px-5 py-4 font-mono text-[9px] uppercase tracking-[.15em] text-white/55 transition hover:border-cyan hover:text-cyan">{project.proofLabel}<HiOutlineExternalLink/></a>}
      </div>
    </footer>
  </main>;
}
