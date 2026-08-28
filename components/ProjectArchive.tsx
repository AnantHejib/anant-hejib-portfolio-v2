"use client";

import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from "react-icons/fa6";
import { projectArchive, type ArchiveProject } from "@/lib/projectArchive";

type RailProject=ArchiveProject&{category:string;number:number};

const projects:RailProject[]=Object.entries(projectArchive).flatMap(([category,items])=>
  items.map((project,index)=>({ ...project,category,number:Object.values(projectArchive).slice(0,Object.keys(projectArchive).indexOf(category)).reduce((total,group)=>total+group.length,0)+index+1 }))
);

function ProjectCard({project,copy=false,active,onInspect}:{project:RailProject;copy?:boolean;active:boolean;onInspect:(card:HTMLElement,projectNumber:number)=>void}) {
  return <article className={`archive-rail-card ${copy?"":"archive-card-primary"} ${active?"is-inspected":""}`} data-copy={copy||undefined} data-project={project.number} aria-hidden={copy||undefined} tabIndex={copy?-1:0} onMouseEnter={(event)=>onInspect(event.currentTarget,project.number)} onFocus={(event)=>onInspect(event.currentTarget,project.number)}>
    <div className="archive-rail-card__top"><span>MISSION_{String(project.number).padStart(2,"0")}</span><i>{project.category}</i></div>
    <h4>{project.title}<b>.</b></h4>
    <p className="archive-rail-card__overview">{project.overview}</p>
    <div className="archive-rail-card__insight"><span>OPERATIONAL BENEFIT</span><p>{project.benefit}</p></div>
    <div className="archive-rail-card__insight"><span>UNIQUE ENGINEERING</span><p>{project.uniqueness}</p></div>
    <div className="archive-rail-card__stack"><span>TECH STACK</span><div>{project.stack.map((skill)=><i key={skill}>{skill}</i>)}</div></div>
    <div className="archive-rail-card__outputs"><span>DELIVERABLES / VERIFIED OUTPUTS</span>{project.deliverables.map((item,index)=><p key={item}><b>0{index+1}</b>{item}</p>)}</div>
  </article>;
}

export default function ProjectArchive() {
  const [paused,setPaused]=useState(false);
  const [inspectedProject,setInspectedProject]=useState<number|null>(null);
  const railRef=useRef<HTMLDivElement>(null);
  const navigationLockRef=useRef(false);
  const navigationTimerRef=useRef<number|null>(null);

  const inspectCard=(card:HTMLElement,projectNumber:number)=>{
    const rail=railRef.current;
    if(!rail||navigationLockRef.current) return;
    setInspectedProject(projectNumber);
    navigationLockRef.current=true;
    if(navigationTimerRef.current!==null) window.clearTimeout(navigationTimerRef.current);
    navigationTimerRef.current=window.setTimeout(()=>{navigationLockRef.current=false;},900);
    const railBox=rail.getBoundingClientRect();
    const cardBox=card.getBoundingClientRect();
    const delta=(cardBox.left+cardBox.width/2)-(railBox.left+railBox.width/2);
    rail.querySelectorAll<HTMLElement>(".archive-rail-card").forEach((item)=>item.style.removeProperty("--inspect-x"));
    card.style.setProperty("--inspect-x",`${-delta}px`);
  };

  const navigate=(direction:-1|1)=>{
    const rail=railRef.current;
    if(!rail) return;
    setInspectedProject(null);
    navigationLockRef.current=true;
    if(navigationTimerRef.current!==null) window.clearTimeout(navigationTimerRef.current);
    navigationTimerRef.current=window.setTimeout(()=>{navigationLockRef.current=false;},700);
    const card=rail.querySelector<HTMLElement>(".archive-rail-card");
    const firstSet=rail.querySelector<HTMLElement>(".archive-rail-set");
    const step=(card?.offsetWidth||420)+18;
    const loopWidth=firstSet?.offsetWidth||0;
    if(direction<0&&rail.scrollLeft<step&&loopWidth) rail.scrollLeft+=loopWidth;
    if(direction>0&&loopWidth&&rail.scrollLeft>loopWidth*1.75) rail.scrollLeft-=loopWidth;
    rail.scrollBy({left:direction*step,behavior:"smooth"});
  };

  return <section className="archive-rail-section mt-28 border-t border-white/10 pt-16" aria-labelledby="archive-title">
    <div className="grid gap-8 px-0 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Engineering archive / all 21 major builds</p><h3 id="archive-title" className="display mt-6 text-5xl font-medium md:text-7xl">EVERY SYSTEM<br/><span className="text-stroke">HAS A MISSION.</span></h3></div><div className="self-end"><p className="max-w-xl text-base leading-8 text-white/52">Explore all 21 projects in one continuous engineering rail. Each box preserves the mission, business benefit, technical differentiator, stack and delivered modules without making the page unnecessarily long.</p><div className="mt-5 flex flex-wrap items-center gap-5"><p className="font-mono text-[8px] tracking-[.18em] text-cyan">21 PROJECTS // 63 DELIVERABLES // 03 DISCIPLINES</p><button type="button" onClick={()=>setPaused((value)=>!value)} aria-pressed={paused} className="archive-rail-toggle"><span>{paused?"RESUME":"PAUSE"} LINEAR RAIL</span>{paused?<FaPlay aria-hidden/>:<FaPause aria-hidden/>}</button></div></div></div>

    <div className="archive-rail-shell" onMouseLeave={()=>{setInspectedProject(null);navigationLockRef.current=false;railRef.current?.querySelectorAll<HTMLElement>(".archive-rail-card").forEach((item)=>item.style.removeProperty("--inspect-x"));}}>
      <div ref={railRef} className={`archive-rail-window ${paused?"is-paused":""} ${inspectedProject!==null?"has-inspected-card":""}`} aria-label="All 21 engineering projects in a horizontal sliding rail">
        <div className="archive-rail-track">
          <div className="archive-rail-set">{projects.map((project)=><ProjectCard key={`primary-${project.number}`} project={project} active={inspectedProject===project.number} onInspect={inspectCard}/>)}</div>
          <div className="archive-rail-set archive-rail-copy" aria-hidden="true">{projects.map((project)=><ProjectCard key={`copy-${project.number}`} project={project} copy active={inspectedProject===project.number} onInspect={inspectCard}/>)}</div>
        </div>
      </div>
      <div className="archive-rail-shade archive-rail-shade--left"/><div className="archive-rail-shade archive-rail-shade--right"/>
      <div className="archive-rail-controls" aria-label="Project rail navigation">
        <button suppressHydrationWarning type="button" onClick={()=>navigate(-1)} aria-label="Previous project"><FaChevronLeft aria-hidden/></button>
        <button suppressHydrationWarning type="button" onClick={()=>navigate(1)} aria-label="Next project"><FaChevronRight aria-hidden/></button>
      </div>
      <div className="archive-rail-status"><span>LINEAR MOTION // LEFT TO RIGHT</span><span>HOVER TO INSPECT · SWIPE ON MOBILE</span></div>
    </div>
    <article className="archive-venture-summary"><div><span>ACTIVE VENTURE // FINTECH</span><h3>CONVERSATIONAL FINANCE<b>.</b></h3></div><div><p>A secure financial-intelligence product combining receipt OCR, transaction categorization, anomaly detection and context-aware spending guidance.</p><div>{["REACT","POSTGRESQL","TESSERACT OCR","XGBOOST","RAG","WEBSOCKETS"].map((skill)=><i key={skill}>{skill}</i>)}</div></div></article>
  </section>;
}
