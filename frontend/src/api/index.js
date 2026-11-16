// Lapisan data. Sekarang memakai data contoh. Nanti isi tiap fungsi diganti dengan
// pemanggilan ke backend (GET /summary, /transactions, /forecast) tanpa mengubah
// halaman-halamannya.
//
// Untuk mencoba kondisi khusus tanpa backend, tambahkan di alamat:
//   ?simulasi=memuat   tampilan sedang memuat (lama)
//   ?simulasi=error    tampilan gagal dimuat
//   ?simulasi=kosong   tampilan data kosong
//   ?simulasi=normal   kembali normal
// Pilihannya diingat selama tab terbuka.

import { konfigurasi, prediksi, transaksi } from '../data/contoh'
import { hitungRingkasan, urutkanTerbaru } from './hitung'

export const PAKAI_DATA_CONTOH = true

const KUNCI_SIMULASI = 'jc_simulasi'

function bacaSimulasi() {
  const dariUrl = new URLSearchParams(window.location.search).get('simulasi')
  try {
    if (dariUrl === 'normal') sessionStorage.removeItem(KUNCI_SIMULASI)
    else if (dariUrl) sessionStorage.setItem(KUNCI_SIMULASI, dariUrl)
    return sessionStorage.getItem(KUNCI_SIMULASI)
  } catch {
    return dariUrl
  }
}

const tunggu = (ms) => new Promise((selesai) => setTimeout(selesai, ms))

async function jalankan(fn) {
  const simulasi = bacaSimulasi()
  await tunggu(simulasi === 'memuat' ? 10 * 60 * 1000 : 400)
  if (simulasi === 'error') throw new Error('Tidak bisa terhubung ke Google Sheets')
  return fn(simulasi)
}

/** Bulan yang bisa dipilih di Dashboard. */
export const BULAN_PILIHAN = ['2026-11', '2026-10']

/** Ringkasan satu bulan untuk Dashboard. */
export const getDashboard = (bulan) =>
  jalankan((simulasi) => hitungRingkasan(simulasi === 'kosong' ? [] : transaksi, konfigurasi, bulan))

/** Semua transaksi, terbaru di atas. Penyaringan dan halaman dikerjakan di frontend. */
export const getTransaksi = () =>
  jalankan((simulasi) => (simulasi === 'kosong' ? [] : urutkanTerbaru(transaksi)))

/** Perkiraan bulan depan. Mengembalikan null kalau belum ada. */
export const getPrediksi = () =>
  jalankan((simulasi) => {
    if (simulasi === 'kosong') return null
    const bulanBerjalan = hitungRingkasan(transaksi, konfigurasi, konfigurasi.tanggal_acuan.slice(0, 7))
    return { ...prediksi, berjalan: bulanBerjalan.pengeluaranBisnis }
  })
