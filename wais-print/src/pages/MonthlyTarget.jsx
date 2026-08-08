import { useMemo, useState } from 'react'
import { Target, Wallet, TrendingUp, PiggyBank, Pencil, History } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Card, { CardHeader, CardBody } from '../components/Card'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Field, Input } from '../components/Input'
import Badge from '../components/Badge'
import { useTransactions } from '../hooks/useTransactions'
import { useSettings } from '../hooks/useSettings'
import { formatCurrency, formatPercent, clampPercent } from '../utils/format'
import { currentMonthKey, getMonthKey } from '../utils/date'

const MONTH_LABEL = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

export default function MonthlyTarget() {
  const { transactions } = useTransactions()
  const { settings, setMonthlyTarget } = useSettings()
  const [modalOpen, setModalOpen] = useState(false)
  const [targetInput, setTargetInput] = useState(settings.monthlyTarget)

  const monthKey = currentMonthKey()
  const monthTransactions = useMemo(
    () => transactions.filter((t) => getMonthKey(t.date) === monthKey),
    [transactions, monthKey],
  )

  const totalRevenue = monthTransactions.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  const target = Number(settings.monthlyTarget) || 0
  const progressPct = target > 0 ? (totalRevenue / target) * 100 : 0
  const remaining = Math.max(target - totalRevenue, 0)
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const dayOfMonth = new Date().getDate()
  const daysLeft = Math.max(daysInMonth - dayOfMonth, 0)
  const avgPerDayNeeded = daysLeft > 0 ? remaining / daysLeft : remaining
  const avgPerDaySoFar = dayOfMonth > 0 ? totalRevenue / dayOfMonth : 0

  // last 6 months history for context
  const history = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = getMonthKey(d.toISOString())
      const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
      const revenue = transactions
        .filter((t) => getMonthKey(t.date) === key)
        .reduce((sum, t) => sum + (Number(t.total) || 0), 0)
      months.push({ key, label, revenue })
    }
    return months
  }, [transactions])

  const maxHistory = Math.max(...history.map((h) => h.revenue), target, 1)

  function openEdit() {
    setTargetInput(target)
    setModalOpen(true)
  }

  function handleSave(e) {
    e.preventDefault()
    setMonthlyTarget(targetInput)
    setModalOpen(false)
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Target Bulanan"
        subtitle={`Pantau progres pendapatan untuk ${MONTH_LABEL}`}
        action={
          <Button icon={Pencil} onClick={openEdit}>
            Ubah Target
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Target Bulan Ini" value={formatCurrency(target, settings.currency)} icon={Target} tone="accent" />
        <StatCard label="Pendapatan Saat Ini" value={formatCurrency(totalRevenue, settings.currency)} icon={Wallet} tone="success" />
        <StatCard label="Sisa Target" value={formatCurrency(remaining, settings.currency)} icon={PiggyBank} tone={remaining === 0 ? 'success' : 'warning'} />
      </div>

      <Card className="mb-6">
        <CardHeader
          title="Progress Target"
          subtitle={`${MONTH_LABEL} · hari ke-${dayOfMonth} dari ${daysInMonth}`}
          action={<Badge tone={progressPct >= 100 ? 'success' : 'accent'}>{progressPct >= 100 ? 'Target Tercapai 🎉' : 'Sedang Berjalan'}</Badge>}
        />
        <CardBody>
          <div className="flex items-end justify-between mb-3">
            <span className="text-4xl font-bold text-slate-50 font-money">{formatPercent(clampPercent(progressPct), 1)}</span>
            <span className="text-sm text-slate-500 mb-1">
              {formatCurrency(totalRevenue, settings.currency)} / {formatCurrency(target, settings.currency)}
            </span>
          </div>
          <ProgressBar percent={progressPct} size="lg" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-ink-700">
            <div>
              <p className="text-xs text-slate-500">Rata-rata / hari</p>
              <p className="text-sm font-semibold text-slate-200 mt-1 font-money">{formatCurrency(avgPerDaySoFar, settings.currency)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Sisa Hari</p>
              <p className="text-sm font-semibold text-slate-200 mt-1 font-money">{daysLeft} hari</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Target / hari tersisa</p>
              <p className="text-sm font-semibold text-slate-200 mt-1 font-money">{formatCurrency(avgPerDayNeeded, settings.currency)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status</p>
              <p className={`text-sm font-semibold mt-1 ${progressPct >= 100 ? 'text-success' : 'text-accent-300'}`}>
                {progressPct >= 100 ? 'Tercapai' : 'Belum Tercapai'}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Riwayat 6 Bulan Terakhir" subtitle="Perbandingan pendapatan terhadap target" action={<History className="h-4 w-4 text-slate-500" />} />
        <CardBody>
          <div className="flex items-end gap-3 h-48">
            {history.map((h) => {
              const heightPct = (h.revenue / maxHistory) * 100
              const isCurrent = h.key === monthKey
              return (
                <div key={h.key} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                  <span className="text-[10px] text-slate-500 font-money">
                    {h.revenue >= 1000000 ? `${(h.revenue / 1000000).toFixed(1)}jt` : formatCurrency(h.revenue, settings.currency)}
                  </span>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isCurrent ? 'bg-accent-500' : 'bg-ink-600'
                      }`}
                      style={{ height: `${Math.max(heightPct, 3)}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-medium ${isCurrent ? 'text-accent-300' : 'text-slate-500'}`}>{h.label}</span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-ink-700 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent-500" /> Bulan ini</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink-600" /> Bulan sebelumnya</span>
          </div>
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Ubah Target Bulanan"
        subtitle="Tentukan target pendapatan untuk bulan ini"
        maxWidth="max-w-sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} icon={TrendingUp}>
              Simpan Target
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <Field label="Target Pendapatan Bulanan" required>
            <Input
              type="number"
              min="0"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="cth. 15000000"
              autoFocus
              required
            />
          </Field>
        </form>
      </Modal>
    </div>
  )
}
