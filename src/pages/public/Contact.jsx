import { useState } from 'react'
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react'
import Button from '../../components/Button'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 700)
  }

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">Contact</span>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">Get in touch</h1>
        <p className="mt-2 max-w-xl text-sm text-slate-500">Questions about CivicPulse, partnerships, or feedback on the prototype — reach out below.</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <InfoRow icon={Mail} label="Email" value="hello@civicpulse.ng" />
            <InfoRow icon={Phone} label="Phone" value="+234 800 000 0000" />
            <InfoRow icon={MapPin} label="Based in" value="Lagos, Nigeria" />
          </div>

          <div className="rounded-2xl border border-mist-200 bg-white p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-teal-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink-900">Message received</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">This is a demo form for the prototype — no message was actually sent.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-ink-900">Name</span>
                    <input required className="w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm focus-visible:border-teal-500" placeholder="Your name" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-ink-900">Email</span>
                    <input type="email" required className="w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm focus-visible:border-teal-500" placeholder="you@example.com" />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink-900">Subject</span>
                  <input required className="w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm focus-visible:border-teal-500" placeholder="What's this about?" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink-900">Message</span>
                  <textarea required rows={5} className="w-full resize-none rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm focus-visible:border-teal-500" placeholder="Tell us more…" />
                </label>
                <Button type="submit" className="w-full" size="lg" loading={loading}>Send message</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mist-100 text-navy-800">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 font-medium text-ink-900">{value}</p>
      </div>
    </div>
  )
}
