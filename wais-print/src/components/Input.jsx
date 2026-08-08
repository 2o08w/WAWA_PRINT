export function Field({ label, hint, error, required, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-xs font-medium text-slate-400 mb-1.5">
          {label} {required && <span className="text-danger">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="block text-[11px] text-slate-500 mt-1">{hint}</span>}
      {error && <span className="block text-[11px] text-danger mt-1">{error}</span>}
    </label>
  )
}

const baseInputClass =
  'w-full bg-ink-900/70 border border-ink-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-accent-500 focus:ring-1 focus:ring-accent-500/50'

export function Input({ icon: Icon, className = '', ...props }) {
  if (Icon) {
    return (
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input className={`${baseInputClass} pl-9 ${className}`} {...props} />
      </div>
    )
  }
  return <input className={`${baseInputClass} ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`${baseInputClass} resize-none ${className}`} rows={3} {...props} />
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`${baseInputClass} appearance-none bg-no-repeat bg-[right_0.9rem_center] cursor-pointer ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  )
}
