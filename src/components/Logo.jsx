export default function Logo({ className = '', dark = false, showWordmark = true }) {
  const textColor = dark ? 'text-white' : 'text-ink-900'
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#0A1B33" />
        <path d="M32 50C32 50 48 38.5 48 26.5C48 17.9 41 11 32 11C23 11 16 17.9 16 26.5C16 38.5 32 50 32 50Z" stroke="#14C7B5" strokeWidth="3" strokeLinejoin="round" />
        <path d="M16 27H23L27 19L33 35L37 27H48" stroke="#F5F7FA" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showWordmark && (
        <span className={`font-display font-semibold text-lg tracking-tight ${textColor}`}>
          Civic<span className="text-teal-500">Pulse</span>
        </span>
      )}
    </div>
  )
}
