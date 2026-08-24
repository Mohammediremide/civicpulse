import { useEffect, useState } from 'react'
import { Building2, ShieldAlert, Plus, X } from 'lucide-react'
import { listOrganizations, createOrganization } from '../../services/directoryService'
import { useReports } from '../../hooks/useReports'
import { SkeletonCard } from '../../components/Skeleton'
import ErrorState from '../../components/ErrorState'
import EmptyState from '../../components/EmptyState'
import Button from '../../components/Button'

export default function AdminOrganizations() {
  const { reports: all, loading: reportsLoading } = useReports({ type: 'consumer', pageSize: 100 })
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const load = () => {
    setLoading(true)
    setError(null)
    listOrganizations().then(setOrganizations).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const rows = organizations.map((o) => {
    const items = all.filter((r) => r.organization === o.name)
    const resolved = items.filter((r) => ['Resolved', 'Closed'].includes(r.status)).length
    return { ...o, count: items.length, resolved, active: items.length - resolved }
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Organizations</h1>
          <p className="mt-1 text-sm text-slate-500">Businesses and service providers connected to consumer complaint routing.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreate(true)}>Add Organization</Button>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3.5 text-xs text-status-warning">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        Organizations are not publicly labeled based on unverified complaints alone.
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-mist-200 bg-white">
        {loading || reportsLoading ? (
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <SkeletonCard /><SkeletonCard />
          </div>
        ) : error ? (
          <div className="p-6"><ErrorState description={error} onRetry={load} /></div>
        ) : rows.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Building2} title="No organizations yet" description="Add a business or service provider to start routing consumer complaints to them." action={<Button icon={Plus} onClick={() => setShowCreate(true)}>Add Organization</Button>} />
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-mist-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Organization</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Complaints</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-b border-mist-100 last:border-0">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-mist-100 text-navy-800"><Building2 className="h-4 w-4" /></div>
                      <span className="font-medium text-ink-900">{o.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{o.type}</td>
                  <td className="px-4 py-3.5 text-slate-500">{o.count}</td>
                  <td className="px-4 py-3.5 text-slate-500">{o.active}</td>
                  <td className="px-4 py-3.5 text-slate-500">{o.resolved}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateOrgModal onClose={() => setShowCreate(false)} onCreated={(o) => { setOrganizations((list) => [...list, o]); setShowCreate(false) }} />
      )}
    </div>
  )
}

function CreateOrgModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('Business')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const organization = await createOrganization({ name, type })
      onCreated(organization)
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
          <h2 className="font-display text-lg font-semibold text-ink-900">Add an organization</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-ink-900"><X className="h-5 w-5" /></button>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-status-critical">{error}</p>}
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Organization name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lagos Metro Telecom" className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500">
              <option>Business</option>
              <option>Service Provider</option>
              <option>Transport Company</option>
              <option>Government Agency</option>
            </select>
          </label>
          <Button type="submit" className="w-full" loading={submitting}>Add organization</Button>
        </form>
      </div>
    </div>
  )
}
