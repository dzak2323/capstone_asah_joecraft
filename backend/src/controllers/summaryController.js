const db = require('../config/db');
const {
  hariTerakhirBulan,
  tambahHari,
  seninMinggu,
  namaBulan,
  pecahTanggal,
  tanggalPendek,
  tanggalJam,
  waktuSekarangWITA,
  formatBarisTransaksi,
} = require('../utils/helpers');

const tercatat = (t) => t.status === 'tercatat';
const jumlah = (daftar) => daftar.reduce((s, t) => s + t.nominal, 0);

const apakahTercampur = (t) =>
  (t.uang_dari === 'kas_usaha' && t.dipakai_untuk === 'pribadi') ||
  (t.uang_dari === 'uang_pribadi' && t.dipakai_untuk === 'usaha');

const urutkanTerbaru = (daftar) =>
  [...daftar].sort((a, b) => (b.tanggal + b.jam).localeCompare(a.tanggal + a.jam));

function labelMinggu(awal, akhir) {
  if (awal === akhir) return tanggalPendek(awal);
  return `${pecahTanggal(awal).d}-${tanggalPendek(akhir)}`;
}

exports.getSummary = async (req, res) => {
  try {
    const { bulan } = req.query;
    if (!bulan) {
      return res.status(400).json({ status: 'error', message: 'Parameter bulan wajib diisi (YYYY-MM)' });
    }

    const [rows] = await db.query('SELECT * FROM transactions');
    const semua = rows.map(formatBarisTransaksi);

    const [cfgRows] = await db.query('SELECT saldo_awal FROM konfigurasi WHERE id = 1');
    const saldoAwal = cfgRows.length > 0 ? Number(cfgRows[0].saldo_awal) : 2780000;

    const sekarang = waktuSekarangWITA();
    const acuan = sekarang.tanggal;

    const awalBulan = `${bulan}-01`;
    const akhirBulan = hariTerakhirBulan(bulan);
    const batas = acuan < akhirBulan ? acuan : akhirBulan;

    const bulanIni = semua.filter((t) => t.tanggal >= awalBulan && t.tanggal <= batas);
    const sah = bulanIni.filter(tercatat);
    const masuk = sah.filter((t) => t.jenis === 'masuk');
    const keluarUsaha = sah.filter((t) => t.jenis === 'keluar' && t.dipakai_untuk === 'usaha');

    const sampaiBatas = semua.filter((t) => t.tanggal <= batas && tercatat(t));
    const saldoKas =
      saldoAwal +
      jumlah(sampaiBatas.filter((t) => t.jenis === 'masuk')) -
      jumlah(sampaiBatas.filter((t) => t.jenis === 'keluar' && t.uang_dari === 'kas_usaha'));

    const mingguan = [];
    let mulai = seninMinggu(awalBulan);
    while (mulai <= batas) {
      const selesai = tambahHari(mulai, 6);
      const awal = mulai < awalBulan ? awalBulan : mulai;
      const akhir = selesai > akhirBulan ? akhirBulan : selesai;
      const dalam = (t) => t.tanggal >= awal && t.tanggal <= akhir;
      mingguan.push({
        label: labelMinggu(awal, akhir),
        masuk: jumlah(masuk.filter(dalam)),
        keluar: jumlah(keluarUsaha.filter(dalam)),
        berjalan: acuan.startsWith(bulan) && acuan >= mulai && acuan <= selesai,
      });
      mulai = tambahHari(mulai, 7);
    }

    const perKategori = new Map();
    for (const t of keluarUsaha) perKategori.set(t.kategori, (perKategori.get(t.kategori) ?? 0) + t.nominal);
    const totalKeluar = jumlah(keluarUsaha);
    const kategori = [...perKategori.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([nama, nilai]) => ({
        nama,
        nilai,
        persen: totalKeluar > 0 ? Math.round((nilai / totalKeluar) * 100) : 0,
      }));

    const urut = urutkanTerbaru(bulanIni);

    return res.status(200).json({
      status: 'success',
      data: {
        bulan,
        kosong: bulanIni.length === 0,
        periodeLabel: `${pecahTanggal(awalBulan).d}-${pecahTanggal(batas).d} ${namaBulan(bulan)}`,
        diperbaruiLabel: tanggalJam(sekarang.tanggal, sekarang.jam),
        saldoKas,
        pemasukan: jumlah(masuk),
        jumlahPenjualan: masuk.length,
        pengeluaranBisnis: totalKeluar,
        danaTercampur: jumlah(sah.filter(apakahTercampur)),
        mingguan,
        kategori,
        terbaru: urut.filter((t) => t.status !== 'dibatalkan').slice(0, 5),
        pesanBot: urut.slice(0, 3),
      },
    });
  } catch (error) {
    console.error('Error calculating summary:', error);
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }
};