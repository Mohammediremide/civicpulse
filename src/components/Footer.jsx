import { Link } from 'react-router-dom'
import { AtSign, Code2, Mail } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-mist-200 bg-navy-950 grain-noise">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              One platform for reporting community problems, public-service issues, and consumer complaints — with transparent tracking from report to resolution.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 hover:border-teal-500/50 hover:text-teal-400" aria-label="X (Twitter)">
                <AtSign className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 hover:border-teal-500/50 hover:text-teal-400" aria-label="GitHub">
                <Code2 className="h-4 w-4" />
              </a>
              <a href="mailto:hello@civicpulse.ng" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 hover:border-teal-500/50 hover:text-teal-400" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterCol title="Platform" links={[
            { label: 'Community Map', to: '/community' },
            { label: 'Complaints', to: '/complaints' },
            { label: 'Track a Report', to: '/track' },
            { label: 'Report an Issue', to: '/report' },
          ]} />
          <FooterCol title="Company" links={[
            { label: 'About', to: '/about' },
            { label: 'Contact', to: '/contact' },
            { label: 'Admin Console', to: '/admin' },
          ]} />
          <FooterCol title="Account" links={[
            { label: 'Login', to: '/login' },
            { label: 'Create Account', to: '/signup' },
            { label: 'Citizen Dashboard', to: '/dashboard' },
          ]} />
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CivicPulse. A civic-technology platform for Nigeria.</p>
          <p>Built for transparent, accountable communities across Nigeria.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-white">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-slate-400 transition-colors hover:text-teal-400">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
