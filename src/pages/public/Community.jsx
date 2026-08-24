import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { List, Map as MapIcon, Search } from 'lucide-react'
import DemoMap from '../../components/DemoMap'
import { StatusBadge, PriorityBadge, TypeBadge } from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonBlock, SkeletonCard } from '../../components/Skeleton'
import { useReports } from '../../hooks/useReports'
import { COMPLAINT_TYPES } from '../../data/taxonomy'
import { formatDate } from '../../utils/status'

const STATUS_OPTIONS = ['All', 'Under Review', 'Assigned', 'In Progress', 'Resolved']
const PRIORITY_OPTIONS = ['All', 'Critical', 'High', 'Medium', 'Normal']

export default function Community() {
  const { reports: allReports, loading, error, refetch } = useReports()
  const [view, setView] = useState('map')
  const [type, setType] = useState('All')
  const [status, setStatus] = useState('All')
  const [priority, setPriority] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return allReports.filter((r) => {
      if (type !== 'All' && r.typeId !== type) return false
      if (status !== 'All' && r.status !== status) return false
      if (priority !== 'All' && r.priority !== priority) return false
      if (query && !`${r.title} ${r.location.city} ${r.referenceId}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [allReports, type, status, priority, query])

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">Community Map</span>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">See what's happening in your area</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">Aggregated, anonymized reports across Lagos. No private citizen information is shown here.</p>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        {/* filters */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-mist-200 bg-white p-3 shadow-sm">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, city, or reference ID" className="w-full rounded-xl border border-mist-200 bg-mist-50 py-2.5 pl-9 pr-3 text-sm focus-visible:border-teal-500" />
          </div>
          <Select value={type} onChange={setType} options={['All', ...COMPLAINT_TYPES.map((t) => t.id)]} labels={{ All: 'All Types', ...Object.fromEntries(COMPLAINT_TYPES.map((t) => [t.id, t.short])) }} />
          <Select value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          <Select value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} />
          <div className="ml-auto flex rounded-xl border border-mist-200 p-1">
            <button onClick={() => setView('map')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${view === 'map' ? 'bg-navy-900 text-white' : 'text-slate-500'}`}><MapIcon className="h-3.5 w-3.5" /> Map</button>
            <button onClick={() => setView('list')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${view === 'list' ? 'bg-navy-900 text-white' : 'text-slate-500'}`}><List className="h-3.5 w-3.5" /> List</button>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400">{filtered.length} reports match your filters</p>

        {loading ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : error ? (
          <div className="mt-4"><ErrorState description={error} onRetry={refetch} /></div>
        ) : view === 'map' ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="h-[540px]">
              <DemoMap reports={filtered} selectedId={selected?.id} onSelect={setSelected} />
            </div>
            <div className="h-[540px] overflow-y-auto scrollbar-thin rounded-2xl border border-mist-200 bg-white p-2">
              {selected ? (
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <TypeBadge typeId={selected.typeId} />
                    <span className="font-mono text-[11px] text-slate-400">{selected.referenceId}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">{selected.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{selected.location.address}, {selected.location.city}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge status={selected.status} />
                    <PriorityBadge priority={selected.priority} />
                  </div>
                  <p className="mt-3 text-xs text-slate-400">{formatDate(selected.createdAt)}</p>
                  <Link to={`/reports/${selected.referenceId}`} className="mt-5 block rounded-xl bg-navy-900 py-2.5 text-center text-sm font-medium text-white hover:bg-navy-800">
                    View Report
                  </Link>
                </div>
              ) : (
                <EmptyState icon={MapIcon} title="Select a marker" description="Click any marker on the map to see report details here." />
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 && (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState icon={Search} title="No issues match your filters" description="Try adjusting your search or filters." />
              </div>
            )}
            {filtered.slice(0, 30).map((r) => (
              <Link key={r.id} to={`/reports/${r.referenceId}`} className="rounded-2xl border border-mist-200 bg-white p-5 transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <TypeBadge typeId={r.typeId} />
                  <span className="font-mono text-[11px] text-slate-400">{r.referenceId}</span>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-ink-900">{r.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{r.location.city}, {r.location.state}</p>
                <div className="mt-3 flex flex-wrap gap-2">
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

function Select({ value, onChange, options, labels = {} }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-mist-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus-visible:border-teal-500">
      {options.map((o) => (
        <option key={o} value={o}>{labels[o] ?? o}</option>
      ))}
    </select>
  )
}
