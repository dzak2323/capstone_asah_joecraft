// Unduh daftar transaksi sebagai file CSV (dibuka di Excel atau Google Sheets).

const KOLOM = [
  ['nomor', 'Nomor'],
  ['tanggal', 'Tanggal'],
  ['jam', 'Jam'],
  ['pesan_asli', 'Pesan asli'],
  ['kategori', 'Kategori'],
  ['jenis', 'Jenis'],
  ['uang_dari', 'Uang dari'],
  ['dipakai_untuk', 'Dipakai untuk'],
  ['metode_bayar', 'Bayar'],
  ['status', 'Status'],
  ['nominal', 'Nominal'],
]

const kutip = (nilai) => `"${String(nilai ?? '').replaceAll('"', '""')}"`

export function buatCsv(baris) {
  const judul = KOLOM.map(([, nama]) => kutip(nama)).join(',')
  const isi = baris.map((t) => KOLOM.map(([kunci]) => kutip(t[kunci])).join(','))
  return [judul, ...isi].join('\r\n')
}

export function unduhCsv(baris, namaFile = 'riwayat-transaksi-jo-e-craft.csv') {
  // BOM di depan supaya Excel membaca huruf dengan benar.
  const blob = new Blob(['﻿', buatCsv(baris)], { type: 'text/csv;charset=utf-8' })
  const alamat = URL.createObjectURL(blob)
  const tautan = document.createElement('a')
  tautan.href = alamat
  tautan.download = namaFile
  document.body.appendChild(tautan)
  tautan.click()
  tautan.remove()
  URL.revokeObjectURL(alamat)
}
