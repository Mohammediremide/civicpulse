import { motion } from 'framer-motion'
import { AlertTriangle, Inbox, Clock } from 'lucide-react'

const NOTIFS = [
  { icon: Inbox, text: '17 new complaints received.', time: '10m ago', tone: 'bg-blue-50 text-status-info' },
  { icon: AlertTriangle, text: '5 critical reports require attention.', time: '32m ago', tone: 'bg-red-50 text-status-critical' },
  { icon: Clock, text: 'Department response target exceeded for Waste Management.', time: '2h ago', tone: 'bg-amber-50 text-status-warning' },
  { icon: Inbox, text: '9 complaints resolved in the last 24 hours.', time: '5h ago', tone: 'bg-emerald-50 text-status-resolved' },
]

export default function AdminNotifications() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Notifications</h1>
      <p className="mt-1 text-sm text-slate-500">System alerts and operational updates.</p>

      <div className="mt-6 divide-y divide-mist-100 rounded-2xl border border-mist-200 bg-white">
        {NOTIFS.map((n, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-4 p-4 sm:p-5">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${n.tone}`}>
              <n.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-ink-900">{n.text}</p>
              <p className="mt-0.5 text-xs text-slate-400">{n.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
