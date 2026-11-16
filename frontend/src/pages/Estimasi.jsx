import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getPrediksi } from '../api'
import { Kartu, Kerangka, PilContoh } from '../components/dasar'
import { GrafikBulanan, GrafikHarga, Legenda } from '../components/grafik'
import { LEGENDA_BULANAN } from '../components/legenda'
import { KondisiGagal, KondisiKosong, KondisiMemuat } from '../components/kondisi'
import Pagination from '../components/Pagination'
import { useData } from '../hooks/useData'
import { angka, rupiah } from '../lib/format'

function TrenHarga({ nilai }) {
  if (nilai > 0) return <>&#9650; Naik {nilai}%</>
  if (nilai < 0) return <>&#9660; Turun {Math.abs(nilai)}%</>
  return 'Stabil'
}

function KerangkaEstimasi() {
  return (
    <>
      <KondisiMemuat />
      <section className="grid grid-cols-3 gap-4">
        <Kartu className="col-span-2 flex flex-col gap-3 p-[22px]">
          <Kerangka className="h-3.5 w-[220px]" />
          <Kerangka className="h-9 w-[220px]" />
          <Kerangka className="h-3.5 w-[300px]" />
          <Kerangka className="mt-2 h-3 w-full" />
        </Kartu>
        <Kartu className="flex flex-col gap-3 p-[22px]">
          <Kerangka className="h-4 w-[120px]" />
          <Kerangka className="h-3.5 w-full" />
          <Kerangka className="h-3.5 w-4/5" />
        </Kartu>
      </section>
      <section className="grid grid-cols-3 gap-4">
        <Kartu className="col-span-2 p-5">
          <Kerangka className="h-[18px] w-[230px]" />
          <Kerangka className="mt-4 h-[236px] w-full" />
        </Kartu>
        <Kartu className="p-5">
          <Kerangka className="h-[18px] w-[150px]" />
          <Kerangka className="mt-4 h-[170px] w-full" />
        </Kartu>
      </section>
    </>
  )
}

