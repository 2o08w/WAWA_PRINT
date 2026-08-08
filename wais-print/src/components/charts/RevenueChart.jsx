import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatCurrency } from '../../utils/format'

function ChartTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-ink-900 border border-ink-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[11px] text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-accent-300 font-money">
        {formatCurrency(payload[0].value, currency)}
      </p>
    </div>
  )
}

export default function RevenueChart({ data, currency = 'IDR' }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2f6fed" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#2f6fed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#16223a" strokeDasharray="3 6" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={{ stroke: '#1b2740' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
          tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}jt` : v >= 1000 ? `${Math.round(v / 1000)}rb` : v)}
        />
        <Tooltip content={<ChartTooltip currency={currency} />} cursor={{ stroke: '#2f6fed', strokeWidth: 1, strokeDasharray: '4 4' }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#5ea1ff"
          strokeWidth={2.5}
          fill="url(#revenueFill)"
          activeDot={{ r: 4, fill: '#5ea1ff', stroke: '#0a0f1a', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
