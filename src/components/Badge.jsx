import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/status'

export function StatusBadge({ status, className = '' }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Submitted
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  )
}

export function PriorityBadge({ priority, className = '' }) {
  const c = PRIORITY_COLORS[priority] || PRIORITY_COLORS.Normal
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {priority}
    </span>
  )
}

export function TypeBadge({ typeId, className = '' }) {
  const labels = { community: 'Community', government: 'Government', consumer: 'Consumer' }
  const colors = {
    community: 'bg-teal-500/10 text-teal-600',
    government: 'bg-blue-500/10 text-blue-600',
    consumer: 'bg-navy-800/10 text-navy-800',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colors[typeId] ?? 'bg-slate-100 text-slate-600'} ${className}`}>
      {labels[typeId] ?? typeId}
    </span>
  )
}
