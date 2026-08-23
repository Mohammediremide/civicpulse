import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'
import { TrendingUp, CheckCircle2, Activity, Clock, Percent } from 'lucide-react'
import { useReports } from '../../hooks/useReports'
import { getStats } from '../../services/reportService'
import { SkeletonBlock } from '../../components/Skeleton'
import ErrorState from '../../components/ErrorState'
import { COMPLAINT_TYPES, DEPARTMENTS } from '../../data/taxonomy'

const TEAL = '#14c7b5'
const BLUE = '#1e5fe0'
const NAVY = '#122748'
const AMBER = '#ca9500'
const RED = '#d92d20'
const GREEN = '#17a34a'

const TREND = [
  { month: 'Mar', reports: 720 }, { month: 'Apr', reports: 810 }, { month: 'May', reports: 940 },
  { month: 'Jun', reports: 1020 }, { month: 'Jul', reports: 1180 }, { month: 'Aug', reports: 1340 },
]

const CATEGORY_DATA = [
  { name: 'Roads', value: 2140 }, { name: 'Waste', value: 1620 }, { name: 'Flooding', value: 1480 },
  { name: 'Water', value: 1120 }, { name: 'Streetlights', value: 980 }, { name: 'Telecom', value: 860 },
  { name: 'Banking', value: 640 }, { name: 'Transport', value: 590 },
]

export default function AdminAnalytics() {
  const { reports: all, loading, error, refetch } = useReports({ pageSize: 100 })
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStats().then(setStats).catch(() => {})
  }, [])

  const hotspots = stats?.hotspots ?? []

  const topCards = [
    { icon: Activity, label: 'Total Complaints', value: stats ? stats.total.toLocaleString() : '—' },
    { icon: CheckCircle2, label: 'Resolved', value: stats ? stats.resolved.toLocaleString() : '—' },
    { icon: TrendingUp, label: 'Active', value: stats ? stats.active.toLocaleString() : '—' },
    { icon: Percent, label: 'Resolution Rate', value: stats ? `${stats.resolutionRate}%` : '—' },
    { icon: Clock, label: 'Critical (Active)', value: stats ? stats.critical.toLocaleString() : '—' },
  ]

  const typeBreakdown = useMemo(() => {
    return COMPLAINT_TYPES.map((t) => {
      const items = all.filter((r) => r.typeId === t.id)
      const resolved = items.filter((r) => ['Resolved', 'Closed'].includes(r.status)).length
      return {
        name: t.short,
        submitted: items.length,
        active: items.length - resolved,
        resolved,
        rate: items.length ? Math.round((resolved / items.length) * 100) : 0,
      }
    })
  }, [all])

  const deptPerf = useMemo(() => {
    return DEPARTMENTS.map((d) => {
      const items = all.filter((r) => r.department === d.name)
      const resolved = items.filter((r) => ['Resolved', 'Closed'].includes(r.status)).length
      return { name: d.name, received: items.length, resolved, rate: items.length ? Math.round((resolved / items.length) * 100) : 0 }
    }).sort((a, b) => b.received - a.received)
  }, [all])

  const pieColors = [TEAL, BLUE, NAVY, AMBER, RED, GREEN, '#8792a3', '#5c93f7']

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Demo analytics — trends and figures are illustrative.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {topCards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-mist-200 bg-white p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <c.icon className="h-4.5 w-4.5" />
            </div>
            <p className="font-display text-2xl font-semibold text-ink-900">{c.value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      {error && <ErrorState description={error} onRetry={refetch} />}
      {loading && !error && (
        <div className="space-y-6">
          <SkeletonBlock className="h-72 w-full" />
          <div className="grid gap-6 lg:grid-cols-2">
            <SkeletonBlock className="h-64 w-full" />
            <SkeletonBlock className="h-64 w-full" />
          </div>
        </div>
      )}

      {!loading && !error && (
      <>
      <ChartCard title="Reports Over Time">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={TREND}>
            <defs>
              <linearGradient id="reportsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={TEAL} stopOpacity={0.35} />
                <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e8ef" vertical={false} />
            <XAxis dataKey="month" stroke="#8792a3" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#8792a3" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e3e8ef', fontSize: 13 }} />
            <Area type="monotone" dataKey="reports" stroke={TEAL} strokeWidth={2.5} fill="url(#reportsGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Complaints By Type">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={typeBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e8ef" vertical={false} />
              <XAxis dataKey="name" stroke="#8792a3" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8792a3" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e3e8ef', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="active" name="Active" fill={AMBER} radius={[6, 6, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill={GREEN} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Complaints By Category">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={CATEGORY_DATA} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {CATEGORY_DATA.map((entry, i) => <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e3e8ef', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Complaints By Location">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={hotspots} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e8ef" horizontal={false} />
            <XAxis type="number" stroke="#8792a3" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="city" stroke="#8792a3" fontSize={12} tickLine={false} axisLine={false} width={90} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e3e8ef', fontSize: 13 }} />
            <Bar dataKey="count" name="Reports" fill={BLUE} radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Resolution Rate by Type">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={typeBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e8ef" vertical={false} />
              <XAxis dataKey="name" stroke="#8792a3" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8792a3" fontSize={12} tickLine={false} axisLine={false} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e3e8ef', fontSize: 13 }} />
              <Line type="monotone" dataKey="rate" name="Resolution Rate" stroke={TEAL} strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="rounded-2xl border border-mist-200 bg-white p-6">
          <h3 className="font-display text-base font-semibold text-ink-900">Department Performance</h3>
          <div className="mt-4 space-y-3">
            {deptPerf.slice(0, 6).map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-900">{d.name}</span>
                  <span className="text-slate-400">{d.resolved}/{d.received} · {d.rate}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-mist-100">
                  <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${d.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-mist-200 bg-navy-950 grain-noise p-6 sm:p-8">
        <h3 className="font-display text-base font-semibold text-white">Community Insights</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            'Road complaints increased 18% this month.',
            'Flooding reports are concentrated in three areas.',
            'Public Works resolved 82% of assigned reports.',
            'Consumer service complaints increased in the last 30 days.',
          ].map((insight) => (
            <div key={insight} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">{insight}</div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">Demo insights — architected for a future real analytics/AI service.</p>
      </div>
      </>
      )}
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-mist-200 bg-white p-6">
      <h3 className="font-display text-base font-semibold text-ink-900">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  )
}
