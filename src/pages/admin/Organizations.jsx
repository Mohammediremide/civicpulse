import { Building2, ShieldAlert } from 'lucide-react'
import { ORGANIZATIONS } from '../../data/taxonomy'

export default function AdminOrganizations() {

  const rows = ORGANIZATIONS.map((o, i) => {
    const count = 8 + ((i * 7) % 40)
    const resolved = Math.round(count * (0.5 + (i % 4) * 0.1))
    return { ...o, count, resolved, active: count - resolved, avgResponse: (2 + (i % 5)).toFixed(1) }
  })

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Organizations</h1>
      <p className="mt-1 text-sm text-slate-500">Businesses and service providers connected to consumer complaint routing.</p>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3.5 text-xs text-status-warning">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        Organizations are not publicly labeled based on unverified complaints alone. Figures below reflect demo moderation logic.
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-mist-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mist-200 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Organization</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Complaints</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium">Resolved</th>
              <th className="px-4 py-3 font-medium">Avg. Response</th>
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
                <td className="px-4 py-3.5 text-slate-500">{o.avgResponse} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
