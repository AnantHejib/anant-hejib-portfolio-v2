"use client";

import { Background3D } from "./Background3D";
import { projects } from "@/lib/projects";
import { FaGithub, FaLinkedinIn, FaEnvelope, FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";

export function Portfolio() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden text-white selection:bg-cyan-400/30 font-sans flex items-center justify-center p-4 md:p-8">
      <Background3D />
      
      {/* 
        Bento-box grid layout to minimize scrolling.
        It uses a max-w and grid to pack everything tightly on screen. 
      */}
      <div className="relative z-10 w-full max-w-7xl h-full max-h-[90vh] grid grid-cols-1 md:grid-cols-12 grid-rows-1 md:grid-rows-6 gap-4 md:gap-6">
        
        {/* Navigation & Header - Top Left */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="md:col-span-12 md:row-span-1 flex items-center justify-between p-6 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md"
        >
          <div className="text-xl md:text-2xl font-black tracking-widest uppercase">
            Anant <span className="text-cyan-400">Hejib.</span>
          </div>
          <div className="flex gap-4 md:gap-8 text-xs font-semibold tracking-[0.2em] uppercase text-white/70">
            <a href="https://github.com/AnantHejib" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><FaGithub size={16} /> <span className="hidden md:inline">GitHub</span></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><FaLinkedinIn size={16} /> <span className="hidden md:inline">LinkedIn</span></a>
          </div>
        </motion.nav>

        {/* Hero / About - Main Left */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="md:col-span-7 md:row-span-5 p-8 md:p-12 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md flex flex-col justify-center"
        >
          <div className="text-cyan-400 text-xs font-mono tracking-widest mb-6 uppercase">Professional Engineering Profile</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
            Building intelligent, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">autonomous systems.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-lg mb-10 leading-relaxed">
            AI, Computer Vision, and Robotics Engineer bridging the gap between advanced perception models and real-world software integration.
          </p>
          <div className="flex flex-wrap gap-4 mt-auto">
            <a href="mailto:contact@example.com" className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-400 text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <FaEnvelope /> Get In Touch
            </a>
            <a href="https://github.com/AnantHejib" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 text-white border border-white/20 font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white/10 transition-all">
               View GitHub
            </a>
          </div>
        </motion.section>

        {/* Projects / Experience - Right Side */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-5 md:row-span-5 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-white/10 bg-black/20">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">Selected Work</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="flex flex-col gap-2">
              {projects.slice(0, 4).map((project, index) => (
                <a 
                  key={index}
                  href={project.proof || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col p-5 rounded-2xl hover:bg-white/5 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                    <FaArrowRight className="text-white/20 group-hover:text-cyan-400 transition-colors -rotate-45" />
                  </div>
                  <p className="text-white/50 text-sm mb-3 line-clamp-2">{project.headline}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags?.slice(0, 3).map((tech: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] font-mono bg-black/60 text-cyan-100 rounded border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.section>

      </div>
    </main>
  );
}
