import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { StatusBadge, PriorityBadge, TypeBadge, DemoTag } from "../../components/ui/Badge.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { STATUS_STYLES } from "../../utils/constants.js";
import { useReports } from "../../features/complaints/ReportsContext.jsx";

export default function AdminReports() {
  const navigate = useNavigate();
  const { reports } = useReports();
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [q, setQ] = useState("");

  const filtered = reports.filter((r) =>
    (typeFilter === "All" || r.type === typeFilter) &&
    (statusFilter === "All" || r.status === statusFilter) &&
    (!q || r.title.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold text-[#0A1B2E]">All reports</h1>
        <DemoTag />
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reference or title"
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3.5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold bg-white text-slate-600">
          {["All", "Community", "Government", "Consumer"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3.5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold bg-white text-slate-600">
          {["All", ...Object.keys(STATUS_STYLES)].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wide">
              <tr>{["Reference", "Issue", "Type", "Location", "Priority", "Status", "Department", "Date", ""].map((h) => <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/admin/reports/${r.id}`)}>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="px-5 py-3.5 font-medium text-[#0A1B2E] max-w-[220px] truncate">{r.title}</td>
                  <td className="px-5 py-3.5"><TypeBadge type={r.type} /></td>
                  <td className="px-5 py-3.5 text-slate-500">{r.location}</td>
                  <td className="px-5 py-3.5"><PriorityBadge priority={r.priority} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3.5 text-slate-500">{r.department}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">{r.date}</td>
                  <td className="px-5 py-3.5 text-slate-300">›</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState title="No matching reports" sub="Adjust your filters to see more results." />}
      </div>
    </div>
  );
}
