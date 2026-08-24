import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'
import Logo from '../../components/Logo'
import Button from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'

function strengthOf(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const STRENGTH_LABEL = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLOR = ['bg-mist-200', 'bg-status-critical', 'bg-status-high', 'bg-status-warning', 'bg-status-resolved']

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  const strength = strengthOf(form.password)

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (!/^[0-9+\s-]{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      await signup(form)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <Link to="/" className="mb-10 inline-block w-fit"><Logo /></Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Report and track community, government, and consumer complaints in one place.</p>

          {apiError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-status-critical">{apiError}</p>}

          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            <Field label="Full name" error={errors.fullName}>
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass(errors.fullName)} placeholder="Amaka Johnson" autoComplete="name" />
            </Field>
            <Field label="Email address" error={errors.email}>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass(errors.email)} placeholder="you@example.com" autoComplete="email" />
            </Field>
            <Field label="Phone number" error={errors.phone}>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass(errors.phone)} placeholder="+234 800 000 0000" autoComplete="tel" />
            </Field>
            <Field label="Password" error={errors.password}>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass(errors.password) + ' pr-10'} placeholder="Create a password" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink-900" aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex h-1.5 gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className={`flex-1 rounded-full ${i < strength ? STRENGTH_COLOR[strength] : 'bg-mist-200'}`} />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{STRENGTH_LABEL[strength]}</p>
                </div>
              )}
            </Field>
            <Field label="Confirm password" error={errors.confirm}>
              <input type={showPw ? 'text' : 'password'} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={inputClass(errors.confirm)} placeholder="Re-enter your password" autoComplete="new-password" />
            </Field>

            <Button type="submit" className="w-full" size="lg" loading={submitting} iconRight={ArrowRight}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-medium text-teal-600 hover:text-teal-700">Log in</Link>
          </p>
        </motion.div>
      </div>

      <div className="relative hidden overflow-hidden bg-navy-950 grain-noise lg:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,199,181,0.18),transparent_45%)]" />
        <div className="flex h-full flex-col justify-center px-16">
          <ShieldCheck className="h-10 w-10 text-teal-400" />
          <h2 className="mt-6 font-display text-3xl font-semibold text-white">Your reports, transparently tracked.</h2>
          <ul className="mt-8 space-y-4">
            {['Every report gets a trackable reference number', 'Real-time status timeline from submission to resolution', 'Your private details are never shown publicly'].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function inputClass(error) {
  return `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-slate-400 focus-visible:border-teal-500 ${error ? 'border-status-critical' : 'border-mist-200'}`
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-900">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-status-critical">{error}</span>}
    </label>
  )
}
