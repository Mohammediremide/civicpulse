import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const STAFF_ROLES = ['administrator', 'government_staff', 'department_manager']

export default function ProtectedRoute({ children, requireStaff = false }) {
  const { session } = useAuth()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (requireStaff && !STAFF_ROLES.includes(session.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
