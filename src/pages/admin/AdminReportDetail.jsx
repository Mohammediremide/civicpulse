import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Send, AlertTriangle } from "lucide-react";
import { StatusBadge, PriorityBadge, TypeBadge } from "../../components/ui/Badge.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { PulseMap } from "../../components/PulseMap.jsx";
import { STATUS_STYLES } from "../../utils/constants.js";
import { DEPARTMENTS } from "../../data/departments.js";
import { useReports } from "../../features/complaints/ReportsContext.jsx";

export default function AdminReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getReportById, updateReport } = useReports();
  const report = getReportById(id);
  const [status, setStatus] = useState(report?.status);
  const [department, setDepartment] = useState(report?.department);
  const [note, setNote] = useState("");

  if (!report) return <EmptyState title="Report not found" sub={`No report matches ${id}.`} />;

  const applyStatus = (next) => {
    setStatus(next);
    updateReport(report.id, { status: next });
  };
  const applyDepartment = (next) => {
    setDepartment(next);
    updateReport(report.id, { department: next });
  };

  return (
    <div>
      <button onClick={() => navigate("/admin/reports")} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0A1B2E] mb-5"><ChevronLeft size={15} /> Back to reports</button>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 flex-wrap"><span className="font-mono text-xs text-slate-400">{report.id}</span><TypeBadge type={report.type} /><StatusBadge status={status} /><PriorityBadge priority={report.priority} /></div>
            <h1 className="font-display text-xl font-semibold text-[#0A1B2E] mt-3">{report.title}</h1>
            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">{report.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
              {[["Category", report.category], ["Location", report.location], ["Department", department], ["Filed", report.date]].map(([k, v]) => (
                <div key={k}><span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{k}</span><div className="text-sm font-medium text-[#0A1B2E] mt-0.5">{v}</div></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-display font-semibold text-[#0A1B2E] text-sm mb-4">Location</h2>
            <PulseMap reports={[report]} height={260} showHotspots={false} selectedId={report.id} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-display font-semibold text-[#0A1B2E] text-sm mb-4">Similar reports nearby</h2>
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
              <AlertTriangle size={15} /> 3 similar reports detected within 1.2 km — possible duplicate cluster.
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-display font-semibold text-[#0A1B2E] text-sm mb-4">Manage complaint</h2>
            <div className="flex flex-col gap-3">
              <label className="block"><span className="text-xs font-semibold text-slate-500">Status</span>
                <select value={status} onChange={(e) => applyStatus(e.target.value)} className="w-full mt-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  {Object.keys(STATUS_STYLES).map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="block"><span className="text-xs font-semibold text-slate-500">Assign department</span>
                <select value={department} onChange={(e) => applyDepartment(e.target.value)} className="w-full mt-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  {DEPARTMENTS.map((d) => <option key={d.name}>{d.name}</option>)}
                </select>
              </label>
              <label className="block"><span className="text-xs font-semibold text-slate-500">Add update</span>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Note visible to the citizen…" className="w-full mt-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none" />
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button onClick={() => applyStatus("Verified")} className="rounded-full border border-slate-300 text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5"><ShieldCheck size={13} /> Verify</button>
                <button className="rounded-full border border-slate-300 text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5"><Send size={13} /> Post update</button>
                <button onClick={() => applyStatus("Resolved")} className="rounded-full bg-[#16A34A] text-white text-xs font-semibold py-2.5">Mark resolved</button>
                <button onClick={() => applyStatus("Closed")} className="rounded-full bg-slate-700 text-white text-xs font-semibold py-2.5">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
