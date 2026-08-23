import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, MapPin } from "lucide-react";
import { StatusBadge, PriorityBadge, TypeBadge } from "../../components/ui/Badge.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { useReports } from "../../features/complaints/ReportsContext.jsx";

const FILTERS = ["All", "Community", "Government", "Consumer", "Active", "Resolved"];

export default function ReportsList() {
  const navigate = useNavigate();
  const { reports } = useReports();
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");

  const filtered = reports.filter((r) => {
    if (filter === "Active" && ["Resolved", "Closed"].includes(r.status)) return false;
    if (filter === "Resolved" && !["Resolved", "Closed"].includes(r.status)) return false;
    if (!["All", "Active", "Resolved"].includes(filter) && r.type !== filter) return false;
    if (q && !(r.title.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-semibold text-[#0A1B2E]">My reports</h1>
        <button onClick={() => navigate("/report")} className="px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-[#1F4FD8] flex items-center gap-1.5"><Plus size={15} /> New report</button>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by reference, title or category"
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-2 rounded-full text-xs font-semibold border ${filter === f ? "bg-[#0A1B2E] text-white border-[#0A1B2E]" : "border-slate-200 text-slate-600"}`}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No reports found" sub="Try adjusting your filters or search terms." />
      ) : (
        <div className="mt-6 grid gap-3">
          {filtered.map((r) => (
            <button key={r.id} onClick={() => navigate(`/reports/${r.id}`)} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 text-left hover:border-[#1F4FD8]/40 hover:shadow-sm transition-all">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="font-mono text-[11px] text-slate-400">{r.id}</span>
                  <TypeBadge type={r.type} />
                </div>
                <div className="font-semibold text-sm text-[#0A1B2E] truncate">{r.title}</div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {r.location}</span>
                  <span>{r.date}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <StatusBadge status={r.status} />
                <PriorityBadge priority={r.priority} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
