import { clampPercent } from '../utils/format'

export default function ProgressBar({ percent = 0, className = '', size = 'md', tone = 'accent' }) {
  const pct = clampPercent(percent)
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'
  const barTone =
    tone === 'success'
      ? 'bg-success'
      : pct >= 100
      ? 'bg-success'
      : pct >= 70
      ? 'bg-accent-400'
      : 'bg-accent-500'

  return (
    <div className={`w-full ${height} rounded-full bg-ink-700/70 overflow-hidden ${className}`}>
      <div
        className={`${height} rounded-full ${barTone} transition-all duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
