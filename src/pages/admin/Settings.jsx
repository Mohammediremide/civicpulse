import { useState } from 'react'
import { Save, Bell, Lock, Globe } from 'lucide-react'
import Button from '../../components/Button'

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [toggles, setToggles] = useState({ emailAlerts: true, criticalSms: true, weeklyDigest: false, publicMap: true })

  const toggle = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }))

  const onSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Console preferences for this demo environment.</p>

      <form onSubmit={onSave} className="mt-6 space-y-6">
        <section className="rounded-2xl border border-mist-200 bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-ink-900"><Bell className="h-4 w-4 text-teal-600" /> Notifications</h2>
          <div className="mt-4 space-y-3">
            <ToggleRow label="Email alerts for new critical reports" checked={toggles.emailAlerts} onChange={() => toggle('emailAlerts')} />
            <ToggleRow label="SMS alerts for critical priority" checked={toggles.criticalSms} onChange={() => toggle('criticalSms')} />
            <ToggleRow label="Weekly performance digest" checked={toggles.weeklyDigest} onChange={() => toggle('weeklyDigest')} />
          </div>
        </section>

        <section className="rounded-2xl border border-mist-200 bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-ink-900"><Globe className="h-4 w-4 text-teal-600" /> Public Transparency</h2>
          <div className="mt-4 space-y-3">
            <ToggleRow label="Show aggregated stats on public community map" checked={toggles.publicMap} onChange={() => toggle('publicMap')} />
          </div>
        </section>

        <section className="rounded-2xl border border-mist-200 bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-ink-900"><Lock className="h-4 w-4 text-teal-600" /> Security</h2>
          <p className="mt-2 text-sm text-slate-500">This prototype uses a demo authentication service. In production, this section would manage role-based access control, audit logs, and API credentials.</p>
        </section>

        <Button type="submit" icon={Save}>{saved ? 'Saved!' : 'Save settings'}</Button>
      </form>
    </div>
  )
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm text-ink-900">{label}</span>
      <button type="button" onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-teal-500' : 'bg-mist-200'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </label>
  )
}
