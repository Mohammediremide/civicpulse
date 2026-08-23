import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, FilePlus2, FileStack } from 'lucide-react'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Skeleton'
import { StatusBadge, PriorityBadge, TypeBadge } from '../../components/Badge'
import { useReports } from '../../hooks/useReports'
import { formatDate } from '../../utils/status'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'community', label: 'Community' },
  { id: 'government', label: 'Government' },
  { id: 'consumer', label: 'Consumer' },
  { id: 'active', label: 'Active' },
  { id: 'resolved', label: 'Resolved' },
]

export default function MyReports() {
  const { reports, loading, error, refetch } = useReports({ pageSize: 20 })
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = reports.filter((r) => {
    if (tab === 'active' && ['Resolved', 'Closed'].includes(r.status)) return false
    if (tab === 'resolved' && !['Resolved', 'Closed'].includes(r.status)) return false
    if (['community', 'government', 'consumer'].includes(tab) && r.typeId !== tab) return false
    if (query && !`${r.title} ${r.referenceId}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink-900">My Reports</h1>
        <Button as={Link} to="/report" icon={FilePlus2}>New Report</Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${tab === t.id ? 'bg-navy-900 text-white' : 'bg-white border border-mist-200 text-slate-600 hover:bg-mist-100'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by reference ID or title" className="w-full rounded-xl border border-mist-200 bg-white py-2.5 pl-9 pr-3 text-sm focus-visible:border-teal-500" />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-mist-200 bg-white">
        {loading ? (
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <SkeletonCard /><SkeletonCard />
          </div>
        ) : error ? (
          <div className="p-6"><ErrorState description={error} onRetry={refetch} /></div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={FileStack} title="No reports yet" description="You haven't submitted any reports matching this filter." action={<Button as={Link} to="/report" icon={FilePlus2}>Report an Issue</Button>} />
          </div>
        ) : (
          <div className="divide-y divide-mist-100">
            {filtered.map((r) => (
              <Link key={r.id} to={`/reports/${r.referenceId}`} className="flex flex-col gap-3 p-4 transition-colors hover:bg-mist-50 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <TypeBadge typeId={r.typeId} />
                    <span className="font-mono text-[11px] text-slate-400">{r.referenceId}</span>
                  </div>
                  <p className="mt-1.5 truncate font-medium text-ink-900">{r.title}</p>
                  <p className="text-xs text-slate-400">{r.location?.city}, {r.location?.state} · {formatDate(r.createdAt)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <StatusBadge status={r.status} />
                  <PriorityBadge priority={r.priority} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
