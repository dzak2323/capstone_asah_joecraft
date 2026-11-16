import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BULAN_PILIHAN, getDashboard } from '../api'
import { ArusKasMingguan, DonatKategori, Legenda } from '../components/grafik'
import { LEGENDA_ARUS_KAS } from '../components/legenda'
import { DipakaiUntuk, Kartu, Kerangka, Nominal, PilContoh, PilStatus, UangDari } from '../components/dasar'
import { KondisiGagal, KondisiKosong, KondisiMemuat } from '../components/kondisi'
import { useData } from '../hooks/useData'
import { namaBulan, rupiah, tanggalJam, tanggalPendek } from '../lib/format'

function BacaBot({ t }) {
  if (t.bacaan_bot) return t.bacaan_bot
  const kat = t.kategori.toLowerCase()
  if (t.jenis === 'masuk') return `Dibaca sebagai: masuk ${rupiah(t.nominal)}, ${kat}.`
  const dari = t.uang_dari === 'uang_pribadi' ? 'uang pribadi' : 'kas usaha'
  return `Dibaca sebagai: keluar ${rupiah(t.nominal)}, ${kat}, ${dari} untuk ${t.dipakai_untuk}.`
}

function KerangkaDashboard() {
  return (
    <>
      <KondisiMemuat />
      <section className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Kartu key={i} className="flex flex-col gap-3 p-[18px]">
            <Kerangka className="h-3.5 w-[110px]" />
            <Kerangka className="h-7 w-[170px]" />
            <Kerangka className="h-3 w-[140px]" />
          </Kartu>
        ))}
      </section>
      <section className="grid grid-cols-3 gap-4">
        <Kartu className="col-span-2 p-5">
          <Kerangka className="h-[18px] w-[180px]" />
          <div className="mt-[18px] flex h-[200px] items-end gap-9 border-b border-garis-tebal px-6">
            {[60, 110, 80, 150, 100, 130].map((h, i) => (
              <Kerangka key={i} className="w-9" style={{ height: h }} />
            ))}
          </div>
        </Kartu>
        <Kartu className="p-5">
          <Kerangka className="h-[18px] w-[190px]" />
          <div className="mt-[18px] flex items-center gap-5">
            <div className="flex h-[130px] w-[130px] shrink-0 items-center justify-center rounded-full bg-kerangka">
              <div className="h-[74px] w-[74px] rounded-full bg-white" />
            </div>
            <div className="flex flex-col gap-3">
              <Kerangka className="h-3.5 w-[110px]" />
              <Kerangka className="h-3.5 w-[130px]" />
              <Kerangka className="h-3.5 w-[90px]" />
            </div>
          </div>
        </Kartu>
      </section>
      <section className="grid grid-cols-3 gap-4">
        <Kartu className="col-span-2 p-5">
          <Kerangka className="h-[18px] w-[170px]" />
          <div className="mt-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-[18px] border-b border-garis-tipis py-3">
                <Kerangka className="h-3.5 w-[60px]" />
                <Kerangka className="h-3.5 w-[170px]" />
                <Kerangka className="h-3.5 w-[90px]" />
                <Kerangka className="h-3.5 w-20" />
                <Kerangka className="ml-auto h-3.5 w-[70px]" />
              </div>
            ))}
          </div>
        </Kartu>
        <Kartu className="flex flex-col gap-[18px] p-5">
          <Kerangka className="h-[18px] w-[180px]" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Kerangka className="h-3 w-[90px]" />
              <Kerangka className="h-3.5 w-full" />
              <Kerangka className="h-3 w-4/5" />
            </div>
          ))}
        </Kartu>
      </section>
    </>
  )
}

