import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MailCheck } from 'lucide-react'
import Logo from '../../components/Logo'
import Button from '../../components/Button'
import { requestPasswordReset } from '../../services/authService'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await requestPasswordReset(email)
    setSubmitting(false)
    setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist-50 px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md rounded-2xl border border-mist-200 bg-white p-8 shadow-sm">
        <Link to="/" className="mb-8 inline-block"><Logo /></Link>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="font-display text-2xl font-semibold text-ink-900">Reset your password</h1>
              <p className="mt-2 text-sm text-slate-500">Enter the email associated with your account. This is a demo interface — no email is actually sent in this prototype.</p>

              <form onSubmit={onSubmit} className="mt-6 space-y-5">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink-900">Email address</span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-slate-400 focus-visible:border-teal-500" placeholder="you@example.com" />
                </label>
                <Button type="submit" className="w-full" size="lg" loading={submitting}>Send reset instructions</Button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="sent" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-teal-600">
                <MailCheck className="h-6 w-6" />
              </div>
              <h1 className="font-display text-xl font-semibold text-ink-900">Demo request received</h1>
              <p className="mt-2 text-sm text-slate-500">In a production deployment, reset instructions would be sent to <span className="font-medium text-ink-900">{email}</span>. No email service is connected in this prototype.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <Link to="/login" className="mt-8 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink-900">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </motion.div>
    </div>
  )
}
