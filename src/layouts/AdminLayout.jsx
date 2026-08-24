import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutGrid, FileStack, Map as MapIcon, BarChart3, Building2, Landmark,
  Users, Bell, Settings, LogOut, Menu, X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/reports', label: 'Reports', icon: FileStack },
  { to: '/admin/map', label: 'Map', icon: MapIcon },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/departments', label: 'Departments', icon: Landmark },
  { to: '/admin/organizations', label: 'Organizations', icon: Building2 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { session, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <Logo dark />
        <span className="ml-auto rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-400">Admin</span>
      </div>
      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-teal-500/15 text-teal-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-500/20 text-xs font-semibold text-teal-400">
            {(session?.fullName ?? 'A').slice(0, 1)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{session?.fullName ?? 'Administrator'}</p>
            <p className="truncate text-xs text-slate-400">{session?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-status-critical">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-mist-50 lg:flex">
      <aside className="hidden w-64 shrink-0 bg-navy-950 grain-noise lg:block">
        <div className="sticky top-0 h-screen">{SidebarContent}</div>
      </aside>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setDrawerOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-navy-950 grain-noise lg:hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-mist-200 bg-white/90 px-4 backdrop-blur-lg lg:px-8">
          <button className="grid h-10 w-10 place-items-center rounded-lg hover:bg-mist-100 lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm font-semibold text-ink-900">Government Operations Console</span>
        </header>
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
