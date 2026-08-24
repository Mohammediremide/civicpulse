import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Button from '../components/Button'
import Logo from '../components/Logo'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mist-50 px-6 text-center">
      <Link to="/" className="mb-8"><Logo /></Link>
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-mist-200">
        <Compass className="h-6 w-6" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">The page you're looking for doesn't exist or may have moved.</p>
      <Button as={Link} to="/" className="mt-6">Back to home</Button>
    </div>
  )
}
