import React from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { TrendingUp, Droplets, CheckCircle2 } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard.jsx";
import { DemoTag } from "../../components/ui/Badge.jsx";
import { DEPARTMENTS } from "../../data/departments.js";
import { MONTHLY, BY_CATEGORY, BY_TYPE, INSIGHTS } from "../../data/analytics.js";
import { PIE_COLORS } from "../../utils/constants.js";

const INSIGHT_ICONS = { critical: [TrendingUp, "#DC2626"], info: [Droplets, "#1F4FD8"], positive: [CheckCircle2, "#16A34A"], warning: [TrendingUp, "#EA580C"] };

export default function AdminAnalytics() {
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold text-[#0A1B2E]">Analytics</h1>
        <DemoTag />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        <StatCard label="Total complaints" value="12,482" />
        <StatCard label="Resolved" value="9,310" accent="#16A34A" />
        <StatCard label="Active" value="3,172" accent="#EA580C" />
        <StatCard label="Resolution rate" value="74.5%" accent="#0E9C8C" />
        <StatCard label="Avg. response" value="3.2 days" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-7">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display font-semibold text-[#0A1B2E] text-sm">Reports over time</h2>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1F4FD8" stopOpacity={0.25} /><stop offset="100%" stopColor="#1F4FD8" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="reports" stroke="#1F4FD8" strokeWidth={2} fill="url(#g1)" name="Reports" />
                <Line type="monotone" dataKey="resolved" stroke="#0E9C8C" strokeWidth={2} dot={false} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display font-semibold text-[#0A1B2E] text-sm">Complaints by category</h2>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BY_CATEGORY} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#0E9C8C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display font-semibold text-[#0A1B2E] text-sm">Complaints by type</h2>
          <div className="h-64 mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={BY_TYPE} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {BY_TYPE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display font-semibold text-[#0A1B2E] text-sm">Department performance</h2>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENTS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="rate" radius={[6, 6, 0, 0]} fill="#1F4FD8" name="Resolution %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
        <h2 className="font-display font-semibold text-[#0A1B2E] text-sm flex items-center gap-2"><TrendingUp size={15} className="text-[#0E9C8C]" /> Community insights</h2>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {INSIGHTS.map((insight, i) => {
            const [Icon, color] = INSIGHT_ICONS[insight.tone] || INSIGHT_ICONS.info;
            return (
              <div key={i} className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-4">
                <Icon size={16} style={{ color }} className="mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700">{insight.text}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-4">Demo insights generated from rule-based summaries — architected for a future analytics/AI service.</p>
      </div>
    </div>
  );
}
