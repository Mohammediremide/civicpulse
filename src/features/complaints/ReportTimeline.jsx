import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { formatDateTime } from '../../utils/status'

export default function ReportTimeline({ timeline = [] }) {
  return (
    <ol className="relative border-l border-mist-200 pl-6">
      {timeline.map((step, i) => (
        <motion.li
          key={step.status + step.timestamp}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="mb-7 last:mb-0"
        >
          <span className="absolute -left-[11px] grid h-5 w-5 place-items-center rounded-full bg-teal-500 text-white ring-4 ring-white">
            <Check className="h-3 w-3" />
          </span>
          <p className="font-display text-sm font-semibold text-ink-900">{step.status}</p>
          <p className="mt-0.5 text-xs text-slate-400">{formatDateTime(step.timestamp)}</p>
          <p className="mt-1.5 text-sm text-slate-600">{step.note}</p>
        </motion.li>
      ))}
    </ol>
  )
}
