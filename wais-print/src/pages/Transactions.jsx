import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Receipt, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { Field, Input, Select, Textarea } from '../components/Input'
import { useTransactions } from '../hooks/useTransactions'
import { useServices } from '../hooks/useServices'
import { useCustomers } from '../hooks/useCustomers'
import { useSettings } from '../hooks/useSettings'
import { formatCurrency } from '../utils/format'
import { formatDateID, todayISO } from '../utils/date'
import { PAYMENT_STATUS } from '../lib/seed'

const emptyForm = {
  customerName: '',
  serviceName: '',
  category: '',
  quantity: 1,
  price: 0,
  status: PAYMENT_STATUS.BELUM_LUNAS,
  date: todayISO(),
  notes: '',
}

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions()
  const { services } = useServices()
  const { customers, findOrCreateByName } = useCustomers()
  const { settings } = useSettings()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmId, setConfirmId] = useState(null)

  const categories = useMemo(() => {
    const set = new Set(services.map((s) => s.category))
    return Array.from(set)
  }, [services])

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchSearch =
          !search ||
          t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
          t.serviceName?.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === 'all' || t.status === statusFilter
        const matchCategory = categoryFilter === 'all' || t.category === categoryFilter
        return matchSearch && matchStatus && matchCategory
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [transactions, search, statusFilter, categoryFilter])

  function openAddModal() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEditModal(tx) {
    setEditingId(tx.id)
    setForm({
      customerName: tx.customerName || '',
      serviceName: tx.serviceName || '',
      category: tx.category || '',
      quantity: tx.quantity || 1,
      price: tx.price || 0,
      status: tx.status || PAYMENT_STATUS.BELUM_LUNAS,
      date: tx.date || todayISO(),
      notes: tx.notes || '',
    })
    setModalOpen(true)
  }

  function handleServiceSelect(serviceName) {
    const service = services.find((s) => s.name === serviceName)
    setForm((prev) => ({
      ...prev,
      serviceName,
      category: service?.category || prev.category,
      price: service ? service.price : prev.price,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.customerName.trim() || !form.serviceName.trim()) return

    findOrCreateByName(form.customerName)

    if (editingId) {
      updateTransaction(editingId, form)
    } else {
      addTransaction(form)
    }
    setModalOpen(false)
  }

  const total = form.quantity * form.price || 0

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Transaksi"
        subtitle="Catat dan kelola seluruh transaksi penjualan"
        action={
          <Button icon={Plus} onClick={openAddModal}>
            Tambah Transaksi
          </Button>
        }
      />

      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Cari nama pelanggan atau layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="md:w-48">
            <option value="all">Semua Status</option>
            <option value={PAYMENT_STATUS.LUNAS}>Lunas</option>
            <option value={PAYMENT_STATUS.BELUM_LUNAS}>Belum Lunas</option>
          </Select>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="md:w-48">
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Tidak ada transaksi"
            description="Coba ubah pencarian atau filter, atau tambahkan transaksi baru."
            action={
              <Button icon={Plus} variant="secondary" onClick={openAddModal}>
                Tambah Transaksi
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-ink-700">
                  <th className="py-3 px-5 font-medium">Pelanggan</th>
                  <th className="py-3 px-5 font-medium">Layanan</th>
                  <th className="py-3 px-5 font-medium">Kategori</th>
                  <th className="py-3 px-5 font-medium text-right">Jumlah</th>
                  <th className="py-3 px-5 font-medium text-right">Harga</th>
                  <th className="py-3 px-5 font-medium text-right">Total</th>
                  <th className="py-3 px-5 font-medium">Tanggal</th>
                  <th className="py-3 px-5 font-medium">Status</th>
                  <th className="py-3 px-5 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40 transition-colors">
                    <td className="py-3.5 px-5 text-slate-200 font-medium whitespace-nowrap">{t.customerName}</td>
                    <td className="py-3.5 px-5 text-slate-300 whitespace-nowrap">{t.serviceName}</td>
                    <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">{t.category}</td>
                    <td className="py-3.5 px-5 text-right text-slate-300 font-money">{t.quantity}</td>
                    <td className="py-3.5 px-5 text-right text-slate-300 font-money whitespace-nowrap">
                      {formatCurrency(t.price, settings.currency)}
                    </td>
                    <td className="py-3.5 px-5 text-right text-slate-100 font-semibold font-money whitespace-nowrap">
                      {formatCurrency(t.total, settings.currency)}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">{formatDateID(t.date)}</td>
                    <td className="py-3.5 px-5">
                      <Badge tone={t.status === PAYMENT_STATUS.LUNAS ? 'success' : 'warning'}>{t.status}</Badge>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-accent-400 hover:bg-ink-700 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmId(t.id)}
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
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Transaksi' : 'Tambah Transaksi'}
        subtitle="Lengkapi detail transaksi penjualan"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>{editingId ? 'Simpan Perubahan' : 'Simpan Transaksi'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nama Pelanggan" required>
            <Input
              list="customer-suggestions"
              placeholder="cth. Budi Santoso"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              required
            />
            <datalist id="customer-suggestions">
              {customers.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Layanan" required>
              <Select value={form.serviceName} onChange={(e) => handleServiceSelect(e.target.value)} required>
                <option value="">Pilih layanan</option>
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Kategori">
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Kategori" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Jumlah" required>
              <Input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </Field>
            <Field label="Harga Satuan" required>
              <Input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </Field>
          </div>

          <div className="rounded-xl bg-ink-900/70 border border-ink-600 px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">Total Harga</span>
            <span className="text-base font-semibold text-accent-300 font-money">
              {formatCurrency(total, settings.currency)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tanggal" required>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </Field>
            <Field label="Status Pembayaran">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value={PAYMENT_STATUS.BELUM_LUNAS}>Belum Lunas</option>
                <option value={PAYMENT_STATUS.LUNAS}>Lunas</option>
              </Select>
            </Field>
          </div>

          <Field label="Catatan" hint="Opsional">
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Catatan tambahan..."
            />
          </Field>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => deleteTransaction(confirmId)}
        title="Hapus transaksi ini?"
        description="Data transaksi akan dihapus secara permanen dan tidak dapat dikembalikan."
      />
    </div>
  )
}
