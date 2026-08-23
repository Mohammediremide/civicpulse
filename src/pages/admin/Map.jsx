import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, X, Flame } from 'lucide-react'
import DemoMap from '../../components/DemoMap'
import { StatusBadge, PriorityBadge, TypeBadge } from '../../components/Badge'
import ErrorState from '../../components/ErrorState'
import { SkeletonBlock } from '../../components/Skeleton'
import { useReports } from '../../hooks/useReports'
import { getStats } from '../../services/reportService'
import { COMPLAINT_TYPES, STATUS_FLOW, PRIORITIES, DEPARTMENTS } from '../../data/taxonomy'
import Button from '../../components/Button'
import { formatDate } from '../../utils/status'

export default function AdminMap() {
  const { reports: all, loading, error, refetch } = useReports({ pageSize: 100 })
  const [hotspots, setHotspots] = useState([])
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All')
  const [status, setStatus] = useState('All')
  const [priority, setPriority] = useState('All')
  const [department, setDepartment] = useState('All')
  const [selected, setSelected] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    getStats().then((s) => setHotspots(s.hotspots.slice(0, 6))).catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    return all.filter((r) => {
      if (type !== 'All' && r.typeId !== type) return false
      if (status !== 'All' && r.status !== status) return false
      if (priority !== 'All' && r.priority !== priority) return false
      if (department !== 'All' && r.department !== department) return false
      if (query && !`${r.title} ${r.referenceId} ${r.location?.city}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [all, type, status, priority, department, query])

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Operations Map</h1>
          <p className="mt-1 text-sm text-slate-500">{filtered.length} active reports across the city</p>
        </div>
        <button onClick={() => setShowFilters((s) => !s)} className="flex items-center gap-1.5 rounded-xl border border-mist-200 bg-white px-3.5 py-2 text-sm font-medium text-ink-900 lg:hidden">
          <Filter className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[240px_1fr_320px]">
        {/* Filters column */}
        <div className={`space-y-4 overflow-y-auto scrollbar-thin rounded-2xl border border-mist-200 bg-white p-4 lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full rounded-xl border border-mist-200 bg-mist-50 py-2 pl-9 pr-3 text-sm focus-visible:border-teal-500" />
          </div>
          <FilterGroup label="Complaint Type" value={type} onChange={setType} options={['All', ...COMPLAINT_TYPES.map((t) => t.id)]} labels={{ All: 'All', ...Object.fromEntries(COMPLAINT_TYPES.map((t) => [t.id, t.short])) }} />
          <FilterGroup label="Status" value={status} onChange={setStatus} options={['All', ...STATUS_FLOW]} />
          <FilterGroup label="Priority" value={priority} onChange={setPriority} options={['All', ...PRIORITIES]} />
          <FilterGroup label="Department" value={department} onChange={setDepartment} options={['All', ...DEPARTMENTS.map((d) => d.name)]} />

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400"><Flame className="h-3.5 w-3.5" /> Hotspots</p>
            <div className="space-y-1">
              {hotspots.map((h) => (
                <button key={h.city} onClick={() => setQuery(h.city)} className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs hover:bg-mist-50">
                  <span className="text-ink-900">{h.city}</span>
                  <span className="text-slate-400">{h.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="min-h-[360px]">
          {loading ? (
            <SkeletonBlock className="h-full w-full" />
          ) : error ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-mist-200 bg-white">
              <ErrorState description={error} onRetry={refetch} />
            </div>
          ) : (
            <DemoMap reports={filtered} selectedId={selected?.id} onSelect={setSelected} />
          )}
        </div>

        {/* Side panel */}
        <div className="overflow-y-auto scrollbar-thin rounded-2xl border border-mist-200 bg-white p-2">
          {selected ? (
            <div className="p-4">
              <div className="flex items-center justify-between">
                <TypeBadge typeId={selected.typeId} />
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-ink-900"><X className="h-4 w-4" /></button>
              </div>
              <p className="mt-3 font-mono text-xs text-slate-400">{selected.referenceId}</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink-900">{selected.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{selected.location?.address}, {selected.location?.city}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={selected.status} />
                <PriorityBadge priority={selected.priority} />
              </div>
              <p className="mt-3 text-sm text-slate-600">{selected.description}</p>
              <p className="mt-3 text-xs text-slate-400">{formatDate(selected.createdAt)}</p>
              <div className="mt-5 space-y-2">
                <Button as={Link} to={`/admin/reports/${selected.referenceId}`} className="w-full">View Full Report</Button>
                <Button as={Link} to={`/admin/reports/${selected.referenceId}`} variant="outline" className="w-full">Assign / Update Status</Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-sm text-slate-400">
              Select a marker on the map to see report details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ label, value, onChange, options, labels = {} }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-mist-200 px-3 py-2 text-sm focus-visible:border-teal-500">
        {options.map((o) => <option key={o} value={o}>{labels[o] ?? o}</option>)}
      </select>
    </div>
  )
}