export default function Estimasi() {
  const { data, error, memuat, ulang } = useData(getPrediksi)
  const [bahan, setBahan] = useState('Benang sulam')
  const [halaman, setHalaman] = useState(1)
  const [perHalaman, setPerHalaman] = useState(5)

  const kosong = !memuat && !error && data === null

  const belanja = data?.belanja ?? []
  const totalBelanja = belanja.reduce((s, b) => s + b.harga * b.kebutuhan, 0)
  const totalHalaman = Math.max(1, Math.ceil(belanja.length / perHalaman))
  const halamanAktif = Math.min(halaman, totalHalaman)
  const mulai = (halamanAktif - 1) * perHalaman
  const tampil = belanja.slice(mulai, mulai + perHalaman)
  const subtotal = tampil.reduce((s, b) => s + b.harga * b.kebutuhan, 0)

  const totalKategori = data
    ? data.kategori.reduce(
        (s, k) => ({ oktober: s.oktober + k.oktober, estimasi: s.estimasi + k.estimasi }),
        { oktober: 0, estimasi: 0 },
      )
    : null

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="m-0 text-[26px] font-bold">Estimasi pengeluaran Desember 2026</h1>
          <p className="mb-0 mt-1 text-sm text-teks-redup">Perkiraan modal yang perlu disiapkan.</p>
        </div>
        <PilContoh />
      </header>

      {memuat && <KerangkaEstimasi />}
      {error && <KondisiGagal onUlang={ulang} />}

      {kosong && (
        <Kartu className="mx-auto mt-10 w-full max-w-[640px]">
          <KondisiKosong
            ikon="kalender"
            judul="Perkiraan belum tersedia"
            aksi={
              <Link to="/" className="mt-1.5 text-sm font-semibold text-merek hover:text-merek-tautan">
                Lihat pengeluaran bulan ini di Dashboard
              </Link>
            }
          >
            Perkiraan untuk Desember 2026 belum dibuat. Halaman ini akan terisi otomatis setelah perkiraannya tersedia.
          </KondisiKosong>
        </Kartu>
      )}

      {data && (
        <>
          <section className="grid grid-cols-3 gap-4">
            <Kartu className="col-span-2 p-[22px]">
              <div className="text-sm text-teks-redup">Total estimasi pengeluaran bisnis</div>
              <div className="mt-1.5 text-[34px] font-bold">{rupiah(data.total)}</div>
              <div className="mt-1.5 text-[15px] text-teks-sedang">
                Kisaran {rupiah(data.rendah)} sampai {rupiah(data.tinggi)}
              </div>
              <div className="relative mt-4 h-3 rounded-md bg-[#efefed]" aria-hidden="true">
                <div className="absolute bottom-0 left-[30%] top-0 w-[40%] rounded-md bg-keluar" />
              </div>
              <div className="mt-1.5 flex justify-between text-xs text-teks-redup">
                <span>Terendah</span>
                <span>Tertinggi</span>
              </div>
            </Kartu>
            <div className="rounded-xl border border-peringatan-garis bg-peringatan-bg p-[22px] text-peringatan-teks">
              <div className="text-[15px] font-bold">Perlu diketahui</div>
              <p className="mb-0 mt-2 text-sm leading-relaxed">
                Perkiraan ini dihitung dari catatan {data.jumlah_bulan_data} bulan terakhir, jadi kisarannya masih lebar. Makin
                banyak bulan yang tercatat, kisaran makin sempit dan perkiraan makin tepat.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-4">
            <Kartu className="col-span-2 min-w-0 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="m-0 text-[17px] font-bold">Pengeluaran bisnis per bulan</h2>
                <Legenda item={LEGENDA_BULANAN} />
              </div>
              <GrafikBulanan
                realisasi={data.realisasi}
                berjalan={data.berjalan}
                estimasi={{ total: data.total, rendah: data.rendah, tinggi: data.tinggi }}
              />
            </Kartu>

            <Kartu className="p-5">
              <h2 className="m-0 text-[17px] font-bold">Harga {bahan.toLowerCase()}</h2>
              <p className="mb-0 mt-1 text-[13px] text-teks-redup">
                Per {data.harga[bahan].satuan}, {data.bulan_harga.length} bulan terakhir
              </p>
              <GrafikHarga nilai={data.harga[bahan].nilai} bulan={data.bulan_harga} nama={bahan} />
              <label htmlFor="bahan" className="mt-4 block text-[13px] text-teks-redup">
                Lihat bahan lain
              </label>
              <select
                id="bahan"
                value={bahan}
                onChange={(e) => setBahan(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-garis-tebal bg-white px-3 py-2.5 text-[15px] text-teks"
              >
                {Object.keys(data.harga).map((nama) => (
                  <option key={nama}>{nama}</option>
                ))}
              </select>
            </Kartu>
          </section>

          <section className="grid grid-cols-3 gap-4">
            <Kartu className="col-span-2 min-w-0 p-5">
              <h2 className="m-0 text-[17px] font-bold">Rincian per kategori</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-garis text-left text-teks-redup">
                      <th className="px-2 py-2.5 font-semibold">Kategori</th>
                      <th className="px-2 py-2.5 text-right font-semibold">Oktober (Rp)</th>
                      <th className="px-2 py-2.5 text-right font-semibold">Estimasi Desember (Rp)</th>
                      <th className="px-2 py-2.5 text-right font-semibold">Kisaran (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.kategori.map((k) => (
                      <tr key={k.nama} className="border-b border-garis-tipis">
                        <td className="px-2 py-3">{k.nama}</td>
                        <td className="px-2 py-3 text-right">{angka(k.oktober)}</td>
                        <td className="px-2 py-3 text-right font-bold">{angka(k.estimasi)}</td>
                        <td className="px-2 py-3 text-right">
                          {angka(k.rendah)} - {angka(k.tinggi)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="px-2 py-3 font-bold">Total</td>
                      <td className="px-2 py-3 text-right font-bold">{angka(totalKategori.oktober)}</td>
                      <td className="px-2 py-3 text-right font-bold">{angka(totalKategori.estimasi)}</td>
                      <td className="px-2 py-3 text-right font-bold">
                        {angka(data.rendah)} - {angka(data.tinggi)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Kartu>

            <Kartu className="p-5">
              <h2 className="m-0 text-[17px] font-bold">Catatan dari perkiraan</h2>
              <ul className="mb-0 mt-3 flex list-disc flex-col gap-2.5 pl-5 text-sm leading-relaxed">
                {data.catatan.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Kartu>
          </section>

          <Kartu className="min-w-0 p-5">
            <h2 className="m-0 text-[17px] font-bold">Daftar belanja bahan baku Desember</h2>
            <p className="mb-0 mt-1 text-[13px] text-teks-redup">
              Perkiraan kebutuhan dikalikan harga terakhir, untuk menyiapkan modal sebelum belanja.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-garis text-left text-teks-redup">
                    <th className="px-2 py-2.5 font-semibold">Bahan</th>
                    <th className="px-2 py-2.5 font-semibold">Satuan</th>
                    <th className="px-2 py-2.5 text-right font-semibold">Harga terakhir (Rp)</th>
                    <th className="px-2 py-2.5 text-right font-semibold">Perkiraan kebutuhan</th>
                    <th className="px-2 py-2.5 text-right font-semibold">Estimasi biaya (Rp)</th>
                    <th className="px-2 py-2.5 font-semibold">Tren harga 3 bulan</th>
                  </tr>
                </thead>
                <tbody>
                  {tampil.map((b) => (
                    <tr key={b.nama} className="border-b border-garis-tipis last:border-0">
                      <td className="px-2 py-3">{b.nama}</td>
                      <td className="px-2 py-3">{b.satuan}</td>
                      <td className="px-2 py-3 text-right">{angka(b.harga)}</td>
                      <td className="px-2 py-3 text-right">{b.kebutuhan}</td>
                      <td className="px-2 py-3 text-right font-bold">{angka(b.harga * b.kebutuhan)}</td>
                      <td className="px-2 py-3">
                        <TrenHarga nilai={b.tren} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mb-0 mt-3 text-sm text-teks-sedang">
              Subtotal halaman ini {rupiah(subtotal)} dari total bahan baku {rupiah(totalBelanja)} ({belanja.length} bahan).
            </p>

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
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                <div>
                  Menampilkan {mulai + 1}-{mulai + tampil.length} dari {belanja.length} bahan
                </div>
              </div>
              <Pagination halaman={halamanAktif} totalHalaman={totalHalaman} onGanti={setHalaman} label="Halaman daftar belanja" />
            </div>
          </Kartu>

          <p className="m-0 text-[13px] leading-normal text-teks-redup">{data.metode}</p>
        </>
      )}
    </>
  )
}
