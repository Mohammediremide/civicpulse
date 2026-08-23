import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-5 py-28 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto"><Compass className="text-slate-400" size={22} /></div>
      <h1 className="font-display text-2xl font-semibold text-[#0A1B2E] mt-5">Page not found</h1>
      <p className="text-sm text-slate-500 mt-2">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="inline-block mt-6 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#1F4FD8]">Back to home</Link>
    </div>
  );
}
