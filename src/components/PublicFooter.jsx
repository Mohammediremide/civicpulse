import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo.jsx";

const COLUMNS = [
  ["Platform", [["Report an issue", "/report"], ["Track a complaint", "/track"], ["Community map", "/community"]]],
  ["Company", [["About", "/about"], ["Contact", "/contact"]]],
  ["For organizations", [["Admin sign in", "/admin"]]],
];

export function PublicFooter() {
  return (
    <footer className="bg-[#0A1B2E] text-slate-300 pt-16 pb-8 px-5 sm:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Logo light />
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">A civic reporting and accountability platform for Nigerian communities.</p>
        </div>
        {COLUMNS.map(([title, items]) => (
          <div key={title}>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</span>
            <div className="flex flex-col gap-2.5 mt-4">
              {items.map(([label, href]) => (
                <Link key={label} to={href} className="text-sm text-slate-300 hover:text-white text-left w-fit">{label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-500">
        <span>© 2026 CivicPulse. Prototype build — demo data only.</span>
        <span>Not affiliated with any government agency. No real citizen data is stored.</span>
      </div>
    </footer>
  );
}
