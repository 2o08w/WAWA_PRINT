import { useMemo, useState } from 'react'
import { Download, Wallet, TrendingDown, PiggyBank, Receipt, Plus, Pencil, Trash2, FileBarChart } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Card, { CardHeader, CardBody } from '../components/Card'
import StatCard from '../components/StatCard'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { Field, Input, Select } from '../components/Input'
import ReportChart from '../components/charts/ReportChart'
import { useTransactions } from '../hooks/useTransactions'
import { useExpenses } from '../hooks/useExpenses'
import { useSettings } from '../hooks/useSettings'
import { formatCurrency, formatNumber } from '../utils/format'
import { formatDateID, todayISO, filterByRange, startOfWeek, startOfMonth, startOfYear } from '../utils/date'
import { downloadCSV } from '../utils/export'
import { EXPENSE_CATEGORIES } from '../lib/seed'

const RANGE_OPTIONS = [
  { value: 'day', label: 'Hari Ini' },
  { value: 'week', label: 'Minggu Ini' },
  { value: 'month', label: 'Bulan Ini' },
  { value: 'year', label: 'Tahun Ini' },
]

const emptyExpenseForm = { title: '', category: EXPENSE_CATEGORIES[0], amount: '', date: todayISO(), notes: '' }

function buildTimeline(transactions, expenses, range) {
  const now = new Date()
  const buckets = []

  if (range === 'day') {
    return [
      {
        label: 'Hari Ini',
        revenue: transactions.reduce((s, t) => s + (Number(t.total) || 0), 0),
        expense: expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0),
      },
    ]
  }

  if (range === 'week') {
    const start = startOfWeek(now)
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      buckets.push({ date: d, label: d.toLocaleDateString('id-ID', { weekday: 'short' }) })
    }
  } else if (range === 'month') {
    const start = startOfMonth(now)
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    for (let i = 0; i < daysInMonth; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      if (d > now) break
      buckets.push({ date: d, label: String(d.getDate()) })
    }
  } else if (range === 'year') {
    const start = startOfYear(now)
    for (let i = 0; i <= now.getMonth(); i++) {
      const d = new Date(start.getFullYear(), i, 1)
      buckets.push({ date: d, label: d.toLocaleDateString('id-ID', { month: 'short' }) })
    }
  }

  return buckets.map((b) => {
    const isSamePeriod = (dateStr) => {
      const d = new Date(dateStr)
      if (range === 'year') {
        return d.getFullYear() === b.date.getFullYear() && d.getMonth() === b.date.getMonth()
      }
      return (
        d.getFullYear() === b.date.getFullYear() &&
        d.getMonth() === b.date.getMonth() &&
        d.getDate() === b.date.getDate()
      )
    }
    return {
      label: b.label,
      revenue: transactions.filter((t) => isSamePeriod(t.date)).reduce((s, t) => s + (Number(t.total) || 0), 0),
      expense: expenses.filter((e) => isSamePeriod(e.date)).reduce((s, e) => s + (Number(e.amount) || 0), 0),
    }
  })
}

