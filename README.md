# Dashboard Jo-E Craft

Dashboard web untuk melihat laporan keuangan UMKM Jo-E Craft.
Tim A26-CS103.

## Struktur
- frontend/  React (Vite)
- backend/   Node.js (Express)

## Menjalankan frontend
```
cd frontend
npm install
npm run dev
```
Buka alamat yang tampil di terminal (biasanya http://localhost:5173).
Saat ini frontend memakai **data contoh** (`frontend/src/data/contoh.js`) dan login
sementara menerima email apa pun. Backend dan Google Sheets belum tersambung.

Untuk mencoba kondisi khusus, tambahkan di alamat: `?simulasi=memuat`, `?simulasi=error`,
`?simulasi=kosong`, atau `?simulasi=normal` untuk kembali.
