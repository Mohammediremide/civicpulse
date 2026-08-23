import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPinned, Landmark, ShoppingBag, ChevronLeft, ChevronRight, MapPin, Search,
  Upload, X, FileText, Image as ImageIcon, Video, CheckCircle2, Copy,
} from 'lucide-react'
import Button from '../../components/Button'
import DemoMap from '../../components/DemoMap'
import { COMPLAINT_TYPES, CATEGORIES, PRIORITIES, classifyComplaint } from '../../data/taxonomy'
import { submitReport, geocodeAddress } from '../../services/reportService'

const TYPE_ICONS = { community: MapPinned, government: Landmark, consumer: ShoppingBag }
const STEP_LABELS = ['Type', 'Category', 'Describe', 'Location', 'Evidence', 'Review']

export default function ReportIssue() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [form, setForm] = useState({
    typeId: '',
    categoryId: '',
    title: '',
    description: '',
    priority: 'Medium',
    location: { address: '', city: '', state: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },
    evidence: [],
  })

  const canNext = () => {
    if (step === 0) return !!form.typeId
    if (step === 1) return !!form.categoryId
    if (step === 2) return form.title.trim().length > 3 && form.description.trim().length > 8
    if (step === 3) return form.location.address.trim() && form.location.city.trim()
    return true
  }

  const next = () => setStep((s) => Math.min(5, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  const onSubmit = async () => {
    setSubmitting(true)
    const report = await submitReport(form)
    setSubmitting(false)
    setSubmitted(report)
  }

  if (submitted) return <SuccessScreen report={submitted} onDone={() => navigate(`/reports/${submitted.referenceId}`)} />

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Report an issue</h1>
      <p className="mt-1 text-sm text-slate-500">Step {step + 1} of 6 — {STEP_LABELS[step]}</p>

      <div className="mt-5 flex gap-1.5">
        {STEP_LABELS.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-teal-500' : 'bg-mist-200'}`} />
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-mist-200 bg-white p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            {step === 0 && <StepType form={form} setForm={setForm} />}
            {step === 1 && <StepCategory form={form} setForm={setForm} />}
            {step === 2 && <StepDescribe form={form} setForm={setForm} />}
            {step === 3 && <StepLocation form={form} setForm={setForm} />}
            {step === 4 && <StepEvidence form={form} setForm={setForm} />}
            {step === 5 && <StepReview form={form} />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between border-t border-mist-100 pt-6">
          <Button variant="ghost" onClick={back} disabled={step === 0} icon={ChevronLeft}>Back</Button>
          {step < 5 ? (
            <Button onClick={next} disabled={!canNext()} iconRight={ChevronRight}>Continue</Button>
          ) : (
            <Button onClick={onSubmit} loading={submitting} iconRight={ChevronRight}>Submit Report</Button>
          )}
        </div>
      </div>
    </div>
  )
}

function StepType({ form, setForm }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink-900">What would you like to report?</h2>
      <div className="mt-5 grid gap-3">
        {COMPLAINT_TYPES.map((t) => {
          const Icon = TYPE_ICONS[t.id]
          const active = form.typeId === t.id
          return (
            <button
              key={t.id}
              onClick={() => setForm({ ...form, typeId: t.id, categoryId: '' })}
              className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-colors ${active ? 'border-teal-500 bg-teal-50/60' : 'border-mist-200 hover:border-mist-300'}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-teal-500 text-white' : 'bg-mist-100 text-navy-800'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-ink-900">{t.label}</p>
                <p className="mt-0.5 text-sm text-slate-500">{t.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepCategory({ form, setForm }) {
  const cats = CATEGORIES[form.typeId] || []
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink-900">Choose a category</h2>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {cats.map((c) => (
          <button
            key={c.id}
            onClick={() => setForm({ ...form, categoryId: c.id })}
            className={`rounded-xl border p-3.5 text-left text-sm font-medium transition-colors ${form.categoryId === c.id ? 'border-teal-500 bg-teal-50/60 text-teal-700' : 'border-mist-200 text-ink-900 hover:border-mist-300'}`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function StepDescribe({ form, setForm }) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-lg font-semibold text-ink-900">Describe the problem</h2>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Title</span>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Short summary, e.g. Broken streetlight on Allen Avenue" className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Description</span>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} placeholder="Describe what's wrong, when you noticed it, and any relevant details…" className="w-full resize-none rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Urgency</span>
        <div className="flex flex-wrap gap-2">
          {PRIORITIES.map((p) => (
            <button key={p} onClick={() => setForm({ ...form, priority: p })} type="button" className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${form.priority === p ? 'bg-navy-900 text-white' : 'bg-mist-100 text-slate-600 hover:bg-mist-200'}`}>
              {p}
            </button>
          ))}
        </div>
      </label>
    </div>
  )
}

function StepLocation({ form, setForm }) {
  const loc = form.location
  const update = (patch) => setForm({ ...form, location: { ...loc, ...patch } })
  const [query, setQuery] = useState(loc.address || '')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 3) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const found = await geocodeAddress(query)
        setResults(found)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  const pickResult = (r) => {
    update({ address: r.address, city: r.city, state: r.state || 'Lagos', country: r.country || 'Nigeria', lat: r.lat, lng: r.lng })
    setQuery(r.formatted)
    setResults([])
  }

  const previewReport = loc.lat && loc.lng ? [{ id: 'preview', location: loc, status: 'Submitted', priority: 'Medium' }] : []

  return (
    <div className="space-y-5">
      <h2 className="font-display text-lg font-semibold text-ink-900">Where is this happening?</h2>

      <div className="relative">
        <label className="mb-1.5 block text-sm font-medium text-ink-900">Search for an address</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Start typing an address in Nigeria…"
            className="w-full rounded-xl border border-mist-200 py-2.5 pl-9 pr-3 text-sm focus-visible:border-teal-500"
          />
        </div>
        {(results.length > 0 || searching) && (
          <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-mist-200 bg-white shadow-lg">
            {searching && <p className="px-3 py-2.5 text-xs text-slate-400">Searching…</p>}
            {!searching && results.map((r, i) => (
              <button key={i} type="button" onClick={() => pickResult(r)} className="block w-full px-3 py-2.5 text-left text-sm text-ink-900 hover:bg-mist-50">
                {r.formatted}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-48 overflow-hidden rounded-xl">
        {previewReport.length > 0 ? (
          <DemoMap reports={previewReport} selectedId="preview" height="h-48" />
        ) : (
          <div className="flex h-48 items-center justify-center gap-2 rounded-xl border border-dashed border-mist-300 bg-mist-50 text-sm text-slate-400">
            <MapPin className="h-4 w-4" /> Search an address above to place it on the map
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-ink-900">Street address</span>
          <input value={loc.address} onChange={(e) => update({ address: e.target.value })} placeholder="e.g. Allen Avenue" className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-900">City</span>
          <input value={loc.city} onChange={(e) => update({ city: e.target.value })} placeholder="e.g. Ikeja" className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-900">State</span>
          <input value={loc.state} onChange={(e) => update({ state: e.target.value })} className="w-full rounded-xl border border-mist-200 px-3.5 py-2.5 text-sm focus-visible:border-teal-500" />
        </label>
      </div>
    </div>
  )
}

function StepEvidence({ form, setForm }) {
  const onFiles = (e) => {
    const files = Array.from(e.target.files || []).map((f) => ({ name: f.name, type: f.type.startsWith('video') ? 'video' : f.type.startsWith('image') ? 'photo' : 'document' }))
    setForm({ ...form, evidence: [...form.evidence, ...files] })
  }
  const remove = (idx) => setForm({ ...form, evidence: form.evidence.filter((_, i) => i !== idx) })
  const iconFor = (type) => (type === 'video' ? Video : type === 'photo' ? ImageIcon : FileText)

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink-900">Upload evidence</h2>
      <p className="mt-1 text-sm text-slate-500">Photos, videos, screenshots, receipts, or documents. Optional but helpful.</p>
      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-mist-300 bg-mist-50 py-10 text-center hover:border-teal-400">
        <Upload className="h-6 w-6 text-slate-400" />
        <span className="text-sm font-medium text-ink-900">Click to upload files</span>
        <span className="text-xs text-slate-400">Demo upload — files stay on your device</span>
        <input type="file" multiple className="hidden" onChange={onFiles} />
      </label>
      {form.evidence.length > 0 && (
        <ul className="mt-4 space-y-2">
          {form.evidence.map((f, i) => {
            const Icon = iconFor(f.type)
            return (
              <li key={i} className="flex items-center justify-between rounded-lg border border-mist-200 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-ink-900"><Icon className="h-4 w-4 text-slate-400" /> {f.name}</span>
                <button onClick={() => remove(i)} className="text-slate-400 hover:text-status-critical" aria-label="Remove file"><X className="h-4 w-4" /></button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function StepReview({ form }) {
  const classification = classifyComplaint(form.typeId, form.description)
  const typeLabel = COMPLAINT_TYPES.find((t) => t.id === form.typeId)?.label
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink-900">Review and submit</h2>
      <div className="mt-5 space-y-4 rounded-xl bg-mist-50 p-4">
        <ReviewRow label="Type" value={typeLabel} />
        <ReviewRow label="Category" value={classification.categoryLabel} />
        <ReviewRow label="Title" value={form.title} />
        <ReviewRow label="Description" value={form.description} multiline />
        <ReviewRow label="Location" value={`${form.location.address}, ${form.location.city}, ${form.location.state}`} />
        <ReviewRow label="Urgency" value={form.priority} />
        <ReviewRow label="Evidence" value={form.evidence.length ? `${form.evidence.length} file(s) attached` : 'None attached'} />
        {classification.suggestion && <ReviewRow label="Suggested Authority" value={classification.suggestion.name} />}
      </div>
      <p className="mt-4 text-xs text-slate-400">By submitting, you confirm this report reflects a real issue to the best of your knowledge. This is a demo submission and is stored only in your browser.</p>
    </div>
  )
}

function ReviewRow({ label, value, multiline }) {
  return (
    <div className={multiline ? '' : 'flex items-center justify-between gap-4'}>
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
      <p className={`text-sm font-medium text-ink-900 ${multiline ? 'mt-1' : 'text-right'}`}>{value}</p>
    </div>
  )
}

function SuccessScreen({ report, onDone }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(report.referenceId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-600">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Report submitted</h1>
      <p className="mt-2 text-sm text-slate-500">Your reference number has been generated. Save it to track this complaint.</p>
      <button onClick={copy} className="mx-auto mt-6 flex items-center gap-2 rounded-xl border border-mist-200 bg-white px-5 py-3 font-mono text-lg font-semibold text-navy-900 hover:border-teal-500">
        {report.referenceId} <Copy className="h-4 w-4 text-slate-400" />
      </button>
      {copied && <p className="mt-2 text-xs text-teal-600">Copied to clipboard</p>}
      <Button className="mt-8 w-full" onClick={onDone} size="lg">Track Your Complaint</Button>
    </motion.div>
  )
}
