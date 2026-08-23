import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ title = 'Something went wrong.', description = 'Please try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/60 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-red-100">
        <AlertTriangle className="h-5 w-5 text-status-critical" />
      </div>
      <h3 className="font-display text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" onClick={onRetry}>Retry</Button>
        </div>
      )}
    </div>
  )
}
