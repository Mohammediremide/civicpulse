import { Lock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import EmptyState from './EmptyState'

export default function AdminOnlyGate({ children }) {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md py-16">
        <EmptyState
          icon={Lock}
          title="Administrators only"
          description="This page is restricted to full administrators. Contact one if you need something here changed."
        />
      </div>
    )
  }

  return children
}
