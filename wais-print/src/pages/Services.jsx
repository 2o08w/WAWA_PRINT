import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Printer, Tag } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { Field, Input, Select } from '../components/Input'
import { useServices } from '../hooks/useServices'
import { useSettings } from '../hooks/useSettings'
import { formatCurrency } from '../utils/format'
import { DEFAULT_SERVICE_CATEGORIES } from '../lib/seed'

const emptyForm = { name: '', category: DEFAULT_SERVICE_CATEGORIES[0], price: '', unit: 'lembar' }

export default function Services() {
  const { services, addService, updateService, deleteService } = useServices()
  const { settings } = useSettings()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmId, setConfirmId] = useState(null)

  const filtered = useMemo(
    () =>
      services.filter(
        (s) =>
          !search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.category.toLowerCase().includes(search.toLowerCase()),
      ),
    [services, search],
  )

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(service) {
    setEditingId(service.id)
    setForm({ name: service.name, category: service.category, price: service.price, unit: service.unit || 'lembar' })
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    const payload = { ...form, price: Number(form.price) || 0 }
    if (editingId) {
      updateService(editingId, payload)
    } else {
      addService(payload)
    }
    setModalOpen(false)
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Layanan"
        subtitle="Kelola daftar layanan percetakan dan harga jual"
        action={
          <Button icon={Plus} onClick={openAdd}>
            Tambah Layanan
          </Button>
        }
      />

      <Card className="p-4 mb-4">
        <Input icon={Search} placeholder="Cari layanan..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Printer}
            title="Belum ada layanan"
            description="Tambahkan layanan percetakan pertama kamu."
            action={
              <Button icon={Plus} variant="secondary" onClick={openAdd}>
                Tambah Layanan
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <Card key={s.id} hover className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-accent-900/40 flex items-center justify-center">
                  <Printer className="h-5 w-5 text-accent-400" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-accent-400 hover:bg-ink-700 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmId(s.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-danger hover:bg-ink-700 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-slate-100">{s.name}</h3>
              <Badge tone="neutral" className="mt-2">
                <Tag className="h-3 w-3" /> {s.category}
              </Badge>
              <div className="flex items-end justify-between mt-4 pt-4 border-t border-ink-700">
                <span className="text-xs text-slate-500">Harga / {s.unit}</span>
                <span className="text-base font-semibold text-accent-300 font-money">
                  {formatCurrency(s.price, settings.currency)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Layanan' : 'Tambah Layanan'}
        subtitle="Atur nama, kategori, dan harga layanan"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>{editingId ? 'Simpan Perubahan' : 'Simpan Layanan'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nama Layanan" required>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="cth. Cetak Foto 4R"
              required
            />
          </Field>
          <Field label="Kategori" required>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {DEFAULT_SERVICE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga" required>
              <Input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                required
              />
            </Field>
            <Field label="Satuan">
              <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="lembar / meter / desain" />
            </Field>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => deleteService(confirmId)}
        title="Hapus layanan ini?"
        description="Layanan yang dihapus tidak akan muncul lagi di daftar pilihan transaksi."
      />
    </div>
  )
}
