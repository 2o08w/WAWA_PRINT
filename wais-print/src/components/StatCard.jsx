import Card from './Card'

const TONE_STYLES = {
  accent: { icon: 'text-accent-400 bg-accent-900/40', chip: 'text-accent-300' },
  success: { icon: 'text-success bg-success-bg', chip: 'text-success' },
  danger: { icon: 'text-danger bg-danger-bg', chip: 'text-danger' },
  warning: { icon: 'text-warning bg-warning-bg', chip: 'text-warning' },
}

export default function StatCard({ label, value, icon: Icon, tone = 'accent', trend, trendLabel }) {
  const styles = TONE_STYLES[tone] || TONE_STYLES.accent
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-semibold text-slate-50 mt-2 font-money">{value}</p>
        </div>
        {Icon && (
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${styles.icon}`}>
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <p className={`text-xs mt-3 font-medium ${styles.chip}`}>
          {trend} <span className="text-slate-500 font-normal">{trendLabel}</span>
        </p>
      )}
    </Card>
  )
}
