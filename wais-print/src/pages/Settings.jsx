import { useRef, useState } from 'react'
import { Image as ImageIcon, Target, Coins, Download, Upload, Trash2, Save, Check } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Card, { CardHeader, CardBody } from '../components/Card'
import Button from '../components/Button'
import { Field, Input, Select } from '../components/Input'
import ConfirmDialog from '../components/ConfirmDialog'
import { useSettings } from '../hooks/useSettings'
import { exportAllData, importAllData, clearAllAppData } from '../lib/storage'
import { initials } from '../utils/format'

const CURRENCIES = [
  { value: 'IDR', label: 'Rupiah Indonesia (IDR)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'MYR', label: 'Ringgit Malaysia (MYR)' },
]

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)
  const fileInputRef = useRef(null)
  const importInputRef = useRef(null)

  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({ ...prev, storeLogo: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  function handleSave(e) {
    e.preventDefault()
    updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleExportData() {
    const data = exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `wais-print-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    importInputRef.current?.click()
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        importAllData(data)
        window.location.reload()
      } catch (err) {
        alert('File backup tidak valid.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleResetData() {
    clearAllAppData()
    window.location.reload()
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Pengaturan" subtitle="Sesuaikan informasi toko dan preferensi aplikasi" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Informasi Toko" subtitle="Nama dan logo yang tampil di seluruh aplikasi" />
            <CardBody>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-ink-800 border border-ink-600 flex items-center justify-center overflow-hidden shrink-0">
                    {form.storeLogo ? (
                      <img src={form.storeLogo} alt="Logo toko" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-slate-500">{initials(form.storeName || 'WP')}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                    <Button type="button" variant="secondary" size="sm" icon={ImageIcon} onClick={() => fileInputRef.current?.click()}>
                      Unggah Logo
                    </Button>
                    {form.storeLogo && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, storeLogo: '' }))}
                        className="text-[11px] text-slate-500 hover:text-danger text-left"
                      >
                        Hapus logo
                      </button>
                    )}
                  </div>
                </div>

                <Field label="Nama Toko" required>
                  <Input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} required />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Target Pendapatan Bulanan">
                    <Input
                      type="number"
                      min="0"
                      icon={Target}
                      value={form.monthlyTarget}
                      onChange={(e) => setForm({ ...form, monthlyTarget: e.target.value })}
                    />
                  </Field>
                  <Field label="Mata Uang">
                    <Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                      {CURRENCIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <Button type="submit" icon={saved ? Check : Save} className="w-full sm:w-auto">
                  {saved ? 'Tersimpan' : 'Simpan Pengaturan'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Data Aplikasi" subtitle="Cadangkan atau pulihkan data lokal" />
            <CardBody className="space-y-3">
              <Button variant="secondary" icon={Download} className="w-full justify-start" onClick={handleExportData}>
                Export Semua Data
              </Button>
              <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
              <Button variant="secondary" icon={Upload} className="w-full justify-start" onClick={handleImportClick}>
                Import Data Backup
              </Button>
              <Button variant="danger" icon={Trash2} className="w-full justify-start" onClick={() => setResetConfirm(true)}>
                Hapus Semua Data
              </Button>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-ink-700">
                Semua data (transaksi, pelanggan, layanan, pengeluaran, dan pengaturan) disimpan langsung di Local
                Storage perangkat ini. Lakukan export secara berkala untuk mencadangkan data.
              </p>
            </CardBody>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <Coins className="h-4 w-4 text-accent-400" />
              <h3 className="text-sm font-semibold text-slate-100">Tentang Wais Print</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Wais Print v1.0 — sistem manajemen usaha percetakan sederhana, cepat, dan berjalan sepenuhnya di
              perangkatmu tanpa server.
            </p>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={resetConfirm}
        onClose={() => setResetConfirm(false)}
        onConfirm={handleResetData}
        title="Hapus semua data aplikasi?"
        description="Seluruh transaksi, pelanggan, layanan, dan pengaturan akan dihapus permanen dari perangkat ini."
        confirmLabel="Ya, Hapus Semua"
      />
    </div>
  )
}
