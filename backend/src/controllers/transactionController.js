const db = require('../config/db');

// 1. Mengambil semua data transaksi (untuk halaman Riwayat)
exports.getAllTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM transactions ORDER BY tanggal DESC, jam DESC'
    );
    return res.status(200).json({
      status: 'success',
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data transaksi dari database',
    });
  }
};

// 2. Menambah transaksi baru (POST /api/transactions)
exports.createTransaction = async (req, res) => {
  try {
    const {
      tanggal,
      jam,
      jenis,
      nominal,
      kategori,
      uang_dari,
      dipakai_untuk,
      status,
      keterangan,
    } = req.body;

    // Validasi input wajib
    if (!tanggal || !jam || !jenis || !nominal || !kategori || !uang_dari || !dipakai_untuk) {
      return res.status(400).json({
        status: 'error',
        message: 'Semua kolom utama transaksi wajib diisi!',
      });
    }

    const query = `
      INSERT INTO transactions 
      (tanggal, jam, jenis, nominal, kategori, uang_dari, dipakai_untuk, status, keterangan) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      tanggal,
      jam,
      jenis,
      Number(nominal),
      kategori,
      uang_dari,
      dipakai_untuk,
      status || 'tercatat',
      keterangan || '',
    ];

    const [result] = await db.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Transaksi berhasil ditambahkan',
      data: {
        id: result.insertId,
        tanggal,
        jam,
        jenis,
        nominal: Number(nominal),
        kategori,
        uang_dari,
        dipakai_untuk,
        status: status || 'tercatat',
        keterangan: keterangan || '',
      },
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menyimpan transaksi ke database',
    });
  }
};

// 3. Mengubah status atau data transaksi (PUT /api/transactions/:id)
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, nominal, kategori, uang_dari, dipakai_untuk, keterangan } = req.body;

    const query = `
      UPDATE transactions 
      SET status = COALESCE(?, status),
          nominal = COALESCE(?, nominal),
          kategori = COALESCE(?, kategori),
          uang_dari = COALESCE(?, uang_dari),
          dipakai_untuk = COALESCE(?, dipakai_untuk),
          keterangan = COALESCE(?, keterangan)
      WHERE id = ?
    `;

    const [result] = await db.query(query, [
      status,
      nominal,
      kategori,
      uang_dari,
      dipakai_untuk,
      keterangan,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaksi tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Transaksi berhasil diperbarui',
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui transaksi',
    });
  }
};

// 4. Menghapus transaksi (DELETE /api/transactions/:id)
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM transactions WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaksi tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Transaksi berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus transaksi',
    });
  }
};