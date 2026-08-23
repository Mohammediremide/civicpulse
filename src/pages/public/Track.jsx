import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import Button from '../../components/Button'
import ErrorState from '../../components/ErrorState'
import { getReport } from '../../services/reportService'
import ReportTimeline from '../../features/complaints/ReportTimeline'
import { StatusBadge, PriorityBadge, TypeBadge } from '../../components/Badge'

export default function Track() {
  const [params] = useSearchParams()
  const [ref, setRef] = useState(params.get('ref') || '')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const found = await getReport(ref.trim())
    setResult(found ?? null)
    setSearched(true)
    setLoading(false)
  }

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-2xl px-5 py-16 text-center lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">Track Your Complaint</span>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">Enter your reference number</h1>
        <p className="mt-2 text-sm text-slate-500">Reference numbers look like <span className="font-mono">CIV-2026-004821</span></p>

        <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="CIV-2026-004821" className="w-full rounded-xl border border-mist-200 bg-white py-3 pl-9 pr-3 text-sm font-mono focus-visible:border-teal-500" />
          </div>
          <Button type="submit" iconRight={ArrowRight} loading={loading}>Track</Button>
        </form>

        <button onClick={() => setRef('CIV-2026-004821')} className="mt-3 text-xs text-slate-400 hover:text-teal-600">
          Try demo reference: CIV-2026-004821
        </button>
      </div>

      {searched && (
        <div className="mx-auto max-w-2xl px-5 pb-20 lg:px-8">
          {result ? (
            <div className="rounded-2xl border border-mist-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-xs text-slate-400">{result.referenceId}</span>
                <TypeBadge typeId={result.typeId} />
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold text-ink-900">{result.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{result.location?.city}, {result.location?.state}</p>
              <div className="mt-4 flex gap-2">
                <StatusBadge status={result.status} />
                <PriorityBadge priority={result.priority} />
              </div>
              <div className="mt-8">
                <ReportTimeline timeline={result.timeline} />
              </div>
              <Button variant="outline" className="mt-8 w-full" onClick={() => navigate(`/reports/${result.referenceId}`)}>
                View full report
              </Button>
            </div>
          ) : (
            <ErrorState title="Reference number not found" description="Double-check the reference number and try again." onRetry={() => setSearched(false)} />
          )}
        </div>
      )}
    </div>
  )
}
