"use client";

import { Background3D } from "./Background3D";
import { projects } from "@/lib/projects";
import { FaGithub, FaLinkedinIn, FaEnvelope, FaArrowRight } from "react-icons/fa6";
import { SiPython, SiCplusplus, SiRos, SiOpencv, SiNvidia, SiReact, SiNextdotjs, SiPostgresql, SiTailwindcss, SiTypescript } from "react-icons/si";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ProjectArchive from "./ProjectArchive";
import LucyChat from "./LucyChat";
import ExperienceCanvas from "./ExperienceCanvas";
import { useRef, useState } from "react";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-2xl transition-all">
      <div className="text-2xl font-black tracking-widest uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        AH<span className="text-cyan-400">.</span>
      </div>
      <div className="hidden md:flex gap-10 text-xs font-bold tracking-[0.25em] uppercase text-white/60">
        <a href="#about" className="hover:text-cyan-400 transition-colors">Profile</a>
        <a href="#experience" className="hover:text-cyan-400 transition-colors">Experience</a>
        <a href="#leadership" className="hover:text-cyan-400 transition-colors">Leadership</a>
        <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
      </div>
      <div className="flex gap-6">
        <a href="https://github.com/AnantHejib" target="_blank" rel="noreferrer" className="text-white/60 hover:text-cyan-400 transition-colors"><FaGithub size={22} /></a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white/60 hover:text-cyan-400 transition-colors"><FaLinkedinIn size={22} /></a>
      </div>
    </nav>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="about" className="min-h-screen flex flex-col items-center justify-center pt-32 px-6 relative z-10 text-center">
      <motion.div 
        style={{ opacity, y: yText }}
        className="max-w-5xl flex flex-col items-center"
      >
        <motion.div 
          style={{ y: yImage }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-40 h-40 md:w-56 md:h-56 mb-10 rounded-full overflow-hidden border border-cyan-400/50 shadow-[0_0_60px_rgba(34,211,238,0.2)] ring-4 ring-black/50"
        >
          <Image 
            src="/images/anant-profile.jpg" 
            alt="Anant Hejib" 
            fill 
            className="object-cover"
            priority
          />
          {/* Inner glass overlay for premium feel */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] mix-blend-overlay pointer-events-none" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-400 text-[10px] font-mono tracking-[0.3em] mb-8 uppercase backdrop-blur-md">
            Engineering Profile
          </div>
          <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter text-white mb-6 uppercase leading-none drop-shadow-2xl">
            ANANT HEJIB
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light mb-12 drop-shadow-lg">
            AI, Computer Vision, and Robotics Engineer building intelligent, autonomous systems. 
            Currently exploring opportunities where software, perception and real-world engineering converge.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#projects" className="px-10 py-5 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              Explore Work
            </a>
            <a href="#contact" className="px-10 py-5 bg-black/40 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-xs rounded-full backdrop-blur-xl hover:bg-white/10 hover:border-white/40 transition-all duration-300">
              Contact Me
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="relative py-32 px-6 z-10 border-t border-white/5 bg-gradient-to-b from-black/0 to-black/60">
      <div className="max-w-6xl mx-auto relative z-20">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center md:text-left mb-16"
        >
          <div className="text-cyan-400 text-xs font-mono tracking-widest mb-4 uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Career Timeline</div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-xl">
            Professional <span className="text-cyan-400">Experience</span>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="p-10 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-3xl backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-cyan-400/30 transition-colors group"
          >
            <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">Robot Vision Systems Engineer</h3>
            <p className="inline-block px-3 py-1 rounded bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono tracking-widest mb-6">BlackHole Infiverse (8+ Months)</p>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Developed computer-vision software for robotic workflows, converting perception requirements into usable processing modules and integration-ready tools. Hands-on product engineering across the boundary between software and physical systems.
            </p>
            <div className="flex flex-wrap gap-3">
              {["PYTHON", "YOLO", "OPENCV", "ROBOTICS"].map((tech) => (
                <span key={tech} className="px-4 py-1.5 text-xs font-bold font-mono bg-black/50 text-white/80 border border-white/10 rounded-full shadow-inner">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="p-10 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-3xl backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-cyan-400/30 transition-colors group"
          >
            <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">Deep Tech Ventures</h3>
            <p className="inline-block px-3 py-1 rounded bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono tracking-widest mb-6">Active Projects</p>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Engineering beyond the screen. Currently working with a deep-tech company on systems where software, perception and real-world engineering converge. 
              Active participant in national hackathons (10+) and Space Robotics (IRoC-U).
            </p>
            <div className="flex flex-wrap gap-3">
              {["C++", "ROS 2", "CUDA", "TENSORRT"].map((tech) => (
                <span key={tech} className="px-4 py-1.5 text-xs font-bold font-mono bg-black/50 text-white/80 border border-white/10 rounded-full shadow-inner">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 
          Premium isolation of the 3D Canvas. 
          By placing it in a bounded container, we prevent full-page glitches. 
        */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
        >
          {/* Inner shadow overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] z-10 pointer-events-none"></div>
          <ExperienceCanvas />
          <div className="absolute bottom-6 left-8 z-20 pointer-events-none">
            <p className="text-cyan-400 text-[10px] font-mono tracking-[0.3em] uppercase opacity-70">Interactive System Visualization</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function LeadershipSection() {
  const companies = [
    { title: "Techroots", role: "Co-founder", description: "Co-founded a technology company focused on delivering innovative software solutions and driving technical strategy from the ground up." },
  ];

  const clubs = [
    { title: "Student Innovation Council", role: "Founder & Chairperson", description: "Established the council to foster a culture of innovation and guide student-led technical projects." },
    { title: "Institutions Innovation Council", role: "Board Member", description: "Served on the board to strategize and oversee campus-wide technical and entrepreneurial initiatives." },
    { title: "Sinhgad Capture Crew", role: "Videographer", description: "Directed and captured high-quality video content for major institutional events and technical fests." },
    { title: "ACES", role: "Photography Team Lead", description: "Led a team of photographers to visually document technical symposiums and student activities." },
  ];

  return (
    <section id="leadership" className="relative py-32 px-6 z-10 bg-gradient-to-b from-black/60 to-black/40 border-y border-white/5 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        
        {/* Companies Section */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="text-cyan-400 text-xs font-mono tracking-widest mb-4 uppercase text-center md:text-left drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Entrepreneurship</div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white text-center md:text-left drop-shadow-xl">
              My <span className="text-cyan-400">Company</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-8">
            {companies.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 md:p-12 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 rounded-[2rem] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-500 group"
              >
                <h3 className="text-4xl font-black text-white mb-3 group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                <p className="inline-block px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-mono tracking-widest mb-6">{item.role}</p>
                <p className="text-white/70 text-lg leading-relaxed max-w-3xl">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Clubs Section */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="text-cyan-400 text-xs font-mono tracking-widest mb-4 uppercase text-center md:text-left drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Beyond Engineering</div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white text-center md:text-left drop-shadow-xl">
              Clubs <span className="text-cyan-400">&</span> Extracurriculars
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clubs.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-3xl backdrop-blur-xl hover:bg-white/[0.05] hover:border-cyan-400/30 transition-all duration-500 group"
              >
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                <p className="text-cyan-400 font-mono text-xs tracking-[0.15em] mb-4 uppercase">{item.role}</p>
                <p className="text-white/50 text-base leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
      </div>
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

  // Quadruple the array for a completely seamless ultra-wide screen loop
  const infiniteStack = [...techStack, ...techStack, ...techStack, ...techStack];

  return (
    <div className="relative w-full py-16 overflow-hidden bg-black/60 border-y border-white/10 backdrop-blur-2xl z-10 flex items-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      {/* CSS Mask for a premium glowing fade on the edges */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #000 0%, transparent 15%, transparent 85%, #000 100%)' }}
      />
      
      <motion.div
        className="flex whitespace-nowrap items-center gap-16 w-max opacity-80 hover:opacity-100 transition-opacity duration-500"
        animate={{ x: ["0%", "-25%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
      >
        {infiniteStack.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <div key={index} className="flex items-center gap-4 text-white/40 hover:text-cyan-400 transition-colors duration-300">
              <Icon size={40} className="drop-shadow-lg" />
              <span className="text-2xl font-black uppercase tracking-[0.2em]">{tech.name}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    inquiryType: "general",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [reference, setReference] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
        setReference(data.reference || "");
        setFormData({ name: "", email: "", organization: "", inquiryType: "general", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to deliver message. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network error occurred. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-32 px-6 relative z-10 bg-[#05080d]/90 backdrop-blur-2xl border-t border-[#183642]">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded border border-[#183642] bg-[#091118] text-[#4fd1e5] text-[11px] font-mono tracking-[0.25em] mb-4 uppercase">
            SECURE CHANNEL // CONTACT
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            INITIATE <span className="text-[#4fd1e5]">TRANSMISSION.</span>
          </h2>
          <p className="text-[#8fa6af] text-sm md:text-base max-w-xl mx-auto font-sans">
            Direct routing to Anant Hejib via secure SMTP. Automated acknowledgement and response tracking powered by Lucy AI.
          </p>
        </div>

        {status === "success" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 md:p-12 bg-[#071016] border border-[#183642] rounded-2xl text-center"
          >
            <div className="w-16 h-16 bg-[#4fd1e5]/10 border border-[#4fd1e5]/30 rounded-full flex items-center justify-center mx-auto mb-6 text-[#4fd1e5]">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Transmission Delivered</h3>
            <p className="text-[#8fa6af] mb-6">Your message was securely dispatched to Anant and Lucy AI.</p>
            {reference && (
              <div className="inline-block px-4 py-2 bg-[#091118] border border-[#183642] font-mono text-xs text-[#4fd1e5] tracking-widest rounded mb-8">
                REFERENCE ID: {reference}
              </div>
            )}
            <div>
              <button 
                onClick={() => setStatus("idle")} 
                className="px-8 py-3 bg-[#4fd1e5] text-[#05080d] font-bold text-xs uppercase tracking-widest rounded hover:bg-white transition-colors"
              >
                Send Another Transmission
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-12 bg-[#071016]/80 border border-[#183642] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            {status === "error" && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[#6f8992] text-[10px] font-mono tracking-widest uppercase mb-2">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ada Lovelace"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#091118] border border-[#183642] rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4fd1e5] transition-colors placeholder-[#6f8992]/40"
                />
              </div>

              <div>
                <label className="block text-[#6f8992] text-[10px] font-mono tracking-widest uppercase mb-2">Email Address *</label>
                <input 
                  type="email" 
                  required
                  placeholder="ada@lovelace.io"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#091118] border border-[#183642] rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4fd1e5] transition-colors placeholder-[#6f8992]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[#6f8992] text-[10px] font-mono tracking-widest uppercase mb-2">Organization / Company</label>
                <input 
                  type="text" 
                  placeholder="Deep Tech Labs"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full bg-[#091118] border border-[#183642] rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4fd1e5] transition-colors placeholder-[#6f8992]/40"
                />
              </div>

              <div>
                <label className="block text-[#6f8992] text-[10px] font-mono tracking-widest uppercase mb-2">Inquiry Classification</label>
                <select 
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full bg-[#091118] border border-[#183642] rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4fd1e5] transition-colors"
                >
                  <option value="general">General Inquiry</option>
                  <option value="opportunity">Job or Interview Opportunity</option>
                  <option value="collaboration">Project Collaboration</option>
                  <option value="technical">Technical Discussion</option>
                  <option value="speaking">Speaking / Media / Event</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[#6f8992] text-[10px] font-mono tracking-widest uppercase mb-2">Message *</label>
              <textarea 
                rows={5}
                required
                placeholder="Briefly describe your objectives, requirements or inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#091118] border border-[#183642] rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4fd1e5] transition-colors placeholder-[#6f8992]/40 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status === "loading"}
              className="w-full py-4 bg-[#4fd1e5] text-[#05080d] font-bold text-xs uppercase tracking-[0.25em] rounded hover:bg-white transition-all shadow-[0_0_20px_rgba(79,209,229,0.3)] disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
            >
              {status === "loading" ? "Dispatched Transmission..." : "Deliver Secure Transmission"}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}

export function Portfolio() {
  const [entered, setEntered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleEnter = () => {
    setEntered(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch((err) => console.log("Audio playback failed:", err));
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-transparent text-white selection:bg-cyan-400/30 font-sans overflow-x-hidden">
      {/* Startup Overlay for Audio Policy */}
      <AnimatePresence>
        {!entered && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <div className="text-cyan-400 text-xs font-mono tracking-[0.5em] mb-8 uppercase animate-pulse">System Ready</div>
            <button 
              onClick={handleEnter}
              className="group relative px-12 py-5 bg-transparent border-2 border-cyan-500/30 text-white font-black uppercase tracking-[0.3em] text-sm overflow-hidden transition-all hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]"
            >
              <div className="absolute inset-0 bg-cyan-500 w-0 group-hover:w-full transition-all duration-500 ease-out z-0"></div>
              <span className="relative z-10 group-hover:text-black transition-colors duration-500">Initialize Experience</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/audio/back-in-black.mp3" loop />

      {/* The 3D background stays as requested, rendered once */}
      <Background3D />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Premium Vertical Sections */}
      <Hero />
      <ExperienceSection />
      <LeadershipSection />
      
      {/* 21 Projects Archive Component */}
      <div id="projects" className="relative z-10 bg-black/60 pb-32 border-y border-white/5 backdrop-blur-md">
        <ProjectArchive />
      </div>

      {/* Upgraded Tech Stack Ribbon */}
      <TechStackMarquee />

      <Contact />
      
      {/* AI Assistant Lucy Restored */}
      <LucyChat />
    </main>
  );
}
