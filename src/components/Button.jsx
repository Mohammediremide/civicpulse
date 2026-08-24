import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-teal-500 text-navy-950 hover:bg-teal-400 shadow-sm shadow-teal-500/20',
  navy: 'bg-navy-900 text-white hover:bg-navy-800',
  outline: 'border border-mist-200 text-ink-900 hover:border-navy-700 hover:bg-mist-50',
  ghost: 'text-ink-900 hover:bg-mist-100',
  danger: 'bg-status-critical text-white hover:bg-red-700',
  'outline-light': 'border border-white/25 text-white hover:bg-white/10',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-xl',
}

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  children,
  disabled,
  ...props
}) {
  return (
    <Comp
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
      {!loading && IconRight ? <IconRight className="h-4 w-4" /> : null}
    </Comp>
  )
}
