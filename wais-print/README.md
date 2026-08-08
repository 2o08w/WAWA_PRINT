# Wais Print

Aplikasi web manajemen usaha percetakan — dibangun dengan React + Vite + Tailwind CSS.
Semua data disimpan di **Local Storage** browser, jadi tidak perlu database atau server tambahan.

## Fitur

- **Dashboard** — pendapatan, pengeluaran, keuntungan bersih, grafik, progress target, dan transaksi terbaru
- **Transaksi** — tambah/edit/hapus, pencarian, filter status & kategori
- **Target Bulanan** — atur target pendapatan, lihat progress dan riwayat 6 bulan
- **Layanan** — kelola daftar layanan percetakan beserta harga
- **Pelanggan** — data pelanggan, nomor WhatsApp, dan riwayat transaksi
- **Laporan** — filter hari/minggu/bulan/tahun, grafik pendapatan vs pengeluaran, export CSV
- **Pengaturan** — nama & logo toko, target bulanan, mata uang, export/import/reset data

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

## Build untuk produksi

```bash
npm run build
npm run preview   # opsional, untuk mencoba hasil build
```

Hasil build ada di folder `dist/`.

## Deploy ke Vercel

1. Push folder ini ke repository GitHub.
2. Import project di [vercel.com](https://vercel.com).
3. Vercel akan otomatis mendeteksi konfigurasi Vite (`npm run build`, output `dist`).
4. File `vercel.json` sudah disertakan agar routing SPA (React Router) berjalan dengan benar.

## Struktur Proyek

```
src/
├── components/    # Komponen UI reusable (Button, Card, Modal, dll)
│   └── charts/     # Komponen grafik (Recharts)
├── pages/         # Halaman utama aplikasi
├── layouts/       # Layout dengan Sidebar + Topbar
├── hooks/         # Custom hooks (CRUD + Local Storage)
├── lib/           # Helper Local Storage & data seed/default
├── utils/         # Fungsi utilitas (format, tanggal, export CSV, id)
├── App.jsx        # Routing aplikasi
├── main.jsx       # Entry point
└── index.css      # Tailwind + style dasar
```

## Catatan Data

Karena data tersimpan di Local Storage, data hanya tersedia di browser & perangkat yang sama.
Gunakan fitur **Export Semua Data** di halaman Pengaturan secara berkala untuk mencadangkan data,
dan **Import Data Backup** untuk memulihkannya di perangkat lain.