export default function Dashboard() {
  const [bulan, setBulan] = useState(BULAN_PILIHAN[0])
  const { data, error, memuat, ulang } = useData(getDashboard, [bulan])

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-[600px]">
          <h1 className="m-0 text-[26px] font-bold">Dashboard</h1>
          <p className="mb-0 mt-1 text-sm text-teks-redup">
            {data && !data.kosong
              ? `Ringkasan keuangan ${data.periodeLabel}. Transaksi berstatus Perlu dicek belum dihitung di kartu dan grafik.`
              : 'Ringkasan keuangan bulan ini.'}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <label htmlFor="bulan" className="text-sm text-teks-redup">
            Bulan
          </label>
          <select
            id="bulan"
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            className="rounded-lg border border-garis-tebal bg-white px-3 py-[9px] text-[15px] text-teks"
          >
            {BULAN_PILIHAN.map((b) => (
              <option key={b} value={b}>
                {namaBulan(b)}
              </option>
            ))}
          </select>
          {data && <span className="text-[13px] text-teks-redup">Diperbarui {data.diperbaruiLabel}</span>}
          <PilContoh />
        </div>
      </header>

      {memuat && <KerangkaDashboard />}
      {error && <KondisiGagal onUlang={ulang} />}

      {data?.kosong && (
        <Kartu>
          <KondisiKosong ikon="dokumen" judul="Belum ada transaksi bulan ini">
            Ringkasan akan muncul setelah transaksi dicatat lewat WhatsApp. Pilih bulan lain di kanan atas untuk melihat bulan
            sebelumnya.
          </KondisiKosong>
        </Kartu>
      )}

      {data && !data.kosong && (
        <>
          <section className="grid grid-cols-4 gap-4">
            <Kartu className="p-[18px]">
              <div className="text-sm text-teks-redup">Saldo kas bisnis</div>
              <div className="mt-1.5 text-[26px] font-bold">{rupiah(data.saldoKas)}</div>
              <div className="mt-1.5 text-[13px] text-teks-redup">Saldo awal + masuk - keluar</div>
            </Kartu>
            <Kartu className="p-[18px]">
              <div className="text-sm text-teks-redup">Pemasukan bulan ini</div>
              <div className="mt-1.5 text-[26px] font-bold text-masuk">{rupiah(data.pemasukan)}</div>
              <div className="mt-1.5 text-[13px] text-teks-redup">{data.jumlahPenjualan} transaksi penjualan</div>
            </Kartu>
            <Kartu className="p-[18px]">
              <div className="text-sm text-teks-redup">Pengeluaran bisnis</div>
              <div className="mt-1.5 text-[26px] font-bold text-teks">{rupiah(data.pengeluaranBisnis)}</div>
              <div className="mt-1.5 text-[13px] text-teks-redup">Tidak termasuk keperluan pribadi</div>
            </Kartu>
            <Link
              to="/riwayat"
              className="block rounded-xl border border-peringatan-garis bg-peringatan-bg p-[18px] text-peringatan-teks"
            >
              <div className="text-sm">Dana tercampur</div>
              <div className="mt-1.5 text-[26px] font-bold">{rupiah(data.danaTercampur)}</div>
              <div className="mt-1.5 text-[13px]">Uang usaha dan pribadi bulan ini. Lihat rinciannya di Riwayat</div>
            </Link>
          </section>

          <section className="grid grid-cols-3 gap-4">
            <Kartu className="col-span-2 min-w-0 p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="m-0 text-[17px] font-bold">Arus kas per minggu</h2>
                <Legenda item={LEGENDA_ARUS_KAS} />
              </div>
              <div className="mt-3.5">
                <ArusKasMingguan data={data.mingguan} />
              </div>
            </Kartu>
            <Kartu className="p-5">
              <h2 className="m-0 text-[17px] font-bold">Pengeluaran per kategori</h2>
              <DonatKategori data={data.kategori} />
            </Kartu>
          </section>

          <section className="grid grid-cols-3 gap-4">
            <Kartu className="col-span-2 min-w-0 p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="m-0 text-[17px] font-bold">Transaksi terbaru</h2>
                <Link to="/riwayat" className="text-sm font-semibold text-merek hover:text-merek-tautan">
                  Lihat semua
                </Link>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[580px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-garis text-left text-teks-redup">
                      <th className="px-1.5 py-2 font-semibold">Tanggal</th>
                      <th className="px-1.5 py-2 font-semibold">Keterangan</th>
                      <th className="px-1.5 py-2 font-semibold">Kategori</th>
                      <th className="px-1.5 py-2 font-semibold">Uang dari</th>
                      <th className="px-1.5 py-2 font-semibold">Dipakai untuk</th>
                      <th className="px-1.5 py-2 text-right font-semibold">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.terbaru.map((t) => (
                      <tr key={t.nomor} className="border-b border-garis-tipis last:border-0">
                        <td className="px-1.5 py-2.5">{tanggalPendek(t.tanggal)}</td>
                        <td className="px-1.5 py-2.5">
                          {t.keterangan}
                          {t.status === 'perlu_dicek' && <PilStatus status="perlu_dicek" className="ml-1.5" />}
                        </td>
                        <td className="px-1.5 py-2.5">{t.kategori}</td>
                        <td className="px-1.5 py-2.5">
                          <UangDari nilai={t.uang_dari} />
                        </td>
                        <td className="px-1.5 py-2.5">
                          <DipakaiUntuk nilai={t.dipakai_untuk} />
                        </td>
                        <td className="px-1.5 py-2.5 text-right">
                          <Nominal transaksi={t} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Kartu>

            <Kartu className="flex flex-col gap-3 p-5">
              <h2 className="m-0 text-[17px] font-bold">Pesan terakhir ke bot</h2>
              <p className="m-0 text-[13px] text-teks-redup">
                Terbaru di atas, sama seperti tabel. Berisi pesan owner dan hasil bacaan bot.
              </p>
              {data.pesanBot.map((t, i) => (
                <div key={t.nomor} className={`flex flex-col gap-1.5 ${i > 0 ? 'border-t border-garis-tipis pt-3' : ''}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-teks-redup">{tanggalJam(t.tanggal, t.jam)}</span>
                    <PilStatus status={t.status} />
                  </div>
                  <div className="text-sm font-semibold leading-snug">&ldquo;{t.pesan_asli}&rdquo;</div>
                  <div className="text-[13px] leading-snug text-teks-redup">
                    <BacaBot t={t} />
                  </div>
                </div>
              ))}
            </Kartu>
          </section>
        </>
      )}
    </>
  )
}
