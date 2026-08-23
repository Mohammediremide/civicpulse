import React from "react";
import { Radio } from "lucide-react";
import { AREAS } from "../data/areas.js";
import { STATUS_STYLES } from "../utils/constants.js";
import { REAL_MAP_ENABLED } from "../features/map/mapConfig.js";

// The signature visual: an abstracted, pulsing dot-map of Lagos used in
// the hero, community map, and admin operations map.
//
// This is deliberately a stylized SVG/CSS map, not a tile-based map —
// see src/features/map/mapConfig.js and src/services/geocodeService.js
// for where a real Geoapify map would be wired in. REAL_MAP_ENABLED is
// exported for that future integration; the demo visualization below
// is intentionally always used until that's connected.
export function PulseMap({ reports, height = 420, onSelect, selectedId, showHotspots = true }) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800" style={{ height, background: "radial-gradient(circle at 30% 20%, #12294A 0%, #0A1B2E 55%, #071426 100%)" }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 opacity-[0.35]">
        <defs>
          <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#2C4A73" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>

      {showHotspots && AREAS.map((a) => (
        <div key={a.name} className="absolute" style={{ left: `${a.x}%`, top: `${a.y}%`, transform: "translate(-50%,-50%)" }}>
          <div className="rounded-full" style={{
            width: 14 + a.count / 12, height: 14 + a.count / 12,
            background: "radial-gradient(circle, rgba(14,156,140,0.28) 0%, rgba(14,156,140,0.05) 70%, transparent 100%)",
          }} />
        </div>
      ))}

      {reports.map((r) => {
        const s = STATUS_STYLES[r.status] || STATUS_STYLES.Submitted;
        const active = selectedId === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onSelect && onSelect(r)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${r.x + (r.id.charCodeAt(r.id.length - 1) % 5) * 0.6}%`, top: `${r.y + (r.id.charCodeAt(r.id.length - 2) % 5) * 0.5}%` }}
            aria-label={`${r.title}, ${r.status}`}
          >
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: s.dot, opacity: 0.5 }} />
            <span
              className="relative block rounded-full border-2 border-white/80 transition-transform group-hover:scale-125"
              style={{ width: active ? 14 : 10, height: active ? 14 : 10, background: s.dot, boxShadow: `0 0 12px ${s.dot}` }}
            />
          </button>
        );
      })}

      {showHotspots && AREAS.slice(0, 3).map((a) => (
        <div key={`label-${a.name}`} className="absolute text-[10px] font-mono font-semibold text-teal-200/70 tracking-wide"
          style={{ left: `${a.x}%`, top: `${a.y}%`, transform: "translate(10px,-24px)" }}>
          {a.name} · {a.count}
        </div>
      ))}

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries({ Resolved: "#16A34A", "In Progress": "#EA580C", "Under Review": "#D97706", Submitted: "#1F4FD8" }).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 text-[10px] font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ background: v }} /> {k}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-teal-300">
          <Radio size={11} className="animate-pulse" /> {REAL_MAP_ENABLED ? "live pulse" : "live pulse · demo"}
        </span>
      </div>
    </div>
  );
}
