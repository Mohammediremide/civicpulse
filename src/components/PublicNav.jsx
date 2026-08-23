import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo.jsx";
import { useScrolled } from "../hooks/useScrolled.js";

const LINKS = [
  ["Home", "/"], ["How It Works", "/#how"], ["Community", "/community"],
  ["Complaints", "/complaints"], ["About", "/about"], ["Contact", "/contact"],
];

export function PublicNav() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-40 transition-all ${scrolled ? "backdrop-blur-md bg-white/85 border-b border-slate-200 shadow-sm" : "bg-white/0"}`}>
      <div className={`max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between transition-all ${scrolled ? "h-16" : "h-20"}`}>
        <Link to="/"><Logo /></Link>
        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map(([label, href]) => (
            <Link key={label} to={href} className="text-sm font-medium text-slate-600 hover:text-[#0A1B2E] transition-colors">
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={() => navigate("/login")} className="text-sm font-semibold text-slate-700 hover:text-[#0A1B2E] px-4 py-2">Log in</button>
          <button onClick={() => navigate("/report")} className="text-sm font-semibold text-white bg-[#1F4FD8] hover:bg-[#1a41b8] px-5 py-2.5 rounded-full transition-colors shadow-sm shadow-blue-900/10">
            Report an Issue
          </button>
        </div>
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-5 py-4 flex flex-col gap-1">
          {LINKS.map(([label, href]) => (
            <Link key={label} to={href} onClick={() => setOpen(false)} className="text-left py-2.5 text-sm font-medium text-slate-700">{label}</Link>
          ))}
          <div className="flex gap-2 pt-3">
            <button onClick={() => { navigate("/login"); setOpen(false); }} className="flex-1 text-sm font-semibold border border-slate-300 rounded-full py-2.5">Log in</button>
            <button onClick={() => { navigate("/report"); setOpen(false); }} className="flex-1 text-sm font-semibold text-white bg-[#1F4FD8] rounded-full py-2.5">Report</button>
          </div>
        </div>
      )}
    </header>
  );
}
