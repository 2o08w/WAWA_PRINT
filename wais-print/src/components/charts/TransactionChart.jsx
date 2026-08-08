import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-ink-900 border border-ink-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[11px] text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-100 font-money">{payload[0].value} transaksi</p>
    </div>
  )
}

export default function TransactionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#16223a" strokeDasharray="3 6" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1b2740' }} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(47,111,237,0.08)' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={28}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.isToday ? '#2f6fed' : '#243352'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
