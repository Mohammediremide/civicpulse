import React from "react";
import { useNavigate } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard.jsx";
import { PriorityBadge, DemoTag } from "../../components/ui/Badge.jsx";
import { PulseMap } from "../../components/PulseMap.jsx";
import { DEPARTMENTS } from "../../data/departments.js";
import { useReports } from "../../features/complaints/ReportsContext.jsx";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { reports } = useReports();
  const critical = reports.filter((r) => r.priority === "Critical");

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#0A1B2E]">Operations overview</h1>
          <p className="text-sm text-slate-500 mt-1">What's happening across every department, right now.</p>
        </div>
        <DemoTag />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
        <StatCard label="Total reports" value="12,482" sub="All-time" />
        <StatCard label="New today" value="42" accent="#1F4FD8" />
        <StatCard label="Active" value="183" accent="#EA580C" />
        <StatCard label="Resolved" value="9,310" accent="#16A34A" />
        <StatCard label="Critical" value="17" accent="#DC2626" />
        <StatCard label="Resolution rate" value="74.5%" accent="#0E9C8C" />
        <StatCard label="Avg. response" value="3.2 days" />
        <StatCard label="Departments active" value="6" />
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 mt-7">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-[#0A1B2E]">Live operations map</h2>
            <button onClick={() => navigate("/admin/map")} className="text-xs font-semibold text-[#1F4FD8]">Open full map</button>
          </div>
          <div className="mt-4"><PulseMap reports={reports} height={320} /></div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display font-semibold text-[#0A1B2E] flex items-center gap-2"><CircleAlert size={16} className="text-[#DC2626]" /> Needs attention</h2>
          <div className="mt-4 flex flex-col divide-y divide-slate-100">
            {critical.map((r) => (
              <button key={r.id} onClick={() => navigate(`/admin/reports/${r.id}`)} className="py-3 text-left group">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-[#0A1B2E] group-hover:text-[#1F4FD8] truncate">{r.title}</span>
                  <PriorityBadge priority={r.priority} />
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400"><span className="font-mono">{r.id}</span><span>·</span><span>{r.location}</span></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
        <h2 className="font-display font-semibold text-[#0A1B2E]">Department performance</h2>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm min-w-[600px]">
            <thead><tr className="text-left text-xs text-slate-400 uppercase tracking-wide"><th className="pb-3 font-semibold">Department</th><th className="pb-3 font-semibold">Active</th><th className="pb-3 font-semibold">Resolved</th><th className="pb-3 font-semibold">Rate</th><th className="pb-3 font-semibold">Avg. days</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {DEPARTMENTS.map((d) => (
                <tr key={d.name}>
                  <td className="py-3 font-medium text-[#0A1B2E]">{d.name}</td>
                  <td className="py-3 text-slate-500">{d.active}</td>
                  <td className="py-3 text-slate-500">{d.resolved.toLocaleString()}</td>
                  <td className="py-3"><span className="font-semibold" style={{ color: d.rate > 78 ? "#16A34A" : "#D97706" }}>{d.rate}%</span></td>
                  <td className="py-3 text-slate-500 font-mono text-xs">{d.avgDays}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
