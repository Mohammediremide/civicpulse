import { useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import Button from '../../components/Button'

const ROLES = ['Citizen', 'Government Staff', 'Department Manager', 'Administrator']

const DEMO_USERS = [
  { name: 'Adaeze Okonkwo', email: 'adaeze.o@example.com', role: 'Citizen', status: 'Active' },
  { name: 'Tunde Bakare', email: 'tunde.b@civicpulse.ng', role: 'Government Staff', status: 'Active' },
  { name: 'Chiamaka Eze', email: 'chiamaka.e@civicpulse.ng', role: 'Department Manager', status: 'Active' },
  { name: 'Admin Demo', email: 'admin@civicpulse.ng', role: 'Administrator', status: 'Active' },
  { name: 'Bolanle Fashola', email: 'bolanle.f@example.com', role: 'Citizen', status: 'Active' },
  { name: 'Ikenna Obi', email: 'ikenna.o@civicpulse.ng', role: 'Government Staff', status: 'Suspended' },
]

const ROLE_COLOR = {
  Citizen: 'bg-mist-100 text-slate-600',
  'Government Staff': 'bg-blue-50 text-status-info',
  'Department Manager': 'bg-teal-50 text-teal-600',
  Administrator: 'bg-navy-900/10 text-navy-900',
}

export default function AdminUsers() {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('All')

  const filtered = DEMO_USERS.filter((u) => {
    if (role !== 'All' && u.role !== role) return false
    if (query && !`${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">Role-based access across citizens and government staff (demo users).</p>
        </div>
        <Button icon={UserPlus}>Invite User</Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users" className="w-full rounded-xl border border-mist-200 bg-white py-2.5 pl-9 pr-3 text-sm focus-visible:border-teal-500" />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-xl border border-mist-200 bg-white px-3 py-2.5 text-sm focus-visible:border-teal-500">
          <option>All</option>
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-mist-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mist-200 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.email} className="border-b border-mist-100 last:border-0">
                <td className="px-4 py-3.5 font-medium text-ink-900">{u.name}</td>
                <td className="px-4 py-3.5 text-slate-500">{u.email}</td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_COLOR[u.role]}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-medium ${u.status === 'Active' ? 'text-status-resolved' : 'text-status-critical'}`}>{u.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
