import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, ArrowRight } from 'lucide-react'
import { classifyComplaint, COMPLAINT_TYPES } from '../../data/taxonomy'
import Button from '../../components/Button'

const EXAMPLES = [
  { type: 'consumer', text: 'My internet provider charged me but my service hasn\u2019t been activated.' },
  { type: 'community', text: 'There is a huge pothole on my street.' },
  { type: 'community', text: 'The drainage beside our road is blocked and flooding is happening.' },
]

export default function ClassifierDemo() {
  const [text, setText] = useState(EXAMPLES[0].text)
  const [typeId, setTypeId] = useState('consumer')
  const [result, setResult] = useState(() => classifyComplaint('consumer', EXAMPLES[0].text))
  const [loading, setLoading] = useState(false)

  const run = (nextText = text, nextType = typeId) => {
    setLoading(true)
    setTimeout(() => {
      setResult(classifyComplaint(nextType, nextText))
      setLoading(false)
    }, 500)
  }

  return (
    <div className="rounded-2xl border border-mist-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-teal-600">
        <Wand2 className="h-3.5 w-3.5" /> Try it — demo routing logic
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {COMPLAINT_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTypeId(t.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              typeId === t.id ? 'bg-navy-900 text-white' : 'bg-mist-100 text-slate-600 hover:bg-mist-200'
            }`}
          >
            {t.short}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="mt-4 w-full resize-none rounded-xl border border-mist-200 bg-mist-50 p-3 text-sm text-ink-900 focus-visible:border-teal-500"
        placeholder="Describe the problem in your own words…"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.text}
            onClick={() => { setText(ex.text); setTypeId(ex.type); run(ex.text, ex.type) }}
            className="rounded-full border border-mist-200 px-3 py-1 text-[11px] text-slate-500 hover:border-teal-500 hover:text-teal-600"
          >
            {ex.text.slice(0, 28)}…
          </button>
        ))}
      </div>

      <Button className="mt-4 w-full" onClick={() => run()} loading={loading} iconRight={ArrowRight}>
        Suggest Category & Authority
      </Button>

      <AnimatePresence mode="wait">
        {result && !loading && (
          <motion.div
            key={result.categoryId + text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-5 rounded-xl bg-mist-50 p-4"
          >
            <Row label="Category" value={COMPLAINT_TYPES.find((t) => t.id === result.typeId)?.label} />
            <Row label="Subcategory" value={result.categoryLabel} />
            <Row label="Suggested Authority" value={result.suggestion?.name ?? 'CivicPulse General Review'} />
            <p className="mt-3 text-[11px] text-slate-400">Demo rule-based routing — not real AI. Architecture is ready for a real classification service.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-mist-200 py-2 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-ink-900">{value}</span>
    </div>
  )
}
