// Komponen kecil yang dipakai di banyak halaman.

import { PAKAI_DATA_CONTOH } from '../api'

export function Kartu({ className = '', children, ...sisa }) {
  return (
    <div className={`rounded-xl border border-garis bg-white ${className}`} {...sisa}>
      {children}
    </div>
  )
}

export function Kerangka({ className = '', style }) {
  return <div className={`kerangka ${className}`} style={style} aria-hidden="true" />
}

const GAYA_STATUS = {
  tercatat: 'bg-aman-bg text-aman-teks',
  perlu_dicek: 'border border-netral-garis bg-netral-bg text-netral-teks',
  dibatalkan: 'border border-dashed border-teks-mati bg-white text-teks-redup',
}

const LABEL_STATUS = {
  tercatat: 'Tercatat',
  perlu_dicek: 'Perlu dicek',
  dibatalkan: 'Dibatalkan',
}

export function PilStatus({ status, className = '' }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] ${GAYA_STATUS[status]} ${className}`}>
      {LABEL_STATUS[status]}
    </span>
  )
}

/** Pil kuning untuk dana yang tercampur antara usaha dan pribadi. */
export function PilTercampur({ children }) {
  return (
    <span className="inline-block whitespace-nowrap rounded-full border border-peringatan-garis bg-peringatan-bg px-2.5 py-0.5 text-[13px] text-peringatan-teks">
      {children}
    </span>
  )
}

export function UangDari({ nilai }) {
  if (nilai === 'uang_pribadi') return <PilTercampur>Uang pribadi</PilTercampur>
  if (nilai === 'kas_usaha') return 'Kas usaha'
  return '-'
}

export function DipakaiUntuk({ nilai }) {
  if (nilai === 'pribadi') return <PilTercampur>Pribadi</PilTercampur>
  if (nilai === 'usaha') return 'Usaha'
  return '-'
}

/** Nominal dengan tanda + atau -, hijau untuk pemasukan, dicoret kalau dibatalkan. */
export function Nominal({ transaksi: t }) {
  const tanda = t.jenis === 'masuk' ? '+' : '-'
  const angka = new Intl.NumberFormat('id-ID').format(t.nominal)
  let gaya = t.jenis === 'masuk' ? 'text-masuk' : 'text-teks'
  if (t.status === 'dibatalkan') gaya = 'text-teks-redup line-through'
  return <span className={`whitespace-nowrap ${gaya}`}>{`${tanda} ${angka}`}</span>
}

export function PilContoh() {
  if (!PAKAI_DATA_CONTOH) return null
  return (
    <span className="inline-block rounded-full border border-peringatan-garis bg-white px-2.5 py-0.5 text-[13px] text-peringatan-teks">
      Data contoh
    </span>
  )
}

const GAYA_TOMBOL = {
  utama: 'bg-merek text-white hover:bg-merek-gelap border border-merek',
  garis: 'bg-white text-merek border border-merek hover:bg-latar',
  netral: 'bg-white text-teks border border-garis-tebal hover:bg-latar',
}

export function Tombol({ varian = 'utama', className = '', ...sisa }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-5 py-2.5 text-[15px] font-semibold disabled:cursor-default disabled:border-garis disabled:bg-latar disabled:text-teks-mati ${GAYA_TOMBOL[varian]} ${className}`}
      {...sisa}
    />
  )
}
