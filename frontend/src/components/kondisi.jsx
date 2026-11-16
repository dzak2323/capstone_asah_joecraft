// Tampilan untuk kondisi khusus: gagal dimuat dan data kosong.

import { Kartu, Tombol } from './dasar'

const IKON = {
  peringatan: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3C4046" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5v.01" />
    </svg>
  ),
  dokumen: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
      <path d="M10 13h6" />
      <path d="M10 17h4" />
    </svg>
  ),
  cari: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  ),
  kalender: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16" />
      <path d="M9 3v4" />
      <path d="M15 3v4" />
    </svg>
  ),
}

export function KondisiKosong({ ikon = 'dokumen', judul, children, aksi, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-3 px-6 py-14 text-center ${className}`}>
      {IKON[ikon]}
      <h2 className="m-0 text-xl font-bold">{judul}</h2>
      <div className="max-w-[480px] text-sm leading-relaxed text-teks-redup">{children}</div>
      {aksi}
    </div>
  )
}

export function KondisiGagal({ onUlang }) {
  return (
    <Kartu role="alert" className="mx-auto mt-10 flex w-full max-w-[640px] flex-col items-center gap-3.5 px-8 py-12 text-center">
      {IKON.peringatan}
      <h2 className="m-0 text-xl font-bold">Data belum bisa dimuat</h2>
      <p className="m-0 max-w-[460px] text-sm leading-relaxed text-teks-redup">
        Aplikasi tidak bisa mengambil data dari Google Sheets. Catatan transaksi tetap tersimpan. Coba lagi dalam beberapa saat.
      </p>
      <Tombol onClick={onUlang} className="mt-1.5">
        Coba lagi
      </Tombol>
      <p className="m-0 text-[13px] leading-normal text-teks-redup">Jika tetap gagal, hubungi tim pengembang.</p>
    </Kartu>
  )
}

export function KondisiMemuat({ children = 'Mengambil data dari Google Sheets...' }) {
  return (
    <div role="status" className="flex items-center gap-2.5 text-sm text-teks-redup">
      <span className="putaran" aria-hidden="true" />
      {children}
    </div>
  )
}
