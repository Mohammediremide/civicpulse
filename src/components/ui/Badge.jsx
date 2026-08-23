import React from "react";
import { STATUS_STYLES, PRIORITY_STYLES } from "../../utils/constants.js";
import { TYPE_META } from "../../utils/typeMeta.js";

export function Badge({ children, bg, fg, dot }) {
  return (
    <span style={{ background: bg, color: fg }} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Submitted;
  return <Badge bg={s.bg} fg={s.fg} dot={s.dot}>{status}</Badge>;
}

export function PriorityBadge({ priority }) {
  const s = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Normal;
  return <Badge bg={s.bg} fg={s.fg}>{priority}</Badge>;
}

export function TypeBadge({ type }) {
  const m = TYPE_META[type];
  if (!m) return null;
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${m.color}14`, color: m.color }}>
      <Icon size={12} strokeWidth={2.5} /> {m.label}
    </span>
  );
}

export function DemoTag() {
  return (
    <span className="text-[10px] tracking-wide font-mono font-semibold uppercase text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">
      Demo data
    </span>
  );
}
