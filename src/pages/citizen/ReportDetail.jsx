import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, FileText, Image as ImageIcon, Video, Copy } from 'lucide-react'
import { useState } from 'react'
import { getDuplicateCandidates } from '../../services/reportService'
import { useReport, useReports } from '../../hooks/useReports'
import { StatusBadge, PriorityBadge, TypeBadge } from '../../components/Badge'
import ReportTimeline from '../../features/complaints/ReportTimeline'
import DemoMap from '../../components/DemoMap'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonBlock } from '../../components/Skeleton'
import { formatDate } from '../../utils/status'

export default function ReportDetail() {
  const { id } = useParams()
  const { report, loading, error } = useReport(id)
  const { reports: nearby } = useReports({ pageSize: 100 })
  const [copied, setCopied] = useState(false)

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <SkeletonBlock className="h-8 w-40" />
        <SkeletonBlock className="h-96 w-full" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <EmptyState icon={FileText} title="Report not found" description="We couldn't find a report with that reference. Double-check the link or reference number." />
      </div>
    )
  }

  const duplicates = getDuplicateCandidates(report, nearby)
  const iconFor = (type) => (type === 'video' ? Video : type === 'photo' ? ImageIcon : FileText)

  const copy = () => {
    navigator.clipboard?.writeText(report.referenceId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/reports" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to reports
      </Link>

      <div className="mt-4 rounded-2xl border border-mist-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TypeBadge typeId={report.typeId} />
              <button onClick={copy} className="flex items-center gap-1 font-mono text-xs text-slate-400 hover:text-teal-600">
                {report.referenceId} <Copy className="h-3 w-3" />
              </button>
              {copied && <span className="text-xs text-teal-600">Copied</span>}
            </div>
            <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900">{report.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{report.categoryLabel}</p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={report.status} />
            <PriorityBadge priority={report.priority} />
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-slate-600">{report.description}</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-900">
              <MapPin className="h-4 w-4 text-slate-400" /> {report.location?.address}, {report.location?.city}, {report.location?.state}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Department</h3>
            <p className="mt-1.5 text-sm text-ink-900">{report.department ?? 'Pending assignment'}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Date reported</h3>
            <p className="mt-1.5 text-sm text-ink-900">{formatDate(report.createdAt)}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Reporter</h3>
            <p className="mt-1.5 text-sm text-ink-900">{report.reporterDisplayName ?? 'Demo Citizen'} <span className="text-slate-400">(private details withheld)</span></p>
          </div>
        </div>

        {report.location?.lat && (
          <div className="mt-6 h-64">
            <DemoMap reports={[report]} selectedId={report.id} height="h-64" />
          </div>
        )}

        {report.evidence?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Evidence</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {report.evidence.map((e, i) => {
                const Icon = iconFor(e.type)
                return (
                  <span key={i} className="flex items-center gap-1.5 rounded-lg border border-mist-200 px-3 py-1.5 text-xs text-slate-600">
                    <Icon className="h-3.5 w-3.5 text-slate-400" /> {e.name}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {duplicates.length > 0 && (
          <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-status-warning">
            {duplicates.length} similar report{duplicates.length > 1 ? 's' : ''} detected within 1.2 km — demo duplicate-detection logic.
          </div>
        )}

        <div className="mt-8 border-t border-mist-100 pt-6">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Status Timeline</h3>
          <ReportTimeline timeline={report.timeline} />
        </div>
      </div>
    </div>
  )
}
