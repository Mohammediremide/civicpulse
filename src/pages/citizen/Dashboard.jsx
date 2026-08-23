import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FilePlus2, Search, FileStack, Clock, CheckCircle2, Eye, Bell } from 'lucide-react'
import { useMemo } from 'react'
import Button from '../../components/Button'
import { StatusBadge } from '../../components/Badge'
import { useAuth } from '../../hooks/useAuth'
import { useReports } from '../../hooks/useReports'
import { SkeletonCard, SkeletonLine } from '../../components/Skeleton'
import ErrorState from '../../components/ErrorState'
import { formatDate } from '../../utils/status'

const NOTIFS = [
  { text: 'Your complaint CIV-2026-004821 has been verified.', time: '2h ago' },
  { text: 'Your complaint CIV-2026-004617 has been resolved.', time: '1d ago' },
  { text: 'Your complaint CIV-2026-004512 is now under review.', time: '3d ago' },
]

export default function CitizenDashboard() {
  const { session } = useAuth()
  const { reports: all, loading, error, refetch } = useReports({ pageSize: 8 })
  const reports = all

  const stats = useMemo(() => {
    const submitted = reports.length
    const review = reports.filter((r) => ['Under Review', 'Received', 'Submitted'].includes(r.status)).length
    const progress = reports.filter((r) => ['In Progress', 'Investigation', 'Assigned', 'Verified'].includes(r.status)).length
    const resolved = reports.filter((r) => ['Resolved', 'Closed'].includes(r.status)).length
    return { submitted, review, progress, resolved }
  }, [reports])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Welcome back, {session?.fullName?.split(' ')[0] ?? 'Citizen'}</h1>
          <p className="mt-1 text-sm text-slate-500">Here's what's happening with your reports.</p>
        </div>
        <div className="flex gap-2">
          <Button as={Link} to="/report" icon={FilePlus2}>Quick Report</Button>
          <Button as={Link} to="/track" variant="outline" icon={Search}>Track Complaint</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FileStack} label="Reports Submitted" value={stats.submitted} color="text-navy-800 bg-mist-100" delay={0} />
        <StatCard icon={Clock} label="Under Review" value={stats.review} color="text-status-warning bg-amber-50" delay={0.06} />
        <StatCard icon={Eye} label="In Progress" value={stats.progress} color="text-status-high bg-orange-50" delay={0.12} />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats.resolved} color="text-status-resolved bg-emerald-50" delay={0.18} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-mist-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink-900">Recent Reports</h2>
            <Link to="/reports" className="text-sm font-medium text-teal-600 hover:text-teal-700">View all</Link>
          </div>
          <div className="mt-4 divide-y divide-mist-100">
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3.5">
                <SkeletonLine className="h-4 flex-1" />
                <SkeletonLine className="h-5 w-20" />
              </div>
            ))}
            {!loading && error && <ErrorState description={error} onRetry={refetch} />}
            {!loading && !error && reports.map((r) => (
              <Link key={r.id} to={`/reports/${r.referenceId}`} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 hover:bg-mist-50 -mx-2 px-2 rounded-lg transition-colors">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">{r.title}</p>
                  <p className="font-mono text-xs text-slate-400">{r.referenceId} · {formatDate(r.createdAt)}</p>
                </div>
                <StatusBadge status={r.status} className="shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-mist-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink-900">Recent Updates</h2>
            <Bell className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 space-y-4">
            {NOTIFS.map((n, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                <div>
                  <p className="text-sm text-ink-900">{n.text}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{n.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="rounded-2xl border border-mist-200 bg-white p-5">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="font-display text-2xl font-semibold text-ink-900">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </motion.div>
  )
}
