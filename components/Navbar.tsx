"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to make the navbar background solid when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#050505]/80 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 lg:px-16 flex justify-between items-center">
        <a href="#home" className="text-xl font-black text-white tracking-widest hover:text-[#4da6ff] transition">
          S. SHAKIR
        </a>
        
        <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#project" className="hover:text-white transition">Work</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </div>

        <a href="#contact" className="md:hidden text-white border border-white/20 px-4 py-2 rounded-full text-xs">
          CONTACT
        </a>
      </div>
    </nav>
  );
}