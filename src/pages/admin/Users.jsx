import { useEffect, useState } from 'react'
import { Search, UserPlus, ShieldOff, ShieldCheck, X, Lock } from 'lucide-react'
import Button from '../../components/Button'
import ErrorState from '../../components/ErrorState'
import EmptyState from '../../components/EmptyState'
import { SkeletonTableRow } from '../../components/Skeleton'
import { listUsers, createUser, suspendUser, reactivateUser, changeUserRole } from '../../services/userService'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/status'

const ROLES = ['citizen', 'government_staff', 'department_manager', 'administrator']
const ROLE_LABEL = {
  citizen: 'Citizen',
  government_staff: 'Government Staff',
  department_manager: 'Department Manager',
  administrator: 'Administrator',
}
const ROLE_COLOR = {
  citizen: 'bg-mist-100 text-slate-600',
  government_staff: 'bg-blue-50 text-status-info',
  department_manager: 'bg-teal-50 text-teal-600',
  administrator: 'bg-navy-900/10 text-navy-900',
}

export default function AdminUsers() {
  const { session, isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md py-16">
        <EmptyState icon={Lock} title="Administrators only" description="User management is restricted to full administrators. Contact one if you need a role changed or an account suspended." />
      </div>
    )
  }

  return <UsersManager session={session} />
}

function UsersManager({ session }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('All')
  const [showCreate, setShowCreate] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [toast, setToast] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    listUsers({ role, q: query || undefined })
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [role])

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200) }

  const onToggleSuspend = async (u) => {
    setBusyId(u.id)
    try {
      const updated = u.suspended ? await reactivateUser(u.id) : await suspendUser(u.id)
      setUsers((list) => list.map((x) => (x.id === u.id ? updated : x)))
      flash(u.suspended ? `${u.fullName} reactivated` : `${u.fullName} suspended`)
    } catch (e) {
      flash(e.message)
    } finally {
      setBusyId(null)
    }
  }

  const onRoleChange = async (u, newRole) => {
    setBusyId(u.id)
    try {
      const updated = await changeUserRole(u.id, newRole)
      setUsers((list) => list.map((x) => (x.id === u.id ? updated : x)))
      flash(`${u.fullName} is now ${ROLE_LABEL[newRole]}`)
    } catch (e) {
      flash(e.message)
    } finally {
      setBusyId(null)
    }
  }

  const filtered = users.filter((u) => !query || `${u.fullName} ${u.email}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">Role-based access across citizens, government staff, and administrators.</p>
        </div>
        <Button icon={UserPlus} onClick={() => setShowCreate(true)}>Add User</Button>
      </div>

      {toast && <div className="fixed right-6 top-20 z-50 rounded-xl bg-navy-950 px-4 py-2.5 text-sm text-white shadow-lg">{toast}</div>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} placeholder="Search users" className="w-full rounded-xl border border-mist-200 bg-white py-2.5 pl-9 pr-3 text-sm focus-visible:border-teal-500" />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-xl border border-mist-200 bg-white px-3 py-2.5 text-sm focus-visible:border-teal-500">
          <option value="All">All</option>
          {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-mist-200 bg-white">
        {loading ? (
          <table className="w-full text-sm"><tbody>{Array.from({ length: 4 }).map((_, i) => <SkeletonTableRow key={i} cols={5} />)}</tbody></table>
        ) : error ? (
          <div className="p-6"><ErrorState description={error} onRetry={load} /></div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-mist-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-mist-100 last:border-0">
                  <td className="px-4 py-3.5 font-medium text-ink-900">{u.fullName}{u.id === session?.id && <span className="ml-1.5 text-xs text-slate-400">(you)</span>}</td>
                  <td className="px-4 py-3.5 text-slate-500">{u.email}</td>
                  <td className="px-4 py-3.5">
                    <select
                      value={u.role}
                      disabled={busyId === u.id || u.id === session?.id}
                      onChange={(e) => onRoleChange(u, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${ROLE_COLOR[u.role]} disabled:opacity-60`}
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium ${u.suspended ? 'text-status-critical' : 'text-status-resolved'}`}>
                      {u.suspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => onToggleSuspend(u)}
                      disabled={busyId === u.id || u.id === session?.id}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium disabled:opacity-40 ${u.suspended ? 'text-status-resolved hover:bg-emerald-50' : 'text-status-critical hover:bg-red-50'}`}
                    >
                      {u.suspended ? <><ShieldCheck className="h-3.5 w-3.5" /> Reactivate</> : <><ShieldOff className="h-3.5 w-3.5" /> Suspend</>}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No users match your search.</td></tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={(u) => { setUsers((list) => [u, ...list]); setShowCreate(false); flash(`${u.fullName} added`) }}
        />
      )}
    </div>
  )
}

function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', role: 'government_staff' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await createUser(form)
      onCreated(user)
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
          <h2 className="font-display text-lg font-semibold text-ink-900">Add a user</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-ink-900"><X className="h-5 w-5" /></button>
        </div>

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-status-critical">{error}</p>}

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Full name</span>
            <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Email</span>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Phone (optional)</span>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Temporary password</span>
            <input required type="text" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
            <span className="mt-1 block text-xs text-slate-400">Share this with them directly — there's no invite email yet.</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Role</span>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500">
              {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
          </label>
          <Button type="submit" className="w-full" loading={submitting}>Create account</Button>
        </form>
      </div>
    </div>
  )
}
