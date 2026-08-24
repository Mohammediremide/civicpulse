import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'
import { useAuth } from '../hooks/useAuth'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/community', label: 'Community' },
  { to: '/complaints', label: 'Complaints' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        animate={{
          paddingTop: scrolled ? 10 : 18,
          paddingBottom: scrolled ? 10 : 18,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8 transition-colors duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-mist-200 shadow-sm' : 'bg-transparent'
        }`}
      >
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-navy-900' : 'text-slate-600 hover:text-navy-900'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {session ? (
            <Button variant="outline" size="sm" onClick={() => navigate(session.role === 'administrator' ? '/admin' : '/dashboard')}>
              {session.role === 'administrator' ? 'Admin Console' : 'Dashboard'}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" as={Link} to="/login">Login</Button>
          )}
          <Button variant="primary" size="sm" as={Link} to="/report" iconRight={ChevronRight}>
            Report an Issue
          </Button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-b border-mist-200 bg-white lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((l) => (
                <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-900 hover:bg-mist-50">
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-mist-100 pt-4">
                {session ? (
                  <Button variant="outline" as={Link} to={session.role === 'administrator' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)}>
                    {session.role === 'administrator' ? 'Admin Console' : 'Dashboard'}
                  </Button>
                ) : (
                  <Button variant="outline" as={Link} to="/login" onClick={() => setOpen(false)}>Login</Button>
                )}
                <Button variant="primary" as={Link} to="/report" onClick={() => setOpen(false)}>Report an Issue</Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
