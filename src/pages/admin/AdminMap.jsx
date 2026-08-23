import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map as MapIcon } from "lucide-react";
import { PulseMap } from "../../components/PulseMap.jsx";
import { StatusBadge, PriorityBadge, TypeBadge, DemoTag } from "../../components/ui/Badge.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { AREAS } from "../../data/areas.js";
import { useReports } from "../../features/complaints/ReportsContext.jsx";

export default function AdminMap() {
  const navigate = useNavigate();
  const { reports } = useReports();
  const [selected, setSelected] = useState(reports[0] || null);
  const [typeFilter, setTypeFilter] = useState("All");
  const filtered = typeFilter === "All" ? reports : reports.filter((r) => r.type === typeFilter);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold text-[#0A1B2E]">Operations map</h1>
        <DemoTag />
      </div>
      <div className="flex gap-2 flex-wrap mt-4">
        {["All", "Community", "Government", "Consumer"].map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`px-3.5 py-2 rounded-full text-xs font-semibold border ${typeFilter === t ? "bg-[#0A1B2E] text-white border-[#0A1B2E]" : "border-slate-200 text-slate-600 bg-white"}`}>{t}</button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1fr_340px] gap-6 mt-5">
        <PulseMap reports={filtered} height={560} onSelect={setSelected} selectedId={selected?.id} />
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Hotspots</span>
            <div className="flex flex-col gap-2.5 mt-3">
              {AREAS.map((a) => (
                <div key={a.name} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{a.name}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#0E9C8C]/10 text-[#0E9C8C]">{a.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            {selected ? (
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2"><span className="font-mono text-[11px] text-slate-400">{selected.id}</span><TypeBadge type={selected.type} /></div>
                <div className="font-semibold text-[#0A1B2E] text-sm">{selected.title}</div>
                <p className="text-xs text-slate-500 mt-1.5">{selected.description}</p>
                <div className="flex gap-2 mt-3"><StatusBadge status={selected.status} /><PriorityBadge priority={selected.priority} /></div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button onClick={() => navigate(`/admin/reports/${selected.id}`)} className="rounded-full bg-[#1F4FD8] text-white text-xs font-semibold py-2.5">View report</button>
                  <button className="rounded-full border border-slate-300 text-xs font-semibold py-2.5">Assign</button>
                </div>
              </div>
            ) : <EmptyState title="Select a marker" icon={MapIcon} />}
          </div>
        </div>
      </div>
    </div>
  );
}
