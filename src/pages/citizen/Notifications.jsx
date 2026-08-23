import { motion } from 'framer-motion'
import { CheckCircle2, ShieldCheck, ClipboardList, Search, Wrench, Bell } from 'lucide-react'
import EmptyState from '../../components/EmptyState'

const NOTIFICATIONS = [
  { icon: ClipboardList, text: 'Your complaint CIV-2026-004821 has been received.', time: '2 days ago' },
  { icon: ShieldCheck, text: 'Your complaint CIV-2026-004821 has been verified.', time: '2 days ago' },
  { icon: Search, text: 'Your complaint CIV-2026-004821 has been assigned to Infrastructure & Electrical.', time: '1 day ago' },
  { icon: Wrench, text: 'Your complaint CIV-2026-004821 is now being investigated.', time: '18 hours ago' },
  { icon: CheckCircle2, text: 'Your complaint CIV-2026-004617 has been resolved.', time: '5 days ago' },
]

export default function Notifications() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Notifications</h1>
      <p className="mt-1 text-sm text-slate-500">Updates on the reports you've submitted.</p>

      <div className="mt-6 divide-y divide-mist-100 rounded-2xl border border-mist-200 bg-white">
        {NOTIFICATIONS.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Bell} title="No notifications" description="You'll see updates here as your reports move through review." />
          </div>
        ) : (
          NOTIFICATIONS.map((n, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-4 p-4 sm:p-5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-600">
                <n.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-ink-900">{n.text}</p>
                <p className="mt-0.5 text-xs text-slate-400">{n.time}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
