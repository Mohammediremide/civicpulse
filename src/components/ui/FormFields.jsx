import React, { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <input {...props} className="w-full mt-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/25 focus:border-[#1F4FD8]" />
    </label>
  );
}

export function PasswordField({ label, value, onChange, showStrength }) {
  const [show, setShow] = useState(false);
  const score = useMemo(() => {
    let s = 0;
    if (value.length >= 8) s++;
    if (/[A-Z]/.test(value)) s++;
    if (/[0-9]/.test(value)) s++;
    if (/[^A-Za-z0-9]/.test(value)) s++;
    return s;
  }, [value]);
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#DC2626", "#EA580C", "#D97706", "#0E9C8C", "#16A34A"];
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <div className="relative mt-1.5">
        <input type={show ? "text" : "password"} value={value} onChange={onChange}
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/25 focus:border-[#1F4FD8]" />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label={show ? "Hide password" : "Show password"}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {showStrength && value && (
        <div className="mt-2">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i < score ? colors[score] : "#E2E8F0" }} />)}
          </div>
          <span className="text-[11px] mt-1 inline-block" style={{ color: colors[score] }}>{labels[score]}</span>
        </div>
      )}
    </label>
  );
}
