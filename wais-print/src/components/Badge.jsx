const TONES = {
  success: 'bg-success-bg text-success border-success/30',
  danger: 'bg-danger-bg text-danger border-danger/30',
  warning: 'bg-warning-bg text-warning border-warning/30',
  accent: 'bg-accent-900/40 text-accent-300 border-accent-700/50',
  neutral: 'bg-ink-700/60 text-slate-300 border-ink-600',
}

export default function Badge({ children, tone = 'neutral', className = '', dot = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${TONES[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
