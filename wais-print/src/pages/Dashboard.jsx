import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, TrendingDown, PiggyBank, Receipt, ArrowUpRight, Target as TargetIcon } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import Card, { CardHeader, CardBody } from '../components/Card'
import Badge from '../components/Badge'
import ProgressBar from '../components/ProgressBar'
import EmptyState from '../components/EmptyState'
import RevenueChart from '../components/charts/RevenueChart'
import TransactionChart from '../components/charts/TransactionChart'
import CategoryPieChart from '../components/charts/CategoryPieChart'
import { useTransactions } from '../hooks/useTransactions'
import { useExpenses } from '../hooks/useExpenses'
import { useSettings } from '../hooks/useSettings'
import { formatCurrency, formatNumber, formatPercent, clampPercent } from '../utils/format'
import { formatDateID, isSameDay, currentMonthKey, getMonthKey, last7Days, shortWeekdayID } from '../utils/date'

export default function Dashboard() {
  const { transactions } = useTransactions()
  const { expenses } = useExpenses()
  const { settings } = useSettings()

  const monthKey = currentMonthKey()

  const monthTransactions = useMemo(
    () => transactions.filter((t) => getMonthKey(t.date) === monthKey),
    [transactions, monthKey],
  )
  const monthExpenses = useMemo(
    () => expenses.filter((e) => getMonthKey(e.date) === monthKey),
    [expenses, monthKey],
  )

  const totalRevenue = monthTransactions.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  const totalExpense = monthExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  const netProfit = totalRevenue - totalExpense
  const transactionCount = monthTransactions.length

  const days = last7Days()
  const revenueSeries = days.map((d) => {
    const value = transactions
      .filter((t) => isSameDay(t.date, d))
      .reduce((sum, t) => sum + (Number(t.total) || 0), 0)
    return { label: shortWeekdayID(d), value }
  })
  const transactionSeries = days.map((d) => ({
    label: shortWeekdayID(d),
    value: transactions.filter((t) => isSameDay(t.date, d)).length,
    isToday: isSameDay(d, new Date()),
  }))

  const categoryData = useMemo(() => {
    const map = {}
    monthTransactions.forEach((t) => {
      const key = t.category || 'Lainnya'
      map[key] = (map[key] || 0) + (Number(t.total) || 0)
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [monthTransactions])

  const target = Number(settings.monthlyTarget) || 0
  const progressPct = target > 0 ? (totalRevenue / target) * 100 : 0
  const remaining = Math.max(target - totalRevenue, 0)

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 6)

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Dashboard"
        subtitle={`Ringkasan performa bisnis bulan ${formatDateID(new Date(), { day: undefined })}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Pendapatan"
          value={formatCurrency(totalRevenue, settings.currency)}
          icon={Wallet}
          tone="accent"
          trend={`${transactionCount} transaksi`}
          trendLabel="bulan ini"
        />
        <StatCard
          label="Total Pengeluaran"
          value={formatCurrency(totalExpense, settings.currency)}
          icon={TrendingDown}
          tone="danger"
          trend={`${monthExpenses.length} catatan`}
          trendLabel="bulan ini"
        />
        <StatCard
          label="Keuntungan Bersih"
          value={formatCurrency(netProfit, settings.currency)}
          icon={PiggyBank}
          tone={netProfit >= 0 ? 'success' : 'danger'}
          trend={netProfit >= 0 ? 'Surplus' : 'Defisit'}
          trendLabel="bulan ini"
        />
        <StatCard
          label="Jumlah Transaksi"
          value={formatNumber(transactionCount)}
          icon={Receipt}
          tone="accent"
          trend={formatNumber(transactions.length)}
          trendLabel="total sepanjang waktu"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader title="Grafik Pendapatan" subtitle="7 hari terakhir" />
          <CardBody>
            <RevenueChart data={revenueSeries} currency={settings.currency} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Target Bulanan"
            subtitle={formatCurrency(target, settings.currency)}
            action={
              <Link to="/target" className="text-accent-400 hover:text-accent-300">
                <TargetIcon className="h-4 w-4" />
              </Link>
            }
          />
          <CardBody>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-semibold text-slate-50 font-money">{formatPercent(clampPercent(progressPct))}</span>
              <Badge tone={progressPct >= 100 ? 'success' : 'accent'}>{progressPct >= 100 ? 'Tercapai' : 'Berjalan'}</Badge>
            </div>
            <ProgressBar percent={progressPct} size="lg" />
            <div className="flex items-center justify-between mt-4 text-xs">
              <div>
                <p className="text-slate-500">Tercapai</p>
                <p className="text-slate-200 font-medium font-money mt-0.5">{formatCurrency(totalRevenue, settings.currency)}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Sisa Target</p>
                <p className="text-slate-200 font-medium font-money mt-0.5">{formatCurrency(remaining, settings.currency)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader title="Grafik Transaksi" subtitle="Jumlah transaksi 7 hari terakhir" />
          <CardBody>
            <TransactionChart data={transactionSeries} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Kategori Transaksi" subtitle="Distribusi pendapatan bulan ini" />
          <CardBody>
            <CategoryPieChart data={categoryData} currency={settings.currency} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Transaksi Terbaru"
          subtitle="6 transaksi terakhir yang tercatat"
          action={
            <Link to="/transaksi" className="text-xs font-medium text-accent-400 hover:text-accent-300 flex items-center gap-1">
              Lihat semua <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <CardBody>
          {recentTransactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Belum ada transaksi"
              description="Transaksi yang kamu catat akan muncul di sini."
            />
          ) : (
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-ink-700">
                    <th className="pb-2.5 font-medium">Pelanggan</th>
                    <th className="pb-2.5 font-medium">Layanan</th>
                    <th className="pb-2.5 font-medium">Tanggal</th>
                    <th className="pb-2.5 font-medium text-right">Total</th>
                    <th className="pb-2.5 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-ink-800 last:border-0">
                      <td className="py-3 text-slate-200 font-medium">{t.customerName}</td>
                      <td className="py-3 text-slate-400">{t.serviceName}</td>
                      <td className="py-3 text-slate-400">{formatDateID(t.date)}</td>
                      <td className="py-3 text-right text-slate-100 font-money">{formatCurrency(t.total, settings.currency)}</td>
                      <td className="py-3 text-right">
                        <Badge tone={t.status === 'Lunas' ? 'success' : 'warning'}>{t.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
