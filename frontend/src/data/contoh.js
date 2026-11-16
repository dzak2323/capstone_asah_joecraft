// DATA CONTOH untuk pengembangan frontend. Nanti diganti data asli dari backend
// (Google Sheets). Bentuk datanya mengikuti draf skema sheet Transaksi:
//   jenis        : 'masuk' | 'keluar'
//   uang_dari    : 'kas_usaha' | 'uang_pribadi' | null  (kosong untuk pemasukan)
//   dipakai_untuk: 'usaha' | 'pribadi' | null           (kosong untuk pemasukan)
//   status       : 'tercatat' | 'perlu_dicek' | 'dibatalkan'
// Kalau nama kolom di sheet berbeda, cukup sesuaikan di satu tempat: src/api/index.js.

export const konfigurasi = {
  // Saldo awal sementara. Rumus resminya masih perlu dibahas dengan tim.
  saldo_awal: 2780000,
  // Tanggal "hari ini" untuk data contoh. Dengan backend asli: tanggal sekarang di WITA.
  tanggal_acuan: '2026-11-09',
  diperbarui_pada: { tanggal: '2026-11-09', jam: '11:20' },
}

export const transaksi = [
  { nomor: 1, tanggal: '2026-11-01', jam: '10:00', pesan_asli: 'jual tas sulam tumpar 1 transfer 2jt3', keterangan: 'Jual tas sulam tumpar 1, transfer', kategori: 'Penjualan', jenis: 'masuk', nominal: 2300000, uang_dari: null, dipakai_untuk: null, metode_bayar: 'Transfer', status: 'tercatat' },
  { nomor: 2, tanggal: '2026-11-01', jam: '15:00', pesan_asli: 'beli kain doyo 580rb', keterangan: 'Beli kain doyo', kategori: 'Bahan baku', jenis: 'keluar', nominal: 580000, uang_dari: 'kas_usaha', dipakai_untuk: 'usaha', metode_bayar: null, status: 'tercatat' },
  { nomor: 3, tanggal: '2026-11-02', jam: '09:30', pesan_asli: 'jual tas doyo 1 transfer 1jt5', keterangan: 'Jual tas doyo 1, transfer', kategori: 'Penjualan', jenis: 'masuk', nominal: 1500000, uang_dari: null, dipakai_untuk: null, metode_bayar: 'Transfer', status: 'tercatat' },
  { nomor: 4, tanggal: '2026-11-02', jam: '13:00', pesan_asli: 'bayar upah penenun 500rb', keterangan: 'Upah penenun', kategori: 'Upah pengrajin', jenis: 'keluar', nominal: 500000, uang_dari: 'kas_usaha', dipakai_untuk: 'usaha', metode_bayar: null, status: 'tercatat' },
  { nomor: 5, tanggal: '2026-11-03', jam: '10:00', pesan_asli: 'jual dompet 2 transfer 1jt', keterangan: 'Jual dompet 2, transfer', kategori: 'Penjualan', jenis: 'masuk', nominal: 1000000, uang_dari: null, dipakai_untuk: null, metode_bayar: 'Transfer', status: 'tercatat' },
  { nomor: 6, tanggal: '2026-11-03', jam: '14:00', pesan_asli: 'beli kain tenun doyo 1jt4', keterangan: 'Beli kain tenun doyo', kategori: 'Bahan baku', jenis: 'keluar', nominal: 1400000, uang_dari: 'kas_usaha', dipakai_untuk: 'usaha', metode_bayar: 'Transfer', status: 'tercatat' },
  { nomor: 7, tanggal: '2026-11-04', jam: '09:00', pesan_asli: 'beli manik dan benang emas 760rb', keterangan: 'Beli manik dan benang emas', kategori: 'Bahan baku', jenis: 'keluar', nominal: 760000, uang_dari: 'kas_usaha', dipakai_untuk: 'usaha', metode_bayar: 'Tunai', status: 'tercatat' },
  { nomor: 8, tanggal: '2026-11-04', jam: '11:00', pesan_asli: 'bayar upah finishing 290rb', keterangan: 'Upah finishing', kategori: 'Upah pengrajin', jenis: 'keluar', nominal: 290000, uang_dari: 'kas_usaha', dipakai_untuk: 'usaha', metode_bayar: null, status: 'tercatat' },
  { nomor: 9, tanggal: '2026-11-04', jam: '15:00', pesan_asli: 'ongkir kirim pesanan Bali 300rb', keterangan: 'Ongkir kirim pesanan Bali', kategori: 'Ongkir', jenis: 'keluar', nominal: 300000, uang_dari: 'kas_usaha', dipakai_untuk: 'usaha', metode_bayar: 'Transfer', status: 'tercatat' },
  { nomor: 10, tanggal: '2026-11-05', jam: '08:40', pesan_asli: 'pake uang pribadi beli pewarna alam 2 kg 320rb', keterangan: 'Beli pewarna alam 2 kg', kategori: 'Bahan baku', jenis: 'keluar', nominal: 320000, uang_dari: 'uang_pribadi', dipakai_untuk: 'usaha', metode_bayar: 'Tunai', status: 'tercatat' },
  { nomor: 11, tanggal: '2026-11-05', jam: '13:00', pesan_asli: 'bayar upah penyulam Kubar 400rb', keterangan: 'Upah penyulam Kubar', kategori: 'Upah pengrajin', jenis: 'keluar', nominal: 400000, uang_dari: 'kas_usaha', dipakai_untuk: 'usaha', metode_bayar: null, status: 'tercatat' },
  { nomor: 12, tanggal: '2026-11-06', jam: '09:30', pesan_asli: 'pake uang usaha buat bayar listrik rumah 300rb', keterangan: 'Bayar listrik rumah', kategori: 'Keperluan pribadi', jenis: 'keluar', nominal: 300000, uang_dari: 'kas_usaha', dipakai_untuk: 'pribadi', metode_bayar: null, status: 'tercatat' },
  { nomor: 13, tanggal: '2026-11-06', jam: '14:00', pesan_asli: 'jual pouch 2 transfer 1jt4', keterangan: 'Jual pouch 2, transfer', kategori: 'Penjualan', jenis: 'masuk', nominal: 1400000, uang_dari: null, dipakai_untuk: null, metode_bayar: 'Transfer', status: 'tercatat' },
  { nomor: 14, tanggal: '2026-11-07', jam: '11:05', pesan_asli: 'jual tas doyo 1 lunas transfer 2jt3', keterangan: 'Jual tas doyo 1, transfer', kategori: 'Penjualan', jenis: 'masuk', nominal: 2300000, uang_dari: null, dipakai_untuk: null, metode_bayar: 'Transfer', status: 'tercatat' },
  { nomor: 15, tanggal: '2026-11-07', jam: '16:20', pesan_asli: 'ongkir kirim pesanan Jepang 450rb', keterangan: 'Ongkir kirim pesanan Jepang', kategori: 'Ongkir', jenis: 'keluar', nominal: 450000, uang_dari: 'kas_usaha', dipakai_untuk: 'usaha', metode_bayar: 'Transfer', status: 'tercatat' },
  { nomor: 16, tanggal: '2026-11-08', jam: '08:30', pesan_asli: 'beli box kemasan 200rb', keterangan: 'Beli box kemasan', kategori: 'Kemasan', jenis: 'keluar', nominal: 200000, uang_dari: 'kas_usaha', dipakai_untuk: 'usaha', metode_bayar: null, status: 'dibatalkan' },
  {
    nomor: 17, tanggal: '2026-11-08', jam: '09:05', pesan_asli: 'bayar sesuatu 50', keterangan: 'Bayar sesuatu 50', kategori: 'Lainnya', jenis: 'keluar', nominal: 50, uang_dari: 'kas_usaha', dipakai_untuk: 'usaha', metode_bayar: null, status: 'perlu_dicek',
    bacaan_bot: 'Bot belum bisa membaca tujuan dan nominalnya, jadi menanyakan ke owner: untuk apa dan berapa rupiah?',
  },
  { nomor: 18, tanggal: '2026-11-08', jam: '15:10', pesan_asli: 'Hari ini beli benang 150 ribu', keterangan: 'Beli benang', kategori: 'Bahan baku', jenis: 'keluar', nominal: 150000, uang_dari: 'kas_usaha', dipakai_untuk: 'usaha', metode_bayar: null, status: 'tercatat' },
  { nomor: 19, tanggal: '2026-11-09', jam: '10:42', pesan_asli: 'jual pouch 1 transfer 700rb', keterangan: 'Jual pouch 1, transfer', kategori: 'Penjualan', jenis: 'masuk', nominal: 700000, uang_dari: null, dipakai_untuk: null, metode_bayar: 'Transfer', status: 'tercatat' },
]

