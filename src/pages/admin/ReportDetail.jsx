import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Flag, MessageSquarePlus, CheckCircle2, Lock, FileText, Image as ImageIcon, Video } from 'lucide-react'
import { useReport } from '../../hooks/useReports'
import {
  verifyReport, assignDepartment, changePriority, changeStatus, addUpdateNote,
} from '../../services/reportService'
import { StatusBadge, PriorityBadge, TypeBadge } from '../../components/Badge'
import ReportTimeline from '../../features/complaints/ReportTimeline'
import DemoMap from '../../components/DemoMap'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import Button from '../../components/Button'
import { SkeletonBlock } from '../../components/Skeleton'
import { formatDate } from '../../utils/status'
import { DEPARTMENTS, STATUS_FLOW, PRIORITIES } from '../../data/taxonomy'

export default function AdminReportDetail() {
  const { id } = useParams()
  const { report, setReport, loading, error } = useReport(id)
  const [note, setNote] = useState('')
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <SkeletonBlock className="h-8 w-40" />
        <SkeletonBlock className="h-96 w-full" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <EmptyState icon={FileText} title="Report not found" description="This reference number doesn't match any report." />
      </div>
    )
  }

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000) }
  const iconFor = (type) => (type === 'video' ? Video : type === 'photo' ? ImageIcon : FileText)

  const runAction = async (action, successMsg) => {
    setBusy(true)
    try {
      const updated = await action()
      setReport(updated)
      flash(successMsg)
    } catch (err) {
      flash(err.message || 'Action failed')
    } finally {
      setBusy(false)
    }
  }

  const verify = () => runAction(() => verifyReport(report.referenceId), 'Report verified')
  const assign = (deptName) => runAction(() => assignDepartment(report.referenceId, deptName), `Assigned to ${deptName}`)
  const setPriority = (p) => runAction(() => changePriority(report.referenceId, p), `Priority set to ${p}`)
  const setStatus = (s) => runAction(() => changeStatus(report.referenceId, s), `Status set to ${s}`)
  const resolveIt = () => runAction(() => changeStatus(report.referenceId, 'Resolved'), 'Marked resolved')
  const closeIt = () => runAction(() => changeStatus(report.referenceId, 'Closed'), 'Report closed')
  const addUpdate = () => {
    if (!note.trim()) return
    runAction(() => addUpdateNote(report.referenceId, note), 'Update added')
    setNote('')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/admin/reports" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to reports
      </Link>

      {toast && (
        <div className="fixed right-6 top-20 z-50 rounded-xl bg-navy-950 px-4 py-2.5 text-sm text-white shadow-lg">{toast}</div>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-mist-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TypeBadge typeId={report.typeId} />
                <span className="font-mono text-xs text-slate-400">{report.referenceId}</span>
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
              <p className="mt-1.5 text-sm text-ink-900">{report.location?.address}, {report.location?.city}, {report.location?.state}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Reporter</h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-900"><Lock className="h-3.5 w-3.5 text-slate-400" /> {report.reporterDisplayName ?? 'Access-restricted'}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Department</h3>
              <p className="mt-1.5 text-sm text-ink-900">{report.department ?? 'Not yet assigned'}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Date reported</h3>
              <p className="mt-1.5 text-sm text-ink-900">{formatDate(report.createdAt)}</p>
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
                  return <span key={i} className="flex items-center gap-1.5 rounded-lg border border-mist-200 px-3 py-1.5 text-xs text-slate-600"><Icon className="h-3.5 w-3.5 text-slate-400" /> {e.name}</span>
                })}
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-mist-100 pt-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Status Timeline</h3>
            <ReportTimeline timeline={report.timeline} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-mist-200 bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink-900">Actions</h3>
            <div className="mt-4 space-y-2.5">
              <Button variant="outline" className="w-full justify-start" icon={ShieldCheck} onClick={verify} disabled={busy}>Verify Report</Button>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Assign Department</label>
                <select onChange={(e) => e.target.value && assign(e.target.value)} defaultValue="" disabled={busy} className="w-full rounded-xl border border-mist-200 px-3 py-2.5 text-sm focus-visible:border-teal-500">
                  <option value="" disabled>Select department…</option>
                  {DEPARTMENTS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Change Priority</label>
                <div className="flex flex-wrap gap-1.5">
                  {PRIORITIES.map((p) => (
                    <button key={p} disabled={busy} onClick={() => setPriority(p)} className={`rounded-full px-3 py-1 text-xs font-medium ${report.priority === p ? 'bg-navy-900 text-white' : 'bg-mist-100 text-slate-600 hover:bg-mist-200'}`}>{p}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Change Status</label>
                <select onChange={(e) => e.target.value && setStatus(e.target.value)} defaultValue="" disabled={busy} className="w-full rounded-xl border border-mist-200 px-3 py-2.5 text-sm focus-visible:border-teal-500">
                  <option value="" disabled>Select status…</option>
                  {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <Button variant="primary" className="w-full justify-start" icon={CheckCircle2} onClick={resolveIt} disabled={busy}>Resolve</Button>
              <Button variant="ghost" className="w-full justify-start" icon={Flag} onClick={closeIt} disabled={busy}>Close Report</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-mist-200 bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink-900">Add Update</h3>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Add a note visible in the timeline…" className="mt-3 w-full resize-none rounded-xl border border-mist-200 px-3 py-2.5 text-sm focus-visible:border-teal-500" />
            <Button className="mt-3 w-full" icon={MessageSquarePlus} onClick={addUpdate} disabled={busy}>Post Update</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
