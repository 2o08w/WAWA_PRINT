import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { formatCurrency } from '../../utils/format'

function ChartTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-ink-900 border border-ink-600 rounded-lg px-3 py-2 shadow-xl space-y-1">
      <p className="text-[11px] text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-xs font-medium font-money" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value, currency)}
        </p>
      ))}
    </div>
  )
}

export default function ReportChart({ data, currency = 'IDR' }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#16223a" strokeDasharray="3 6" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1b2740' }} tickLine={false} />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}jt` : v >= 1000 ? `${Math.round(v / 1000)}rb` : v)}
        />
        <Tooltip content={<ChartTooltip currency={currency} />} cursor={{ fill: 'rgba(47,111,237,0.06)' }} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
          formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
        />
        <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={22} fillOpacity={0.55} />
        <Line dataKey="revenue" name="Pendapatan" stroke="#5ea1ff" strokeWidth={2.5} dot={{ r: 3, fill: '#5ea1ff' }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
