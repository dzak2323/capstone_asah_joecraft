/**
 * Mengembalikan tanggal hari terakhir dari suatu bulan (format YYYY-MM-DD)
 */
function hariTerakhirBulan(bulanStr) {
  const [tahun, bulan] = bulanStr.split('-').map(Number);
  const tanggalTerakhir = new Date(tahun, bulan, 0).getDate();
  const bStr = String(bulan).padStart(2, '0');
  const tStr = String(tanggalTerakhir).padStart(2, '0');
  return `${tahun}-${bStr}-${tStr}`;
}

/**
 * Menambahkan sejumlah hari ke sebuah string tanggal
 */
function tambahHari(tanggalStr, jumlahHari) {
  const d = new Date(tanggalStr);
  d.setDate(d.getDate() + jumlahHari);
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Makassar' });
}

/**
 * Mencari hari Senin pada minggu dari suatu tanggal
 */
function seninMinggu(tanggalStr) {
  const d = new Date(tanggalStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const senin = new Date(d.setDate(diff));
  return senin.toLocaleDateString('en-CA', { timeZone: 'Asia/Makassar' });
}

/**
 * Mengubah format YYYY-MM menjadi nama bulan lengkap (Bahasa Indonesia)
 */
function namaBulan(bulanStr) {
  const [tahun, bulan] = bulanStr.split('-');
  const daftarBulan = [
    '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return daftarBulan[parseInt(bulan, 10)] || bulanStr;
}

/**
 * Memecah tanggal menjadi objek tahun, bulan, dan hari (angka)
 */
function pecahTanggal(tanggalStr) {
  const [tahun, bulan, hari] = tanggalStr.split('-');
  return {
    tahun,
    bulan,
    d: parseInt(hari, 10),
  };
}

/**
 * Mengubah tanggal '2026-11-01' menjadi format pendek '1 Nov'
 */
function tanggalPendek(tanggalStr) {
  if (!tanggalStr) return '';
  const parts = String(tanggalStr).slice(0, 10).split('-');
  if (parts.length !== 3) return tanggalStr;
  const [tahun, bulan, tanggal] = parts;
  const namaBulanPendek = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const b = parseInt(bulan, 10);
  return `${parseInt(tanggal, 10)} ${namaBulanPendek[b] || ''}`;
}

/**
 * Format gabungan tanggal pendek dan jam
 */
function tanggalJam(tanggal, jam) {
  return `${tanggalPendek(tanggal)}, ${jam} WITA`;
}

/**
 * Mendapatkan tanggal dan jam saat ini berdasarkan zona waktu WITA (Asia/Makassar)
 */
function waktuSekarangWITA() {
  const now = new Date();
  const tanggal = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Makassar' });
  const jam = now.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Makassar',
    hour: '2-digit',
    minute: '2-digit',
  });
  return { tanggal, jam };
}

/**
 * Menormalkan baris data dari MySQL agar format tanggal, nominal, dan ID/nomor sinkron dengan frontend
 */
function formatBarisTransaksi(row) {
  const tgl =
    row.tanggal instanceof Date
      ? row.tanggal.toLocaleDateString('en-CA', { timeZone: 'Asia/Makassar' })
      : String(row.tanggal).slice(0, 10);

  return {
    ...row,
    nomor: row.id,
    tanggal: tgl,
    nominal: Number(row.nominal),
  };
}

module.exports = {
  hariTerakhirBulan,
  tambahHari,
  seninMinggu,
  namaBulan,
  pecahTanggal,
  tanggalPendek,
  tanggalJam,
  waktuSekarangWITA,
  formatBarisTransaksi,
};