const mysql = require('mysql2/promise');
require('dotenv').config();

// Membuat pool koneksi ke database db_joecraft
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_joecraft',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fungsi untuk menguji koneksi database
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Berhasil terhubung ke database db_joecraft via Laragon!');
    connection.release();
  } catch (error) {
    console.error('❌ Gagal terhubung ke database db_joecraft:', error.message);
  }
}

testConnection();

module.exports = pool;