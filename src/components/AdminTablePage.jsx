import React from "react";
import { DemoTag } from "./ui/Badge.jsx";

// Generic read-only table page, reused by Departments / Organizations / Users.
export function AdminTablePage({ title, cols, rows }) {
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold text-[#0A1B2E]">{title}</h1>
        <DemoTag />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wide">
              <tr>{cols.map((c) => <th key={c} className="text-left px-5 py-3 font-semibold">{c}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">{r.map((cell, j) => <td key={j} className="px-5 py-3.5 text-slate-600">{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
