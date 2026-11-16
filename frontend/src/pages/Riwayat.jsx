import { useMemo, useState } from 'react'
import { getTransaksi } from '../api'
import { ringkasTabel, saring } from '../api/hitung'
import { DipakaiUntuk, Kartu, Kerangka, Nominal, PilContoh, PilStatus, Tombol, UangDari } from '../components/dasar'
import { KondisiGagal, KondisiKosong, KondisiMemuat } from '../components/kondisi'
import Pagination from '../components/Pagination'
import { useData } from '../hooks/useData'
import { unduhCsv } from '../lib/csv'
import { angka, rupiah, tanggalPendek } from '../lib/format'

const KOTAK = 'rounded-lg border border-garis-tebal bg-white px-3 py-2.5 text-[15px] text-teks'

function Isian({ id, label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] text-teks-redup">
        {label}
      </label>
      {children}
    </div>
  )
}

export default function Riwayat() {
  const { data, error, memuat, ulang } = useData(getTransaksi)
  const semua = useMemo(() => data ?? [], [data])

  // `ubahan` hanya berisi filter yang diubah pengguna. Sisanya memakai nilai bawaan
  // dari data: tanggal 1 bulan terakhir sampai transaksi terbaru, lainnya "semua".
  const [ubahan, setUbahan] = useState({})
  const [halaman, setHalaman] = useState(1)
  const [perHalaman, setPerHalaman] = useState(10)

  const bawaan = useMemo(() => {
    const terbaru = semua[0]?.tanggal ?? ''
    return {
      dari: terbaru ? `${terbaru.slice(0, 7)}-01` : '',
      sampai: terbaru,
      kategori: 'semua',
      uangDari: 'semua',
      dipakaiUntuk: 'semua',
      status: 'semua',
    }
  }, [semua])
  const f = { ...bawaan, ...ubahan }

  const ubah = (kunci, nilai) => {
    setUbahan((u) => ({ ...u, [kunci]: nilai }))
    setHalaman(1)
  }
  const aturUlang = () => {
    setUbahan({})
    setHalaman(1)
  }

  const kategoriPilihan = useMemo(() => [...new Set(semua.map((t) => t.kategori))].sort(), [semua])
  const hasil = useMemo(() => saring(semua, f), [semua, f.dari, f.sampai, f.kategori, f.uangDari, f.dipakaiUntuk, f.status]) // eslint-disable-line react-hooks/exhaustive-deps
  const ringkas = ringkasTabel(hasil)

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / perHalaman))
  const halamanAktif = Math.min(halaman, totalHalaman)
  const mulai = (halamanAktif - 1) * perHalaman
  const tampil = hasil.slice(mulai, mulai + perHalaman)

  const kosongSama = !memuat && !error && semua.length === 0
  const tanpaHasil = !memuat && !error && semua.length > 0 && hasil.length === 0

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-[26px] font-bold">Riwayat transaksi</h1>
          <p className="mb-0 mt-1 text-sm text-teks-redup">Semua pemasukan dan pengeluaran yang dicatat bot.</p>
        </div>
        <div className="flex items-center gap-3">
          <PilContoh />
          <Tombol varian="garis" disabled={semua.length === 0} onClick={() => unduhCsv(hasil)}>
            Unduh CSV
          </Tombol>
        </div>
      </header>

      <Kartu className="flex flex-wrap items-end gap-4 px-5 py-4">
        <Isian id="dari" label="Dari tanggal">
          <input id="dari" type="date" value={f.dari} onChange={(e) => ubah('dari', e.target.value)} className={KOTAK} />
        </Isian>
        <Isian id="sampai" label="Sampai tanggal">
          <input id="sampai" type="date" value={f.sampai} onChange={(e) => ubah('sampai', e.target.value)} className={KOTAK} />
        </Isian>
        <Isian id="kategori" label="Kategori">
          <select id="kategori" value={f.kategori} onChange={(e) => ubah('kategori', e.target.value)} className={KOTAK}>
            <option value="semua">Semua</option>
            {kategoriPilihan.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Isian>
        <Isian id="dana" label="Uang dari">
          <select id="dana" value={f.uangDari} onChange={(e) => ubah('uangDari', e.target.value)} className={KOTAK}>
            <option value="semua">Semua</option>
            <option value="kas_usaha">Kas usaha</option>
            <option value="uang_pribadi">Uang pribadi</option>
          </select>
        </Isian>
        <Isian id="untuk" label="Dipakai untuk">
          <select id="untuk" value={f.dipakaiUntuk} onChange={(e) => ubah('dipakaiUntuk', e.target.value)} className={KOTAK}>
            <option value="semua">Semua</option>
            <option value="usaha">Usaha</option>
            <option value="pribadi">Pribadi</option>
          </select>
        </Isian>
        <Isian id="status" label="Status">
          <select id="status" value={f.status} onChange={(e) => ubah('status', e.target.value)} className={KOTAK}>
            <option value="semua">Semua</option>
            <option value="tercatat">Tercatat</option>
            <option value="perlu_dicek">Perlu dicek</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
        </Isian>
      </Kartu>

      {memuat && <KondisiMemuat />}
      {error && <KondisiGagal onUlang={ulang} />}

      {!error && (
        <section className="grid grid-cols-4 gap-4">
          <Kartu className="px-[18px] py-4">
            <div className="text-sm text-teks-redup">Jumlah transaksi</div>
            {memuat ? <Kerangka className="mt-2 h-7 w-16" /> : <div className="mt-1 text-2xl font-bold">{ringkas.jumlah}</div>}
          </Kartu>
          <Kartu className="px-[18px] py-4">
            <div className="text-sm text-teks-redup">Total masuk</div>
            {memuat ? <Kerangka className="mt-2 h-7 w-32" /> : <div className="mt-1 text-2xl font-bold text-masuk">{rupiah(ringkas.masuk)}</div>}
          </Kartu>
          <Kartu className="px-[18px] py-4">
            <div className="text-sm text-teks-redup">Total keluar (termasuk keperluan pribadi)</div>
            {memuat ? <Kerangka className="mt-2 h-7 w-32" /> : <div className="mt-1 text-2xl font-bold">{rupiah(ringkas.keluar)}</div>}
          </Kartu>
          <div className="rounded-xl border border-netral-garis bg-netral-bg px-[18px] py-4 text-netral-teks">
            <div className="text-sm">Perlu dicek</div>
            {memuat ? <Kerangka className="mt-2 h-7 w-24" /> : <div className="mt-1 text-2xl font-bold">{ringkas.perluDicek} transaksi</div>}
          </div>
        </section>
      )}

      {kosongSama && (
        <Kartu>
          <KondisiKosong ikon="dokumen" judul="Belum ada transaksi">
            Transaksi akan muncul di sini setelah dicatat lewat WhatsApp. Contoh pesan yang bisa dikirim ke bot:
            <span className="mt-3 flex flex-wrap justify-center gap-2.5">
              <span className="rounded-full border border-garis bg-latar px-3.5 py-1.5 text-sm text-teks">jual pouch 1 transfer 700rb</span>
              <span className="rounded-full border border-garis bg-latar px-3.5 py-1.5 text-sm text-teks">beli benang 150 ribu</span>
            </span>
          </KondisiKosong>
        </Kartu>
      )}

      {tanpaHasil && (
        <Kartu>
          <KondisiKosong
            ikon="cari"
            judul="Tidak ada transaksi yang cocok"
            aksi={
              <Tombol varian="garis" onClick={aturUlang} className="mt-1.5">
                Atur ulang filter
              </Tombol>
            }
          >
            Tidak ada transaksi yang cocok dengan tanggal atau filter yang dipilih. Coba ubah tanggal atau filter lain.
          </KondisiKosong>
        </Kartu>
      )}

      {!error && !memuat && tampil.length > 0 && (
        <Kartu className="min-w-0 p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-garis text-left text-teks-redup">
                  <th className="px-2 py-2.5 font-semibold">Tanggal</th>
                  <th className="px-2 py-2.5 font-semibold">Pesan asli</th>
                  <th className="px-2 py-2.5 font-semibold">Kategori</th>
                  <th className="px-2 py-2.5 font-semibold">Uang dari</th>
                  <th className="px-2 py-2.5 font-semibold">Dipakai untuk</th>
                  <th className="px-2 py-2.5 font-semibold">Bayar</th>
                  <th className="px-2 py-2.5 font-semibold">Status</th>
                  <th className="px-2 py-2.5 text-right font-semibold">Nominal (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {tampil.map((t) => {
                  const batal = t.status === 'dibatalkan'
                  const redup = batal ? 'text-teks-redup' : ''
                  return (
                    <tr key={t.nomor} className="border-b border-garis-tipis last:border-0">
                      <td className={`px-2 py-3 ${redup}`}>{tanggalPendek(t.tanggal)}</td>
                      <td className={`px-2 py-3 ${redup} ${batal ? 'line-through' : ''}`}>{t.pesan_asli}</td>
                      <td className={`px-2 py-3 ${redup}`}>{t.kategori}</td>
                      <td className={`px-2 py-3 ${redup}`}>
                        <UangDari nilai={t.uang_dari} />
                      </td>
                      <td className={`px-2 py-3 ${redup}`}>
                        <DipakaiUntuk nilai={t.dipakai_untuk} />
                      </td>
                      <td className={`px-2 py-3 ${redup}`}>{t.metode_bayar ?? '-'}</td>
                      <td className="px-2 py-3">
                        <PilStatus status={t.status} />
                      </td>
                      <td className="px-2 py-3 text-right">
                        <Nominal transaksi={t} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-[18px] flex flex-wrap items-center justify-between gap-4 border-t border-garis-tipis pt-4">
            <div className="flex flex-wrap items-center gap-5 text-sm text-teks-redup">
              <div className="flex items-center gap-2">
                <label htmlFor="baris">Baris per halaman</label>
                <select
                  id="baris"
                  value={perHalaman}
                  onChange={(e) => {
                    setPerHalaman(Number(e.target.value))
                    setHalaman(1)
                  }}
                  className="min-h-11 rounded-lg border border-garis-tebal bg-white px-2.5 py-2 text-sm text-teks"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div>
                Menampilkan {angka(mulai + 1)}-{angka(mulai + tampil.length)} dari {angka(hasil.length)} transaksi
              </div>
            </div>
            <Pagination halaman={halamanAktif} totalHalaman={totalHalaman} onGanti={setHalaman} label="Halaman transaksi" />
          </div>
        </Kartu>
      )}

      {!error && (
        <p className="m-0 text-[13px] leading-normal text-teks-redup">
          Total masuk dan total keluar tidak menghitung transaksi berstatus Perlu dicek atau Dibatalkan. Transaksi Perlu dicek
          menunggu konfirmasi owner lewat WhatsApp, dan transaksi yang salah ditandai Dibatalkan, tidak dihapus. Unduh CSV
          mengunduh semua baris yang cocok dengan filter, bukan hanya halaman ini.
        </p>
      )}
    </>
  )
}
