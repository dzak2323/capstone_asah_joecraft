// Hitungan ringkasan dari daftar transaksi. Untuk sementara dikerjakan di frontend
// memakai data contoh. Setelah backend siap, hitungan ini pindah ke endpoint
// GET /summary dan frontend cukup menampilkan hasilnya.
//
// Aturan (sudah disetujui):
// - Hanya status "tercatat" yang dihitung. "perlu_dicek" dan "dibatalkan" tidak.
// - Pengeluaran bisnis = pengeluaran yang dipakai untuk usaha, apa pun sumber uangnya.
// - Saldo kas = saldo awal + pemasukan - pengeluaran yang uangnya dari kas usaha.
// - Dana tercampur = jumlah kedua arah (kas usaha ke pribadi, uang pribadi ke usaha).

import { namaBulan, pecahTanggal, tanggalJam, tanggalPendek } from '../lib/format'
import { hariTerakhirBulan, seninMinggu, tambahHari } from '../lib/tanggal'

const tercatat = (t) => t.status === 'tercatat'
const jumlah = (daftar) => daftar.reduce((s, t) => s + t.nominal, 0)

export const apakahTercampur = (t) =>
  (t.uang_dari === 'kas_usaha' && t.dipakai_untuk === 'pribadi') ||
  (t.uang_dari === 'uang_pribadi' && t.dipakai_untuk === 'usaha')

export const urutkanTerbaru = (daftar) =>
  [...daftar].sort((a, b) => (b.tanggal + b.jam).localeCompare(a.tanggal + a.jam))

function labelMinggu(awal, akhir) {
  if (awal === akhir) return tanggalPendek(awal)
  return `${pecahTanggal(awal).d}-${tanggalPendek(akhir)}`
}

export function hitungRingkasan(semua, konfigurasi, bulan) {
  const awalBulan = `${bulan}-01`
  const akhirBulan = hariTerakhirBulan(bulan)
  const acuan = konfigurasi.tanggal_acuan
  const batas = acuan < akhirBulan ? acuan : akhirBulan

  const bulanIni = semua.filter((t) => t.tanggal >= awalBulan && t.tanggal <= batas)
  const sah = bulanIni.filter(tercatat)
  const masuk = sah.filter((t) => t.jenis === 'masuk')
  const keluarUsaha = sah.filter((t) => t.jenis === 'keluar' && t.dipakai_untuk === 'usaha')

  const sampaiBatas = semua.filter((t) => t.tanggal <= batas && tercatat(t))
  const saldoKas =
    konfigurasi.saldo_awal +
    jumlah(sampaiBatas.filter((t) => t.jenis === 'masuk')) -
    jumlah(sampaiBatas.filter((t) => t.jenis === 'keluar' && t.uang_dari === 'kas_usaha'))

  const mingguan = []
  let mulai = seninMinggu(awalBulan)
  while (mulai <= batas) {
    const selesai = tambahHari(mulai, 6)
    const awal = mulai < awalBulan ? awalBulan : mulai
    const akhir = selesai > akhirBulan ? akhirBulan : selesai
    const dalam = (t) => t.tanggal >= awal && t.tanggal <= akhir
    mingguan.push({
      label: labelMinggu(awal, akhir),
      masuk: jumlah(masuk.filter(dalam)),
      keluar: jumlah(keluarUsaha.filter(dalam)),
      berjalan: acuan.startsWith(bulan) && acuan >= mulai && acuan <= selesai,
    })
    mulai = tambahHari(mulai, 7)
  }

  const perKategori = new Map()
  for (const t of keluarUsaha) perKategori.set(t.kategori, (perKategori.get(t.kategori) ?? 0) + t.nominal)
  const totalKeluar = jumlah(keluarUsaha)
  const kategori = [...perKategori.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([nama, nilai]) => ({ nama, nilai, persen: Math.round((nilai / totalKeluar) * 100) }))

  const urut = urutkanTerbaru(bulanIni)
  const diperbarui = konfigurasi.diperbarui_pada

  return {
    bulan,
    kosong: bulanIni.length === 0,
    periodeLabel: `${pecahTanggal(awalBulan).d}-${pecahTanggal(batas).d} ${namaBulan(bulan)}`,
    diperbaruiLabel: tanggalJam(diperbarui.tanggal, diperbarui.jam),
    saldoKas,
    pemasukan: jumlah(masuk),
    jumlahPenjualan: masuk.length,
    pengeluaranBisnis: totalKeluar,
    danaTercampur: jumlah(sah.filter(apakahTercampur)),
    mingguan,
    kategori,
    terbaru: urut.filter((t) => t.status !== 'dibatalkan').slice(0, 5),
    pesanBot: urut.slice(0, 3),
  }
}

/** Filter untuk halaman Riwayat. Nilai 'semua' atau kosong berarti tidak disaring. */
export function saring(daftar, f) {
  return daftar.filter(
    (t) =>
      (!f.dari || t.tanggal >= f.dari) &&
      (!f.sampai || t.tanggal <= f.sampai) &&
      (f.kategori === 'semua' || t.kategori === f.kategori) &&
      (f.uangDari === 'semua' || t.uang_dari === f.uangDari) &&
      (f.dipakaiUntuk === 'semua' || t.dipakai_untuk === f.dipakaiUntuk) &&
      (f.status === 'semua' || t.status === f.status),
  )
}

export function ringkasTabel(baris) {
  const sah = baris.filter(tercatat)
  return {
    jumlah: baris.length,
    masuk: jumlah(sah.filter((t) => t.jenis === 'masuk')),
    keluar: jumlah(sah.filter((t) => t.jenis === 'keluar')),
    perluDicek: baris.filter((t) => t.status === 'perlu_dicek').length,
  }
}
