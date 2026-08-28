"use client";

import { Background3D } from "./Background3D";
import { projects } from "@/lib/projects";
import { FaGithub, FaLinkedinIn, FaEnvelope, FaArrowRight } from "react-icons/fa6";
import { SiPython, SiCplusplus, SiRos, SiOpencv, SiNvidia, SiReact, SiNextdotjs, SiPostgresql, SiTailwindcss, SiTypescript } from "react-icons/si";
import { motion } from "framer-motion";
import Image from "next/image";
import ProjectArchive from "./ProjectArchive";
import LucyChat from "./LucyChat";
import ExperienceCanvas from "./ExperienceCanvas";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="text-xl font-bold tracking-widest uppercase text-white">AH<span className="text-cyan-400">.</span></div>
      <div className="hidden md:flex gap-8 text-xs font-semibold tracking-[0.2em] uppercase text-white/70">
        <a href="#about" className="hover:text-cyan-400 transition-colors">Profile</a>
        <a href="#experience" className="hover:text-cyan-400 transition-colors">Experience</a>
        <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
        <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
      </div>
      <div className="flex gap-4">
        <a href="https://github.com/AnantHejib" target="_blank" rel="noreferrer" className="text-white hover:text-cyan-400 transition-colors"><FaGithub size={20} /></a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white hover:text-cyan-400 transition-colors"><FaLinkedinIn size={20} /></a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="about" className="min-h-screen flex flex-col items-center justify-center pt-24 px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl bg-black/20 p-8 md:p-12 rounded-3xl backdrop-blur-sm border border-white/5 flex flex-col items-center"
      >
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
          <Image 
            src="/images/anant-reference.jpg" 
            alt="Anant Hejib" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="text-cyan-400 text-xs font-mono tracking-widest mb-6 uppercase">Engineering Profile</div>
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6 drop-shadow-2xl">
          Anant <span className="text-cyan-400">Hejib</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light mb-10">
          AI, Computer Vision, and Robotics Engineer building intelligent, autonomous systems. 
          Currently exploring opportunities to engineer systems where software, perception and real-world engineering converge.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="#projects" className="px-8 py-4 bg-cyan-400 text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            Explore Work
          </a>
          <a href="#contact" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white/10 transition-all">
            Contact Me
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function TechStackMarquee() {
  const techStack = [
    { name: "Python", icon: SiPython },
    { name: "C++", icon: SiCplusplus },
    { name: "ROS 2", icon: SiRos },
    { name: "OpenCV", icon: SiOpencv },
    { name: "CUDA", icon: SiNvidia },
    { name: "TypeScript", icon: SiTypescript },
    { name: "React", icon: SiReact },
    { name: "Next.js", icon: SiNextdotjs },
    { name: "TailwindCSS", icon: SiTailwindcss },
    { name: "PostgreSQL", icon: SiPostgresql },
  ];

  // Duplicate the array to create a seamless infinite loop
  const infiniteStack = [...techStack, ...techStack];

  return (
    <div className="relative w-full py-10 overflow-hidden bg-black/40 border-y border-white/10 backdrop-blur-sm z-10 flex items-center">
      <div className="absolute left-0 w-24 h-full bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
      <div className="absolute right-0 w-24 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>
      
      <motion.div
        className="flex whitespace-nowrap items-center gap-12 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {infiniteStack.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <div key={index} className="flex items-center gap-3 text-white/50 hover:text-cyan-400 transition-colors">
              <Icon size={24} />
              <span className="text-xl font-bold uppercase tracking-widest">{tech.name}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="relative min-h-[80vh] flex items-center py-20 px-6 z-10 bg-black/60 border-y border-white/10 overflow-hidden">
      {/* 
        We overlay the ExperienceCanvas inside this section. 
        It gives the classic "Experience" visual background without breaking the page.
      */}
      <div className="absolute inset-0 opacity-50 mix-blend-screen pointer-events-none">
        <ExperienceCanvas />
      </div>
      
      <div className="max-w-5xl mx-auto relative z-20">
        <div className="text-cyan-400 text-xs font-mono tracking-widest mb-4 uppercase">Career Timeline</div>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-16">
          My <span className="text-cyan-400">Experience</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-2">Robot Vision Systems Engineer</h3>
            <p className="text-cyan-400 text-sm font-mono tracking-widest mb-4">BlackHole Infiverse (8+ Months)</p>
            <p className="text-white/60 leading-relaxed mb-6">
              Developed computer-vision software for robotic workflows, converting perception requirements into usable processing modules and integration-ready tools. Hands-on product engineering across the boundary between software and physical systems.
            </p>
            <div className="flex flex-wrap gap-2">
              {["PYTHON", "YOLO", "OPENCV", "ROBOTICS"].map((tech) => (
                <span key={tech} className="px-3 py-1 text-xs font-mono bg-white/5 text-cyan-200 border border-white/10 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-8 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-2">Deep Tech Ventures</h3>
            <p className="text-cyan-400 text-sm font-mono tracking-widest mb-4">Active Projects</p>
            <p className="text-white/60 leading-relaxed mb-6">
              Engineering beyond the screen. Currently working with a deep-tech company on systems where software, perception and real-world engineering converge. 
              Active participant in national hackathons (10+) and Space Robotics (IRoC-U).
            </p>
            <div className="flex flex-wrap gap-2">
              {["C++", "ROS 2", "CUDA", "TENSORRT"].map((tech) => (
                <span key={tech} className="px-3 py-1 text-xs font-mono bg-white/5 text-cyan-200 border border-white/10 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadershipSection() {
  const roles = [
    { title: "Techroots", role: "Co-founder" },
    { title: "Student Innovation Council", role: "Founder & Chairperson" },
    { title: "Institutions Innovation Council", role: "Board Member" },
    { title: "Sinhgad Capture Crew", role: "Videographer" },
    { title: "ACES", role: "Photography Team Lead" },
  ];

  return (
    <section id="leadership" className="relative py-20 px-6 z-10 bg-black/40 border-b border-white/10 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto">
        <div className="text-cyan-400 text-xs font-mono tracking-widest mb-4 uppercase text-center md:text-left">Beyond Engineering</div>
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mb-12 text-center md:text-left">
          Leadership <span className="text-cyan-400">&</span> Clubs
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((item, index) => (
            <div key={index} className="p-6 bg-black/40 border border-white/10 rounded-2xl hover:border-cyan-400/50 transition-colors group">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
              <p className="text-white/60 font-mono text-sm tracking-wide">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-32 px-6 relative z-10 bg-black/40 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-cyan-400 text-xs font-mono tracking-widest mb-4 uppercase">Initiate Connection</div>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-8">
          Contact <span className="text-cyan-400">Us</span>
        </h2>
        <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
          Currently exploring new opportunities in AI, computer vision, and full-stack engineering. 
          Whether you have a question, want to discuss a venture, or just want to say hi, my inbox is open.
        </p>
        <a href="mailto:contact@example.com" className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-400 text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <FaEnvelope size={16} /> Send a Message
        </a>
      </div>
    </section>
  );
}

export function Portfolio() {
  return (
    <main className="relative min-h-screen w-full text-white selection:bg-cyan-400/30 font-sans">
      {/* The 3D background stays as requested */}
      <Background3D />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Vertical Sections Restored */}
      <Hero />
      <TechStackMarquee />
      <ExperienceSection />
      <LeadershipSection />
      
      {/* 21 Projects Archive Component */}
      <div id="projects" className="relative z-10 bg-black/20 pb-20">
        <ProjectArchive />
      </div>

      <Contact />
      
      {/* AI Assistant Lucy Restored */}
      <LucyChat />
    </main>
  );
}
