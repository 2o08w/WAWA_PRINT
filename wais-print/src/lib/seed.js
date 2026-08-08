export const DEFAULT_SETTINGS = {
  storeName: 'Wais Print',
  storeLogo: '',
  monthlyTarget: 15000000,
  currency: 'IDR',
}

export const DEFAULT_SERVICE_CATEGORIES = [
  'Print Dokumen',
  'Fotocopy',
  'Cetak Foto',
  'Poster',
  'Banner',
  'Undangan',
  'Desain Grafis',
  'Jasa Lainnya',
]

export const DEFAULT_SERVICES = [
  { id: 'svc_print_dokumen', name: 'Print Dokumen', category: 'Print Dokumen', price: 1000, unit: 'lembar' },
  { id: 'svc_fotocopy', name: 'Fotocopy', category: 'Fotocopy', price: 500, unit: 'lembar' },
  { id: 'svc_cetak_foto', name: 'Cetak Foto 4R', category: 'Cetak Foto', price: 3000, unit: 'lembar' },
  { id: 'svc_poster', name: 'Poster A3', category: 'Poster', price: 15000, unit: 'lembar' },
  { id: 'svc_banner', name: 'Banner Flexi', category: 'Banner', price: 25000, unit: 'meter' },
  { id: 'svc_undangan', name: 'Cetak Undangan', category: 'Undangan', price: 2500, unit: 'lembar' },
  { id: 'svc_desain', name: 'Jasa Desain Grafis', category: 'Desain Grafis', price: 50000, unit: 'desain' },
]

export const PAYMENT_STATUS = {
  LUNAS: 'Lunas',
  BELUM_LUNAS: 'Belum Lunas',
}

export const EXPENSE_CATEGORIES = [
  'Bahan Baku',
  'Listrik & Utilitas',
  'Sewa Tempat',
  'Gaji Karyawan',
  'Perawatan Mesin',
  'Lainnya',
]
