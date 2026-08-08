export default function Card({ children, className = '', hover = false, as: As = 'div', ...props }) {
  return (
    <As
      className={`bg-ink-850/80 border border-ink-600/70 rounded-2xl shadow-card backdrop-blur-sm ${
        hover ? 'transition-all duration-200 hover:border-accent-500/40 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </As>
  )
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 p-5 pb-3 ${className}`}>
      <div>
        <h3 className="text-sm font-semibold text-slate-100 font-display">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-5 pb-5 ${className}`}>{children}</div>
}
