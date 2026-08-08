import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Users, MessageCircle, Receipt, MapPin } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { Field, Input, Textarea } from '../components/Input'
import { useCustomers } from '../hooks/useCustomers'
import { useTransactions } from '../hooks/useTransactions'
import { useSettings } from '../hooks/useSettings'
import { formatCurrency, initials } from '../utils/format'
import { formatDateID } from '../utils/date'

const emptyForm = { name: '', whatsapp: '', address: '', notes: '' }

function waLink(number) {
  const digits = (number || '').replace(/[^0-9]/g, '')
  if (!digits) return null
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  return `https://wa.me/${normalized}`
}

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const { transactions } = useTransactions()
  const { settings } = useSettings()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmId, setConfirmId] = useState(null)
  const [historyCustomer, setHistoryCustomer] = useState(null)

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.whatsapp?.includes(search),
      ),
    [customers, search],
  )

  const customerHistory = useMemo(() => {
    if (!historyCustomer) return []
    return transactions
      .filter((t) => t.customerName?.toLowerCase() === historyCustomer.name.toLowerCase())
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [historyCustomer, transactions])

  function transactionCountFor(name) {
    return transactions.filter((t) => t.customerName?.toLowerCase() === name.toLowerCase()).length
  }

  function totalSpentFor(name) {
    return transactions
      .filter((t) => t.customerName?.toLowerCase() === name.toLowerCase())
      .reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  }

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(customer) {
    setEditingId(customer.id)
    setForm({
      name: customer.name,
      whatsapp: customer.whatsapp || '',
      address: customer.address || '',
      notes: customer.notes || '',
    })
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editingId) {
      updateCustomer(editingId, form)
    } else {
      addCustomer(form)
    }
    setModalOpen(false)
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Pelanggan"
        subtitle="Kelola data pelanggan dan riwayat transaksinya"
        action={
          <Button icon={Plus} onClick={openAdd}>
            Tambah Pelanggan
          </Button>
        }
      />

      <Card className="p-4 mb-4">
        <Input icon={Search} placeholder="Cari nama atau nomor WhatsApp..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="Belum ada pelanggan"
            description="Pelanggan baru akan otomatis tercatat saat kamu menambah transaksi, atau tambahkan manual di sini."
            action={
              <Button icon={Plus} variant="secondary" onClick={openAdd}>
                Tambah Pelanggan
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card key={c.id} hover className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {initials(c.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{c.name}</h3>
                    {c.whatsapp && <p className="text-xs text-slate-500">{c.whatsapp}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-slate-500 hover:text-accent-400 hover:bg-ink-700 transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setConfirmId(c.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-danger hover:bg-ink-700 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {c.address && (
                <p className="text-xs text-slate-500 flex items-start gap-1.5 mb-3">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" /> {c.address}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink-700">
                <div>
                  <p className="text-[11px] text-slate-500">Total Belanja</p>
                  <p className="text-sm font-semibold text-slate-200 font-money">{formatCurrency(totalSpentFor(c.name), settings.currency)}</p>
                </div>
                <Badge tone="accent">{transactionCountFor(c.name)}x transaksi</Badge>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="secondary" size="sm" icon={Receipt} className="flex-1" onClick={() => setHistoryCustomer(c)}>
                  Riwayat
                </Button>
                {waLink(c.whatsapp) && (
                  <a
                    href={waLink(c.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-success-bg text-success border border-success/30 hover:bg-success/20 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
        subtitle="Simpan data kontak pelanggan"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>{editingId ? 'Simpan Perubahan' : 'Simpan Pelanggan'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nama Pelanggan" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="cth. Budi Santoso" required />
          </Field>
          <Field label="Nomor WhatsApp">
            <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="08xxxxxxxxxx" />
          </Field>
          <Field label="Alamat">
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Alamat pelanggan" />
          </Field>
          <Field label="Catatan" hint="Opsional">
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Catatan tambahan..." />
          </Field>
        </form>
      </Modal>

      <Modal
        open={!!historyCustomer}
        onClose={() => setHistoryCustomer(null)}
        title={`Riwayat Transaksi`}
        subtitle={historyCustomer?.name}
      >
        {customerHistory.length === 0 ? (
          <EmptyState icon={Receipt} title="Belum ada transaksi" description="Pelanggan ini belum memiliki riwayat transaksi." />
        ) : (
          <div className="space-y-2">
            {customerHistory.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-ink-900/60 border border-ink-700">
                <div>
                  <p className="text-sm font-medium text-slate-200">{t.serviceName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDateID(t.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-100 font-money">{formatCurrency(t.total, settings.currency)}</p>
                  <Badge tone={t.status === 'Lunas' ? 'success' : 'warning'} className="mt-1">
                    {t.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => deleteCustomer(confirmId)}
        title="Hapus pelanggan ini?"
        description="Data pelanggan akan dihapus. Riwayat transaksi yang sudah ada tidak akan terhapus."
      />
    </div>
  )
}
