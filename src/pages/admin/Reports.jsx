import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Eye, FileStack } from 'lucide-react'
import { useReports } from '../../hooks/useReports'
import { StatusBadge, PriorityBadge, TypeBadge } from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonTableRow } from '../../components/Skeleton'
import { formatDate } from '../../utils/status'
import { COMPLAINT_TYPES, STATUS_FLOW, PRIORITIES, DEPARTMENTS } from '../../data/taxonomy'

const PAGE_SIZE = 10

export default function AdminReports() {
  const { reports: all, loading, error, refetch } = useReports({ pageSize: 100 })
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All')
  const [status, setStatus] = useState('All')
  const [priority, setPriority] = useState('All')
  const [department, setDepartment] = useState('All')
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = all.filter((r) => {
      if (type !== 'All' && r.typeId !== type) return false
      if (status !== 'All' && r.status !== status) return false
      if (priority !== 'All' && r.priority !== priority) return false
      if (department !== 'All' && r.department !== department) return false
      if (query && !`${r.title} ${r.referenceId} ${r.location?.city}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
    list = [...list].sort((a, b) => (sortDesc ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)))
    return list
  }, [all, type, status, priority, department, query, sortDesc])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const resetPage = (fn) => (v) => { fn(v); setPage(1) }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">{filtered.length} reports match your filters</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-mist-200 bg-white p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => resetPage(setQuery)(e.target.value)} placeholder="Search reference, title, or location" className="w-full rounded-xl border border-mist-200 bg-mist-50 py-2.5 pl-9 pr-3 text-sm focus-visible:border-teal-500" />
        </div>
        <Select value={type} onChange={resetPage(setType)} options={['All', ...COMPLAINT_TYPES.map((t) => t.id)]} labels={{ All: 'All Types', ...Object.fromEntries(COMPLAINT_TYPES.map((t) => [t.id, t.short])) }} />
        <Select value={status} onChange={resetPage(setStatus)} options={['All', ...STATUS_FLOW]} />
        <Select value={priority} onChange={resetPage(setPriority)} options={['All', ...PRIORITIES]} />
        <Select value={department} onChange={resetPage(setDepartment)} options={['All', ...DEPARTMENTS.map((d) => d.name)]} />
        <button onClick={() => setSortDesc((s) => !s)} className="flex items-center gap-1.5 rounded-xl border border-mist-200 px-3 py-2.5 text-sm text-slate-600 hover:bg-mist-50">
          <ArrowUpDown className="h-3.5 w-3.5" /> Date
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-mist-200 bg-white">
        {loading ? (
          <table className="w-full text-sm"><tbody>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} cols={9} />)}
          </tbody></table>
        ) : error ? (
          <div className="p-8"><ErrorState description={error} onRetry={refetch} /></div>
        ) : pageItems.length === 0 ? (
          <div className="p-8">
            <EmptyState icon={FileStack} title="No reports found" description="Try adjusting your filters or search terms." />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-mist-200 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-3 font-medium">Reference</th>
                    <th className="px-4 py-3 font-medium">Issue</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Department</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((r) => (
                    <tr key={r.id} className="border-b border-mist-100 last:border-0 hover:bg-mist-50">
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{r.referenceId}</td>
                      <td className="max-w-[220px] truncate px-4 py-3.5 font-medium text-ink-900">{r.title}</td>
                      <td className="px-4 py-3.5"><TypeBadge typeId={r.typeId} /></td>
                      <td className="px-4 py-3.5 text-slate-500">{r.location?.city}</td>
                      <td className="px-4 py-3.5"><PriorityBadge priority={r.priority} /></td>
                      <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-3.5 text-slate-500">{r.department ?? '—'}</td>
                      <td className="px-4 py-3.5 text-slate-500">{formatDate(r.createdAt)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <Link to={`/admin/reports/${r.referenceId}`} className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700">
                          <Eye className="h-3.5 w-3.5" /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* mobile cards fallback for very small screens is handled by overflow-x-auto above; keep table scrollable */}

            <div className="flex items-center justify-between border-t border-mist-100 px-4 py-3">
              <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="grid h-8 w-8 place-items-center rounded-lg border border-mist-200 text-slate-500 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="grid h-8 w-8 place-items-center rounded-lg border border-mist-200 text-slate-500 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </>
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
