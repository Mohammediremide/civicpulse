export const PRIORITY_COLORS = {
  Normal: { bg: 'bg-blue-50', text: 'text-status-info', dot: 'bg-status-info', ring: 'ring-blue-100' },
  Medium: { bg: 'bg-amber-50', text: 'text-status-warning', dot: 'bg-status-warning', ring: 'ring-amber-100' },
  High: { bg: 'bg-orange-50', text: 'text-status-high', dot: 'bg-status-high', ring: 'ring-orange-100' },
  Critical: { bg: 'bg-red-50', text: 'text-status-critical', dot: 'bg-status-critical', ring: 'ring-red-100' },
}

export const STATUS_COLORS = {
  Submitted: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  Received: { bg: 'bg-blue-50', text: 'text-status-info', dot: 'bg-status-info' },
  'Under Review': { bg: 'bg-amber-50', text: 'text-status-warning', dot: 'bg-status-warning' },
  Verified: { bg: 'bg-blue-50', text: 'text-status-info', dot: 'bg-status-info' },
  Assigned: { bg: 'bg-blue-50', text: 'text-status-info', dot: 'bg-status-info' },
  Investigation: { bg: 'bg-orange-50', text: 'text-status-high', dot: 'bg-status-high' },
  'In Progress': { bg: 'bg-orange-50', text: 'text-status-high', dot: 'bg-status-high' },
  Resolved: { bg: 'bg-emerald-50', text: 'text-status-resolved', dot: 'bg-status-resolved' },
  Closed: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
}

export const MARKER_COLORS = {
  Critical: '#d92d20',
  High: '#e0670f',
  Medium: '#ca9500',
  Normal: '#2563eb',
  Resolved: '#17a34a',
}

export function markerColorFor(report) {
  if (report.status === 'Resolved' || report.status === 'Closed') return MARKER_COLORS.Resolved
  return MARKER_COLORS[report.priority] ?? MARKER_COLORS.Normal
}

export function formatDate(iso, opts = {}) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', ...opts,
  })
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}
