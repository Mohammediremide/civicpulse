import React from "react";
import { FileText } from "lucide-react";

export function EmptyState({ title, sub, icon: Icon = FileText }) {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center"><Icon className="text-slate-400" size={22} /></div>
      <p className="font-semibold text-[#0A1B2E] mt-4">{title}</p>
      {sub && <p className="text-sm text-slate-500 mt-1 max-w-sm">{sub}</p>}
    </div>
  );
}