export default function Reports() {
  const { transactions } = useTransactions()
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses()
  const { settings } = useSettings()

  const [range, setRange] = useState('month')
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [editingExpenseId, setEditingExpenseId] = useState(null)
  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm)
  const [confirmExpenseId, setConfirmExpenseId] = useState(null)

  const filteredTransactions = useMemo(() => filterByRange(transactions, range, 'date'), [transactions, range])
  const filteredExpenses = useMemo(() => filterByRange(expenses, range, 'date'), [expenses, range])

  const totalRevenue = filteredTransactions.reduce((s, t) => s + (Number(t.total) || 0), 0)
  const totalExpense = filteredExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
  const netProfit = totalRevenue - totalExpense

  const timeline = useMemo(
    () => buildTimeline(filteredTransactions, filteredExpenses, range),
    [filteredTransactions, filteredExpenses, range],
  )

  function handleExportTransactions() {
    downloadCSV(
      `wais-print-transaksi-${range}-${todayISO()}.csv`,
      filteredTransactions.map((t) => ({
        Tanggal: t.date,
        Pelanggan: t.customerName,
        Layanan: t.serviceName,
        Kategori: t.category,
        Jumlah: t.quantity,
        Harga: t.price,
        Total: t.total,
        Status: t.status,
      })),
    )
  }

  function handleExportExpenses() {
    downloadCSV(
      `wais-print-pengeluaran-${range}-${todayISO()}.csv`,
      filteredExpenses.map((e) => ({
        Tanggal: e.date,
        Judul: e.title,
        Kategori: e.category,
        Jumlah: e.amount,
        Catatan: e.notes || '',
      })),
    )
  }

  function openAddExpense() {
    setEditingExpenseId(null)
    setExpenseForm(emptyExpenseForm)
    setExpenseModalOpen(true)
  }

  function openEditExpense(exp) {
    setEditingExpenseId(exp.id)
    setExpenseForm({ title: exp.title, category: exp.category, amount: exp.amount, date: exp.date, notes: exp.notes || '' })
    setExpenseModalOpen(true)
  }

  function handleExpenseSubmit(e) {
    e.preventDefault()
    if (!expenseForm.title.trim()) return
    if (editingExpenseId) {
      updateExpense(editingExpenseId, expenseForm)
    } else {
      addExpense(expenseForm)
    }
    setExpenseModalOpen(false)
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Laporan"
        subtitle="Analisis performa keuangan usaha percetakan"
        action={
          <div className="flex bg-ink-800 border border-ink-600 rounded-xl p-1 gap-1">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRange(opt.value)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  range === opt.value ? 'bg-accent-500 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pendapatan" value={formatCurrency(totalRevenue, settings.currency)} icon={Wallet} tone="accent" />
        <StatCard label="Pengeluaran" value={formatCurrency(totalExpense, settings.currency)} icon={TrendingDown} tone="danger" />
        <StatCard label="Keuntungan" value={formatCurrency(netProfit, settings.currency)} icon={PiggyBank} tone={netProfit >= 0 ? 'success' : 'danger'} />
        <StatCard label="Jumlah Transaksi" value={formatNumber(filteredTransactions.length)} icon={Receipt} tone="accent" />
      </div>

      <Card className="mb-6">
        <CardHeader
          title="Pendapatan vs Pengeluaran"
          subtitle={RANGE_OPTIONS.find((o) => o.value === range)?.label}
          action={
            <Button variant="secondary" size="sm" icon={Download} onClick={handleExportTransactions}>
              Export Transaksi
            </Button>
          }
        />
        <CardBody>
          <ReportChart data={timeline} currency={settings.currency} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Catatan Pengeluaran"
          subtitle="Kelola pengeluaran operasional usaha"
          action={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon={Download} onClick={handleExportExpenses}>
                Export
              </Button>
              <Button size="sm" icon={Plus} onClick={openAddExpense}>
                Tambah
              </Button>
            </div>
          }
        />
        <CardBody>
          {filteredExpenses.length === 0 ? (
            <EmptyState
              icon={FileBarChart}
              title="Belum ada pengeluaran"
              description="Catat pengeluaran operasional seperti bahan baku, listrik, atau sewa tempat."
              action={
                <Button icon={Plus} variant="secondary" onClick={openAddExpense}>
                  Tambah Pengeluaran
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-ink-700">
                    <th className="py-2.5 font-medium">Judul</th>
                    <th className="py-2.5 font-medium">Kategori</th>
                    <th className="py-2.5 font-medium">Tanggal</th>
                    <th className="py-2.5 font-medium text-right">Jumlah</th>
                    <th className="py-2.5 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((e) => (
                      <tr key={e.id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40 transition-colors">
                        <td className="py-3 text-slate-200 font-medium">{e.title}</td>
                        <td className="py-3">
                          <Badge tone="neutral">{e.category}</Badge>
                        </td>
                        <td className="py-3 text-slate-500">{formatDateID(e.date)}</td>
                        <td className="py-3 text-right text-danger font-medium font-money">
                          -{formatCurrency(e.amount, settings.currency)}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditExpense(e)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-accent-400 hover:bg-ink-700 transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmExpenseId(e.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-danger hover:bg-ink-700 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        open={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title={editingExpenseId ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
        subtitle="Catat pengeluaran operasional usaha"
        footer={
          <>
            <Button variant="secondary" onClick={() => setExpenseModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleExpenseSubmit}>{editingExpenseId ? 'Simpan Perubahan' : 'Simpan Pengeluaran'}</Button>
          </>
        }
      >
        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          <Field label="Judul Pengeluaran" required>
            <Input
              value={expenseForm.title}
              onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
              placeholder="cth. Beli tinta printer"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kategori">
              <Select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Jumlah" required>
              <Input
                type="number"
                min="0"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                placeholder="0"
                required
              />
            </Field>
          </div>
          <Field label="Tanggal" required>
            <Input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} required />
          </Field>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmExpenseId}
        onClose={() => setConfirmExpenseId(null)}
        onConfirm={() => deleteExpense(confirmExpenseId)}
        title="Hapus pengeluaran ini?"
        description="Catatan pengeluaran akan dihapus secara permanen."
      />
    </div>
  )
}
