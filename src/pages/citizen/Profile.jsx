import { useState } from 'react'
import { User, Mail, Phone, Save, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/Button'

export default function Profile() {
  const { session } = useAuth()
  const [form, setForm] = useState({ fullName: session?.fullName ?? '', email: session?.email ?? '', phone: '+234 800 000 0000' })
  const [saved, setSaved] = useState(false)

  const onSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your personal details. Private information is never shown publicly.</p>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-mist-200 bg-white p-6">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-navy-900 text-xl font-semibold text-white">
          {form.fullName?.slice(0, 1) || 'C'}
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">{form.fullName || 'Citizen'}</p>
          <p className="text-sm text-slate-500">{form.email}</p>
        </div>
      </div>

      <form onSubmit={onSave} className="mt-6 space-y-5 rounded-2xl border border-mist-200 bg-white p-6">
        <Field icon={User} label="Full name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
        <Field icon={Mail} label="Email address" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
        <Field icon={Phone} label="Phone number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />

        <div className="flex items-center gap-2 rounded-xl bg-mist-50 p-3 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" /> Your details are only visible to you and authorized CivicPulse staff reviewing your reports.
        </div>

        <Button type="submit" icon={Save}>{saved ? 'Saved!' : 'Save changes'}</Button>
      </form>
    </div>
  )
}

function Field({ icon: Icon, label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-900">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-mist-200 py-2.5 pl-9 pr-3 text-sm focus-visible:border-teal-500" />
      </div>
    </label>
  )
}
