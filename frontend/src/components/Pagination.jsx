// Pagination dengan tombol 44px, halaman aktif ditandai merah merek.

function daftarHalaman(sekarang, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const halaman = new Set([1, total, sekarang - 1, sekarang, sekarang + 1])
  const urut = [...halaman].filter((h) => h >= 1 && h <= total).sort((a, b) => a - b)
  const hasil = []
  urut.forEach((h, i) => {
    if (i > 0 && h - urut[i - 1] > 1) hasil.push('...')
    hasil.push(h)
  })
  return hasil
}

const PANAH_KIRI = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 6l-6 6 6 6" />
  </svg>
)
const PANAH_KANAN = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

const DASAR = 'inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm'

export default function Pagination({ halaman, totalHalaman, onGanti, label }) {
  const awal = halaman <= 1
  const akhir = halaman >= totalHalaman
  return (
    <nav aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        disabled={awal}
        onClick={() => onGanti(halaman - 1)}
        aria-label="Halaman sebelumnya"
        className={`${DASAR} px-3.5 ${awal ? 'cursor-default border-garis bg-latar text-teks-mati' : 'cursor-pointer border-garis-tebal bg-white text-teks hover:bg-latar'}`}
      >
        {PANAH_KIRI}Sebelumnya
      </button>
      {daftarHalaman(halaman, totalHalaman).map((h, i) =>
        h === '...' ? (
          <span key={`titik-${i}`} className="px-1 text-teks-redup" aria-hidden="true">
            ...
          </span>
        ) : (
          <button
            key={h}
            type="button"
            onClick={() => onGanti(h)}
            aria-current={h === halaman ? 'page' : undefined}
            aria-label={h === halaman ? `Halaman ${h}, halaman saat ini` : `Halaman ${h}`}
            className={`${DASAR} ${h === halaman ? 'cursor-default border-merek bg-merek font-semibold text-white' : 'cursor-pointer border-garis-tebal bg-white text-teks hover:bg-latar'}`}
          >
            {h}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={akhir}
        onClick={() => onGanti(halaman + 1)}
        aria-label="Halaman berikutnya"
        className={`${DASAR} px-3.5 ${akhir ? 'cursor-default border-garis bg-latar text-teks-mati' : 'cursor-pointer border-garis-tebal bg-white text-teks hover:bg-latar'}`}
      >
        Berikutnya{PANAH_KANAN}
      </button>
    </nav>
  )
}