// Sheet Prediksi (diisi model tim DS). Bentuk ini hanya perkiraan sementara
// sesuai wireframe, dan akan disesuaikan dengan keluaran model sebenarnya.
export const prediksi = {
  bulan: '2026-12',
  total: 8500000,
  rendah: 7600000,
  tinggi: 9400000,
  jumlah_bulan_data: 5,
  realisasi: [
    { bulan: 'Jun', nilai: 6900000 },
    { bulan: 'Jul', nilai: 7300000 },
    { bulan: 'Agu', nilai: 7600000 },
    { bulan: 'Sep', nilai: 8200000 },
    { bulan: 'Okt', nilai: 7900000 },
  ],
  harga: {
    'Benang sulam': { satuan: 'gulung', nilai: [68000, 70000, 70000, 72000, 75000] },
    'Kain ulap doyo': { satuan: 'meter', nilai: [250000, 250000, 250000, 250000, 250000] },
    'Pewarna alam': { satuan: 'kg', nilai: [150000, 155000, 157000, 158000, 160000] },
  },
  bulan_harga: ['Jun', 'Jul', 'Agu', 'Sep', 'Okt'],
  kategori: [
    { nama: 'Bahan baku', oktober: 4800000, estimasi: 5200000, rendah: 4600000, tinggi: 5800000 },
    { nama: 'Upah pengrajin', oktober: 2000000, estimasi: 2000000, rendah: 1800000, tinggi: 2200000 },
    { nama: 'Ongkir', oktober: 600000, estimasi: 700000, rendah: 500000, tinggi: 900000 },
    { nama: 'Kemasan', oktober: 250000, estimasi: 300000, rendah: 200000, tinggi: 400000 },
    { nama: 'Lainnya', oktober: 250000, estimasi: 300000, rendah: 200000, tinggi: 400000 },
  ],
  catatan: [
    'Bahan baku sekitar 61% dari total estimasi, kategori terbesar.',
    'Harga benang sulam naik sekitar 10% sejak Juni.',
    'Perkiraan dihitung dari transaksi Juni sampai Oktober dan riwayat harga bahan.',
  ],
  belanja: [
    { nama: 'Benang sulam', satuan: 'gulung', harga: 75000, kebutuhan: 24, tren: 7 },
    { nama: 'Kain ulap doyo', satuan: 'meter', harga: 250000, kebutuhan: 6, tren: 0 },
    { nama: 'Pewarna alam', satuan: 'kg', harga: 160000, kebutuhan: 3, tren: 3 },
    { nama: 'Kain kanvas', satuan: 'meter', harga: 65000, kebutuhan: 10, tren: -2 },
    { nama: 'Lining waterproof', satuan: 'meter', harga: 38000, kebutuhan: 8, tren: 0 },
    { nama: 'Resleting', satuan: 'buah', harga: 4000, kebutuhan: 40, tren: 0 },
    { nama: 'Tali webbing', satuan: 'meter', harga: 8000, kebutuhan: 10, tren: 0 },
    { nama: 'Kancing magnet', satuan: 'set', harga: 3000, kebutuhan: 20, tren: 0 },
    { nama: 'Manik kayu', satuan: 'pak', harga: 15000, kebutuhan: 4, tren: 2 },
    { nama: 'Benang jahit', satuan: 'gulung', harga: 12000, kebutuhan: 5, tren: 0 },
    { nama: 'Lem kain', satuan: 'botol', harga: 18000, kebutuhan: 2, tren: 0 },
    { nama: 'Interfacing', satuan: 'meter', harga: 10000, kebutuhan: 1, tren: 0 },
  ],
  metode:
    'Metode: rata-rata bergerak dari bulan-bulan sebelumnya, disesuaikan tren harga bahan. Perkiraan diperbarui oleh model setiap akhir bulan.',
}
