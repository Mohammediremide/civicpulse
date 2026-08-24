import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileStack, Inbox, Activity, CheckCircle2, AlertTriangle, TrendingUp, Clock, ArrowRight,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { getStats } from '../../services/reportService'
import { useReports } from '../../hooks/useReports'
import { StatusBadge, PriorityBadge, TypeBadge } from '../../components/Badge'
import { SkeletonCard, SkeletonLine } from '../../components/Skeleton'
import ErrorState from '../../components/ErrorState'
import { formatDate } from '../../utils/status'

export default function AdminDashboard() {
  const { reports: recent, loading: reportsLoading, error: reportsError, refetch } = useReports({ pageSize: 6 })
  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState(null)

  useEffect(() => {
    getStats().then(setStats).catch((e) => setStatsError(e.message))
  }, [])

  const cards = stats ? [
    { icon: FileStack, label: 'Total Reports', value: stats.total.toLocaleString(), tone: 'bg-mist-100 text-navy-800' },
    { icon: Inbox, label: 'Active', value: stats.active.toLocaleString(), tone: 'bg-blue-50 text-status-info' },
    { icon: CheckCircle2, label: 'Resolved', value: stats.resolved.toLocaleString(), tone: 'bg-emerald-50 text-status-resolved' },
    { icon: AlertTriangle, label: 'Critical (Active)', value: stats.critical.toLocaleString(), tone: 'bg-red-50 text-status-critical' },
    { icon: TrendingUp, label: 'Resolution Rate', value: `${stats.resolutionRate}%`, tone: 'bg-teal-50 text-teal-600' },
  ] : []

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Government Operations Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Not connected to a real government database or verification system</p>
        </div>
        <Link to="/admin/reports" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700">
          Review all reports <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {!stats && !statsError && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        {statsError && (
          <div className="col-span-full"><ErrorState description={statsError} /></div>
        )}
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-mist-200 bg-white p-5">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${c.tone}`}>
              <c.icon className="h-4.5 w-4.5" />
            </div>
            <p className="font-display text-2xl font-semibold text-ink-900">{c.value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-mist-200 bg-white">
          <div className="flex items-center justify-between p-5 pb-0 sm:p-6 sm:pb-0">
            <h2 className="font-display text-base font-semibold text-ink-900">Recently Received</h2>
            <Link to="/admin/reports" className="text-sm font-medium text-teal-600 hover:text-teal-700">View all</Link>
          </div>
          <div className="divide-y divide-mist-100 p-2 sm:p-3">
            {reportsLoading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3"><SkeletonLine className="h-4 flex-1" /><SkeletonLine className="h-5 w-20" /></div>
            ))}
            {reportsError && <ErrorState description={reportsError} onRetry={refetch} />}
            {!reportsLoading && !reportsError && recent.map((r) => (
              <Link key={r.id} to={`/admin/reports/${r.referenceId}`} className="flex items-center justify-between gap-4 rounded-lg p-3 transition-colors hover:bg-mist-50">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <TypeBadge typeId={r.typeId} />
                    <span className="font-mono text-[11px] text-slate-400">{r.referenceId}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-ink-900">{r.title}</p>
                  <p className="text-xs text-slate-400">{r.location?.city} · {formatDate(r.createdAt)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <StatusBadge status={r.status} />
                  <PriorityBadge priority={r.priority} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-mist-200 bg-white p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-ink-900">Hotspots</h2>
          <div className="mt-4 space-y-3">
            {!stats && <SkeletonLine className="h-24 w-full" />}
            {stats?.hotspots?.slice(0, 5).map((h, i) => (
              <Link key={h.city} to="/admin/map" className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-mist-50">
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-900 text-xs font-semibold text-white">{i + 1}</span>
                  <span className="text-sm font-medium text-ink-900">{h.city}</span>
                </div>
                <span className="text-sm text-slate-400">{h.count} reports</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
