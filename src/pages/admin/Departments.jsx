import { useEffect, useState } from 'react'
import { Landmark, ArrowUpRight, Plus, X, Trash2 } from 'lucide-react'
import { useReports } from '../../hooks/useReports'
import { listDepartments, createDepartment, deleteDepartment } from '../../services/directoryService'
import { SkeletonCard } from '../../components/Skeleton'
import ErrorState from '../../components/ErrorState'
import FlipCard from '../../components/FlipCard'
import Button from '../../components/Button'
import { StatusBadge } from '../../components/Badge'
import { formatDate } from '../../utils/status'

export default function AdminDepartments() {
  const { reports: all, loading: reportsLoading, error: reportsError, refetch } = useReports({ pageSize: 100 })
  const [departments, setDepartments] = useState([])
  const [deptLoading, setDeptLoading] = useState(true)
  const [deptError, setDeptError] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const onDelete = async (dept) => {
    if (!confirm(`Remove "${dept.name}"? Reports already assigned to it will keep the name but won't be re-assignable to it going forward.`)) return
    setDeletingId(dept.id)
    try {
      await deleteDepartment(dept.id)
      setDepartments((list) => list.filter((d) => d.id !== dept.id))
    } catch (e) {
      alert(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  const loadDepartments = () => {
    setDeptLoading(true)
    setDeptError(null)
    listDepartments().then(setDepartments).catch((e) => setDeptError(e.message)).finally(() => setDeptLoading(false))
  }

  useEffect(loadDepartments, [])

  const loading = reportsLoading || deptLoading
  const error = reportsError || deptError

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
        <div className="mt-6"><ErrorState description={error} onRetry={() => { loadDepartments(); refetch() }} /></div>
      </div>
    )
  }

  const rows = departments.map((d) => {
    const items = all.filter((r) => r.department === d.name)
    const resolved = items.filter((r) => ['Resolved', 'Closed'].includes(r.status)).length
    const active = items.length - resolved
    const rate = items.length ? Math.round((resolved / items.length) * 100) : 0
    const recent = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
    return { ...d, received: items.length, active, resolved, rate, recent }
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Departments</h1>
          <p className="mt-1 text-sm text-slate-500">Government departments handling assigned complaints. Hover or tap a card for recent activity.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreate(true)}>Add Department</Button>
      </div>

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
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-ink-900">{d.name}</p>
                    <p className="truncate text-xs text-slate-400">{d.lead || 'No lead assigned'}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(d) }}
                    disabled={deletingId === d.id}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-status-critical disabled:opacity-40"
                    aria-label={`Delete ${d.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
        {rows.length === 0 && (
          <p className="col-span-full text-sm text-slate-400">No departments yet. Add one to get started.</p>
        )}
      </div>

      {showCreate && (
        <CreateDepartmentModal
          onClose={() => setShowCreate(false)}
          onCreated={(d) => { setDepartments((list) => [...list, d].sort((a, b) => a.name.localeCompare(b.name))); setShowCreate(false) }}
        />
      )}
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

function CreateDepartmentModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [lead, setLead] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const department = await createDepartment({ name, lead })
      onCreated(department)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900">Add a department</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-ink-900"><X className="h-5 w-5" /></button>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-status-critical">{error}</p>}
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Department name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Urban Planning" className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Lead (optional)</span>
            <input value={lead} onChange={(e) => setLead(e.target.value)} placeholder="e.g. Eng. Ada Bello" className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
          </label>
          <Button type="submit" className="w-full" loading={submitting}>Add department</Button>
        </form>
      </div>
    </div>
  )
}
