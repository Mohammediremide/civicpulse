import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Radar } from 'lucide-react'
import Logo from '../../components/Logo'
import Button from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const session = await login({ email, password, remember })
      const isStaff = ['administrator', 'government_staff', 'department_manager'].includes(session.role)
      const roleHome = isStaff ? '/admin' : '/dashboard'
      const from = location.state?.from
      // Only honor the "came from" redirect if it actually belongs to this
      // role — otherwise a citizen's stale redirect could send an admin
      // login back to the citizen dashboard, or vice versa.
      const fromMatchesRole = from && (isStaff ? from.startsWith('/admin') : !from.startsWith('/admin'))
      navigate(fromMatchesRole ? from : roleHome)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-950 grain-noise lg:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(30,95,224,0.22),transparent_45%)]" />
        <div className="flex h-full flex-col justify-center px-16">
          <Radar className="h-10 w-10 text-teal-400" />
          <h2 className="mt-6 font-display text-3xl font-semibold text-white">Welcome back to CivicPulse.</h2>
          <p className="mt-4 max-w-sm text-sm text-slate-300">Check on your reports, submit new ones, and see what's changing in your community.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <Link to="/" className="mb-10 inline-block w-fit lg:hidden"><Logo /></Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">Log in to your account</h1>
          <p className="mt-2 text-sm text-slate-500">Track your reports and submit new complaints.</p>

          {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-status-critical">{error}</p>}

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-900">Email address</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-slate-400 focus-visible:border-teal-500" placeholder="you@example.com" autoComplete="email" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-900">Password</span>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-ink-900 placeholder:text-slate-400 focus-visible:border-teal-500" placeholder="Enter your password" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink-900" aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-mist-200 text-teal-600 focus-visible:outline-teal-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-700">Forgot password?</Link>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={submitting} iconRight={ArrowRight}>
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/signup" className="font-medium text-teal-600 hover:text-teal-700">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
