import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileWarning } from 'lucide-react'
import { useReports } from '../../hooks/useReports'
import { StatusBadge, PriorityBadge, TypeBadge } from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Skeleton'
import { formatDate } from '../../utils/status'
import { COMPLAINT_TYPES } from '../../data/taxonomy'

export default function Complaints() {
  const { reports: allReports, loading, error, refetch } = useReports()
  const [tab, setTab] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return allReports.filter((r) => {
      if (tab !== 'All' && r.typeId !== tab) return false
      if (query && !`${r.title} ${r.referenceId} ${r.location.city}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [allReports, tab, query])

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-5xl px-5 pb-10 pt-6 text-center lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">Public Complaints</span>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">Browse community, government, and consumer complaints</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">Aggregated demo data. Private reporter information is never shown publicly.</p>
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-20 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {['All', ...COMPLAINT_TYPES.map((t) => t.id)].map((t) => {
              const label = t === 'All' ? 'All' : COMPLAINT_TYPES.find((c) => c.id === t)?.short
              return (
                <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-navy-900 text-white' : 'bg-mist-100 text-slate-600 hover:bg-mist-200'}`}>
                  {label}
                </button>
              )
            })}
          </div>
          <div className="relative ml-auto flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search complaints" className="w-full rounded-xl border border-mist-200 bg-white py-2.5 pl-9 pr-3 text-sm focus-visible:border-teal-500" />
          </div>
        </div>

        <div className="mt-6 divide-y divide-mist-200 rounded-2xl border border-mist-200 bg-white">
          {loading && (
            <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          )}
          {!loading && error && (
            <div className="p-6"><ErrorState description={error} onRetry={refetch} /></div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="p-6">
              <EmptyState icon={FileWarning} title="No complaints found" description="Try a different search term or category." />
            </div>
          )}
          {!loading && !error && filtered.slice(0, 40).map((r) => (
            <Link key={r.id} to={`/reports/${r.referenceId}`} className="flex flex-col gap-3 p-5 transition-colors hover:bg-mist-50 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <TypeBadge typeId={r.typeId} />
                  <span className="font-mono text-[11px] text-slate-400">{r.referenceId}</span>
                </div>
                <h3 className="mt-1.5 truncate font-display text-base font-semibold text-ink-900">{r.title}</h3>
                <p className="text-sm text-slate-500">{r.location.city}, {r.location.state} · {formatDate(r.createdAt)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <StatusBadge status={r.status} />
                <PriorityBadge priority={r.priority} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
