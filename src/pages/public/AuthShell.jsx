import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components/Logo.jsx";

// Shared centered-card shell for Login / Signup / Forgot password.
export function AuthShell({ title, sub, children, footer }) {
  return (
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col">
      <div className="px-5 sm:px-8 h-20 flex items-center"><Link to="/"><Logo /></Link></div>
      <div className="flex-1 flex items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md">
          <h1 className="font-display text-2xl font-semibold text-[#0A1B2E]">{title}</h1>
          {sub && <p className="text-sm text-slate-500 mt-2">{sub}</p>}
          <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">{children}</div>
          {footer && <div className="text-center text-sm text-slate-500 mt-6">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
