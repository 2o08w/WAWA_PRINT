import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '../../utils/format'

const COLORS = ['#2f6fed', '#5ea1ff', '#8bc4ff', '#22c55e', '#f59e0b', '#a78bfa', '#ef4444', '#64748b']

function ChartTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-ink-900 border border-ink-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[11px] text-slate-400 mb-1">{item.name}</p>
      <p className="text-sm font-semibold text-slate-100 font-money">{formatCurrency(item.value, currency)}</p>
    </div>
  )
}

function renderLegend(props) {
  const { payload } = props
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-3">
      {payload.map((entry, index) => (
        <li key={index} className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  )
}

export default function CategoryPieChart({ data, currency = 'IDR' }) {
  if (!data.length) {
    return <div className="h-[260px] flex items-center justify-center text-xs text-slate-500">Belum ada data kategori</div>
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          innerRadius={58}
          outerRadius={88}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip currency={currency} />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  )
}
