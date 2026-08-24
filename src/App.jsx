import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './hooks/useAuth'
import SplashScreen from './components/SplashScreen'

import PublicLayout from './layouts/PublicLayout'
import CitizenLayout from './layouts/CitizenLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { SkeletonBlock } from './components/Skeleton'

import Landing from './pages/public/Landing'
import Signup from './pages/public/Signup'
import Login from './pages/public/Login'
import ForgotPassword from './pages/public/ForgotPassword'
import Community from './pages/public/Community'
import Complaints from './pages/public/Complaints'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import Track from './pages/public/Track'

import CitizenDashboard from './pages/citizen/Dashboard'
import ReportIssue from './pages/citizen/ReportIssue'
import MyReports from './pages/citizen/MyReports'
import ReportDetail from './pages/citizen/ReportDetail'
import Profile from './pages/citizen/Profile'
import Notifications from './pages/citizen/Notifications'

import AdminDashboard from './pages/admin/Dashboard'
import AdminReports from './pages/admin/Reports'
import AdminReportDetail from './pages/admin/ReportDetail'
import AdminMap from './pages/admin/Map'
import AdminDepartments from './pages/admin/Departments'
import AdminOrganizations from './pages/admin/Organizations'
import AdminUsers from './pages/admin/Users'
import AdminNotifications from './pages/admin/Notifications'
import AdminSettings from './pages/admin/Settings'

// Analytics pulls in recharts, so it's split into its own chunk.
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'))

import NotFound from './pages/NotFound'

function LazyFallback() {
  return (
    <div className="space-y-4">
      <SkeletonBlock className="h-24 w-full" />
      <SkeletonBlock className="h-72 w-full" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

function AppShell() {
  const { initializing } = useAuth()
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), 900)
    return () => clearTimeout(t)
  }, [])

  const showSplash = initializing || !minTimeElapsed

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
          >
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/community" element={<Community />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/track" element={<Track />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* Report detail is publicly viewable (no private reporter info is ever shown) */}
            <Route path="/reports/:id" element={<ReportDetail />} />
          </Route>

          {/* Auth pages (no navbar/footer chrome) */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Citizen portal */}
          <Route element={<ProtectedRoute><CitizenLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/reports" element={<MyReports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* Admin console */}
          <Route element={<ProtectedRoute requireStaff><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/reports/:id" element={<AdminReportDetail />} />
            <Route path="/admin/map" element={<AdminMap />} />
            <Route path="/admin/analytics" element={
              <Suspense fallback={<LazyFallback />}><AdminAnalytics /></Suspense>
            } />
            <Route path="/admin/departments" element={<AdminDepartments />} />
            <Route path="/admin/organizations" element={<AdminOrganizations />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
