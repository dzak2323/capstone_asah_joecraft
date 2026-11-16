const db = require('../config/db');

exports.getForecast = async (req, res) => {
  try {
    // Ambil data transaksi 'keluar' yang dipakai untuk 'usaha' dan berstatus 'tercatat'
    const [rows] = await db.query(
      "SELECT tanggal, nominal FROM transactions WHERE jenis = 'keluar' AND dipakai_untuk = 'usaha' AND status = 'tercatat'"
    );

    if (rows.length === 0) {
      return res.status(200).json({ status: 'success', data: null });
    }

    // Hitung total pengeluaran per bulan untuk rata-rata sederhana
    const perBulan = {};
    let totalSemua = 0;

    rows.forEach((row) => {
      const bulanStr = new Date(row.tanggal).toISOString().slice(0, 7); // YYYY-MM
      const nilai = Number(row.nominal);
      perBulan[bulanStr] = (perBulan[bulanStr] || 0) + nilai;
      totalSemua += nilai;
    });

    const daftarBulan = Object.keys(perBulan).sort();
    const jumlahBulan = daftarBulan.length || 1;
    const rataRata = Math.round(totalSemua / jumlahBulan);

    // Bulan berjalan (berdasarkan bulan terbaru di data atau bulan saat ini)
    const bulanSekarang = new Date().toISOString().slice(0, 7);
    const berjalan = perBulan[bulanSekarang] || 0;

    // Struktur return disesuaikan dengan ekspektasi frontend (prediksi + berjalan)
    return res.status(200).json({
      status: 'success',
      data: {
        perkiraan: rataRata,
        berjalan: berjalan,
        catatan: `Dihitung dari rata-rata ${jumlahBulan} bulan transaksi usaha tercatat.`,
      },
    });
  } catch (error) {
    console.error('Error calculating forecast:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menghitung perkiraan pengeluaran',
    });
  }
};