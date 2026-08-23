import React from "react";

export function StatCard({ label, value, sub, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="font-display text-3xl font-semibold" style={{ color: accent || "#0A1B2E" }}>{value}</span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  );
}
