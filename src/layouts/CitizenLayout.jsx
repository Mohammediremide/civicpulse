import { useState } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FilePlus2, FileText, User, Bell, LogOut, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/report', label: 'Report an Issue', icon: FilePlus2 },
  { to: '/reports', label: 'My Reports', icon: FileText },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function CitizenLayout() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-mist-50">
      <header className="sticky top-0 z-40 border-b border-mist-200 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/dashboard"><Logo /></Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-mist-100'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <span className="text-sm font-medium text-ink-900">{session?.fullName ?? 'Citizen'}</span>
            <button onClick={handleLogout} className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-mist-100 hover:text-status-critical" aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-lg lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-mist-200 bg-white lg:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-3">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-navy-900 text-white' : 'text-ink-900 hover:bg-mist-100'}`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
                <button onClick={handleLogout} className="mt-2 flex items-center gap-2.5 rounded-lg border-t border-mist-100 px-3 py-2.5 pt-4 text-sm font-medium text-status-critical">
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
