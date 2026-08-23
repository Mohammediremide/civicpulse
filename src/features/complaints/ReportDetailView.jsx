import React from "react";
import { MapPin, Camera } from "lucide-react";
import { PulseMap } from "../../components/PulseMap.jsx";
import { StatusBadge, PriorityBadge, TypeBadge } from "../../components/ui/Badge.jsx";
import { STATUS_SEQUENCE } from "../../utils/constants.js";

// Shared read-only report detail body, reused by the citizen report
// page and the admin report page (which adds its own management panel
// alongside this).
export function ReportDetailView({ report }) {
  const currentIdx = STATUS_SEQUENCE.indexOf(report.status);
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display font-semibold text-[#0A1B2E] text-sm">Description</h2>
          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">{report.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            {[["Category", report.category], ["Department", report.department], ["Priority", report.priority]].map(([k, v]) => (
              <div key={k}><span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{k}</span><div className="text-sm font-medium text-[#0A1B2E] mt-0.5">{v}</div></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display font-semibold text-[#0A1B2E] text-sm mb-4">Location</h2>
          <PulseMap reports={[report]} height={260} showHotspots={false} selectedId={report.id} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display font-semibold text-[#0A1B2E] text-sm mb-4">Evidence</h2>
          <div className="flex gap-3 flex-wrap">
            {[1, 2].map((i) => (
              <div key={i} className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><Camera size={20} /></div>
            ))}
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-xs text-center px-2">Demo attachments</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit">
        <h2 className="font-display font-semibold text-[#0A1B2E] text-sm mb-5">Status timeline</h2>
        <div className="flex flex-col">
          {STATUS_SEQUENCE.map((s, i) => {
            const done = i <= currentIdx;
            return (
              <div key={s} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${done ? "bg-[#1F4FD8] border-[#1F4FD8]" : "bg-white border-slate-300"}`} />
                  {i < STATUS_SEQUENCE.length - 1 && <div className={`w-0.5 flex-1 min-h-[28px] ${i < currentIdx ? "bg-[#1F4FD8]" : "bg-slate-200"}`} />}
                </div>
                <div className="pb-6 -mt-0.5">
                  <div className={`text-sm font-medium ${done ? "text-[#0A1B2E]" : "text-slate-400"}`}>{s}</div>
                  {done && <div className="text-[11px] text-slate-400 mt-0.5">{report.date}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ReportDetailHeader({ report }) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-slate-400">{report.id}</span>
          <TypeBadge type={report.type} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-[#0A1B2E] mt-2">{report.title}</h1>
        <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1.5"><MapPin size={13} /> {report.location} · Filed {report.date}</p>
      </div>
      <div className="flex gap-2"><StatusBadge status={report.status} /><PriorityBadge priority={report.priority} /></div>
    </div>
  );
}
