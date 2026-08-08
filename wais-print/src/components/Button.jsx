import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:
    'bg-accent-500 text-white hover:bg-accent-600 shadow-glow disabled:hover:bg-accent-500',
  secondary:
    'bg-ink-700 text-slate-100 hover:bg-ink-600 border border-ink-600',
  ghost: 'bg-transparent text-slate-300 hover:bg-ink-800 hover:text-white',
  danger: 'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/30',
  outline: 'bg-transparent border border-ink-600 text-slate-200 hover:border-accent-500 hover:text-accent-300',
}

const SIZES = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2 gap-2 rounded-xl',
  lg: 'text-sm px-5 py-2.5 gap-2 rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      ) : null}
      {children}
    </button>
  )
}
