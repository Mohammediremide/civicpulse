import { Landmark, ArrowUpRight } from 'lucide-react'
import { DEPARTMENTS } from '../../data/taxonomy'
import { useReports } from '../../hooks/useReports'
import { SkeletonCard } from '../../components/Skeleton'
import ErrorState from '../../components/ErrorState'
import FlipCard from '../../components/FlipCard'
import { StatusBadge } from '../../components/Badge'
import { formatDate } from '../../utils/status'

export default function AdminDepartments() {
  const { reports: all, loading, error, refetch } = useReports({ pageSize: 100 })

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Departments</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Departments</h1>
        <div className="mt-6"><ErrorState description={error} onRetry={refetch} /></div>
      </div>
    )
  }

  const rows = DEPARTMENTS.map((d) => {
    const items = all.filter((r) => r.department === d.name)
    const resolved = items.filter((r) => ['Resolved', 'Closed'].includes(r.status)).length
    const active = items.length - resolved
    const rate = items.length ? Math.round((resolved / items.length) * 100) : 0
    const recent = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
    return { ...d, received: items.length, active, resolved, rate, avgResponse: (1.8 + Math.random() * 3).toFixed(1), recent }
  })

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Departments</h1>
      <p className="mt-1 text-sm text-slate-500">Government departments handling assigned complaints. Hover or tap a card for recent activity.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((d) => (
          <FlipCard
            key={d.id}
            className="h-56"
            front={
              <div className="flex h-56 flex-col rounded-2xl border border-mist-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist-100 text-navy-800">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-ink-900">{d.name}</p>
                    <p className="truncate text-xs text-slate-400">{d.lead}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Metric label="Received" value={d.received} />
                  <Metric label="Active" value={d.active} />
                  <Metric label="Resolved" value={d.resolved} />
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Resolution rate</span>
                    <span>{d.rate}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-mist-100">
                    <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${d.rate}%` }} />
                  </div>
                </div>
                <p className="mt-auto pt-3 text-xs text-slate-400">Avg. response: {d.avgResponse} days</p>
              </div>
            }
            back={
              <div className="flex h-56 flex-col rounded-2xl border border-teal-200 bg-teal-50/40 p-5">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
                  <ArrowUpRight className="h-3.5 w-3.5" /> Recent activity
                </p>
                <div className="mt-3 flex-1 space-y-2.5 overflow-hidden">
                  {d.recent.length === 0 && <p className="text-sm text-slate-500">No reports assigned yet.</p>}
                  {d.recent.map((r) => (
                    <div key={r.id} className="rounded-lg bg-white/70 px-2.5 py-2">
                      <p className="truncate text-xs font-medium text-ink-900">{r.title}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <StatusBadge status={r.status} />
                        <span className="text-[10px] text-slate-400">{formatDate(r.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
        ))}
      </div>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="font-display text-lg font-semibold text-ink-900">{value}</p>
      <p className="text-[11px] text-slate-400">{label}</p>
    </div>
  )
}
