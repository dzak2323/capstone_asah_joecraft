// Hitungan kalender yang aman dari zona waktu: semua dihitung dengan UTC
// dari teks "YYYY-MM-DD", jadi hasilnya sama di server mana pun.

export function keTanggalUTC(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export const keIso = (dt) => dt.toISOString().slice(0, 10)

export function tambahHari(iso, n) {
  const dt = keTanggalUTC(iso)
  dt.setUTCDate(dt.getUTCDate() + n)
  return keIso(dt)
}

/** Hari Senin dari minggu yang memuat tanggal ini. Minggu dihitung Senin sampai Minggu. */
export function seninMinggu(iso) {
  const hariKe = (keTanggalUTC(iso).getUTCDay() + 6) % 7 // Senin = 0
  return tambahHari(iso, -hariKe)
}

/** "2026-11" -> "2026-11-30" */
export function hariTerakhirBulan(ym) {
  const [y, m] = ym.split('-').map(Number)
  return keIso(new Date(Date.UTC(y, m, 0)))
}
