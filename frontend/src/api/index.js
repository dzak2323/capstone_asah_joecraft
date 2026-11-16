import { konfigurasi, prediksi, transaksi } from '../data/contoh'
import { hitungRingkasan, urutkanTerbaru } from './hitung'

// Ubah menjadi false untuk menggunakan data asli dari Backend MySQL
export const PAKAI_DATA_CONTOH = false
const API_BASE_URL = 'http://localhost:5000/api'

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

async function jalankanSimulasi(fn) {
  const simulasi = bacaSimulasi()
  await tunggu(simulasi === 'memuat' ? 10 * 60 * 1000 : 400)
  if (simulasi === 'error') throw new Error('Tidak bisa terhubung ke server')
  return fn(simulasi)
}

async function fetchBackend(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  const result = await response.json()
  if (!response.ok || result.status === 'error') {
    throw new Error(result.message || 'Gagal mengambil data dari server')
  }
  return result.data
}

/** Bulan yang bisa dipilih di Dashboard. */
export const BULAN_PILIHAN = ['2026-11', '2026-10']

/** Ringkasan satu bulan untuk Dashboard. */
export const getDashboard = (bulan) => {
  if (PAKAI_DATA_CONTOH) {
    return jalankanSimulasi((simulasi) =>
      hitungRingkasan(simulasi === 'kosong' ? [] : transaksi, konfigurasi, bulan)
    )
  }
  return fetchBackend(`/summary?bulan=${bulan}`)
}

/** Semua transaksi, terbaru di atas. */
export const getTransaksi = () => {
  if (PAKAI_DATA_CONTOH) {
    return jalankanSimulasi((simulasi) =>
      simulasi === 'kosong' ? [] : urutkanTerbaru(transaksi)
    )
  }
  return fetchBackend('/transactions')
}

/** Perkiraan bulan depan. Mengembalikan null kalau belum ada. */
export const getPrediksi = () => {
  if (PAKAI_DATA_CONTOH) {
    return jalankanSimulasi((simulasi) => {
      if (simulasi === 'kosong') return null
      const bulanBerjalan = hitungRingkasan(
        transaksi,
        konfigurasi,
        konfigurasi.tanggal_acuan.slice(0, 7)
      )
      return { ...prediksi, berjalan: bulanBerjalan.pengeluaranBisnis }
    })
  }
  return fetchBackend('/forecast')
}