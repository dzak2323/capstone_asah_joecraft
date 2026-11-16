// Fungsi format angka dan tanggal. Semua tanggal berbentuk teks "YYYY-MM-DD"
// dan sudah dalam WITA, jadi tidak ada konversi zona waktu di sini.

const BULAN_PENDEK = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const BULAN_PANJANG = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const pemisahRibuan = new Intl.NumberFormat('id-ID')

export const angka = (n) => pemisahRibuan.format(n)

export const rupiah = (n) => `Rp ${pemisahRibuan.format(n)}`

/** 2300000 -> "2,3 jt", 580000 -> "0,58 jt", 0 -> "0" */
export function juta(n) {
  if (n === 0) return '0'
  const v = Math.round(n / 10000) / 100
  return `${v.toLocaleString('id-ID', { maximumFractionDigits: 2 })} jt`
}

/** 8500000 -> "8,5 jt" (selalu satu desimal) */
export function juta1(n) {
  const v = Math.round(n / 100000) / 10
  return `${v.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} jt`
}

/** 75000 -> "75rb" */
export const ribu = (n) => `${Math.round(n / 1000)}rb`

export function pecahTanggal(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d }
}

/** "2026-11-09" -> "9 Nov" */
export function tanggalPendek(iso) {
  const { m, d } = pecahTanggal(iso)
  return `${d} ${BULAN_PENDEK[m - 1]}`
}

/** "2026-11" -> "November 2026" */
export function namaBulan(ym) {
  const [y, m] = ym.split('-').map(Number)
  return `${BULAN_PANJANG[m - 1]} ${y}`
}

/** "2026-11-09" -> "9 November 2026" */
export function tanggalPanjang(iso) {
  const { y, m, d } = pecahTanggal(iso)
  return `${d} ${BULAN_PANJANG[m - 1]} ${y}`
}

/** "10:42" -> "10.42" */
export const jamTitik = (jam) => jam.replace(':', '.')

/** "9 Nov, 11.20" dari tanggal dan jam */
export const tanggalJam = (iso, jam) => `${tanggalPendek(iso)}, ${jamTitik(jam)}`
