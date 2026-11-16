-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for db_joecraft
CREATE DATABASE IF NOT EXISTS `db_joecraft` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_joecraft`;

-- Dumping structure for table db_joecraft.konfigurasi
CREATE TABLE IF NOT EXISTS `konfigurasi` (
  `id` int NOT NULL DEFAULT '1',
  `saldo_awal` decimal(12,2) NOT NULL DEFAULT '2780000.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_joecraft.konfigurasi: ~1 rows (approximately)
INSERT INTO `konfigurasi` (`id`, `saldo_awal`) VALUES
	(1, 2780000.00);

-- Dumping structure for table db_joecraft.transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tanggal` date NOT NULL,
  `jam` varchar(10) NOT NULL,
  `pesan_asli` text,
  `keterangan` text,
  `kategori` varchar(100) NOT NULL,
  `jenis` enum('masuk','keluar') NOT NULL,
  `nominal` decimal(12,2) NOT NULL,
  `uang_dari` varchar(50) DEFAULT NULL,
  `dipakai_untuk` varchar(50) DEFAULT NULL,
  `metode_bayar` varchar(50) DEFAULT NULL,
  `status` enum('tercatat','perlu_dicek','dibatalkan') DEFAULT 'tercatat',
  `bacaan_bot` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_joecraft.transactions: ~19 rows (approximately)
INSERT INTO `transactions` (`id`, `tanggal`, `jam`, `pesan_asli`, `keterangan`, `kategori`, `jenis`, `nominal`, `uang_dari`, `dipakai_untuk`, `metode_bayar`, `status`, `bacaan_bot`, `created_at`) VALUES
	(1, '2026-11-01', '10:00', 'jual tas sulam tumpar 1 transfer 2jt3', 'Jual tas sulam tumpar 1, transfer', 'Penjualan', 'masuk', 2300000.00, NULL, NULL, 'Transfer', 'tercatat', NULL, '2026-11-16 06:18:43'),
	(2, '2026-11-01', '15:00', 'beli kain doyo 580rb', 'Beli kain doyo', 'Bahan baku', 'keluar', 580000.00, 'kas_usaha', 'usaha', NULL, 'tercatat', NULL, '2026-11-16 06:18:43'),
	(3, '2026-11-02', '09:30', 'jual tas doyo 1 transfer 1jt5', 'Jual tas doyo 1, transfer', 'Penjualan', 'masuk', 1500000.00, NULL, NULL, 'Transfer', 'tercatat', NULL, '2026-11-16 06:18:43'),
	(4, '2026-11-02', '13:00', 'bayar upah penenun 500rb', 'Upah penenun', 'Upah pengrajin', 'keluar', 500000.00, 'kas_usaha', 'usaha', NULL, 'tercatat', NULL, '2026-11-16 06:18:43'),
	(5, '2026-11-03', '10:00', 'jual dompet 2 transfer 1jt', 'Jual dompet 2, transfer', 'Penjualan', 'masuk', 1000000.00, NULL, NULL, 'Transfer', 'tercatat', NULL, '2026-11-16 06:18:43'),
	(6, '2026-11-03', '14:00', 'beli kain tenun doyo 1jt4', 'Beli kain tenun doyo', 'Bahan baku', 'keluar', 1400000.00, 'kas_usaha', 'usaha', 'Transfer', 'tercatat', NULL, '2026-11-16 06:18:43'),
	(7, '2026-11-04', '09:00', 'beli manik dan benang emas 760rb', 'Beli manik dan benang emas', 'Bahan baku', 'keluar', 760000.00, 'kas_usaha', 'usaha', 'Tunai', 'tercatat', NULL, '2026-11-16 06:18:43'),
	(8, '2026-11-04', '11:00', 'bayar upah finishing 290rb', 'Upah finishing', 'Upah pengrajin', 'keluar', 290000.00, 'kas_usaha', 'usaha', NULL, 'tercatat', NULL, '2026-11-16 06:18:43'),
	(9, '2026-11-04', '15:00', 'ongkir kirim pesanan Bali 300rb', 'Ongkir kirim pesanan Bali', 'Ongkir', 'keluar', 300000.00, 'kas_usaha', 'usaha', 'Transfer', 'tercatat', NULL, '2026-11-16 06:18:43'),
	(10, '2026-11-05', '08:40', 'pake uang pribadi beli pewarna alam 2 kg 320rb', 'Beli pewarna alam 2 kg', 'Bahan baku', 'keluar', 320000.00, 'uang_pribadi', 'usaha', 'Tunai', 'tercatat', NULL, '2026-11-16 06:18:43'),
	(11, '2026-11-05', '13:00', 'bayar upah penyulam Kubar 400rb', 'Upah penyulam Kubar', 'Upah pengrajin', 'keluar', 400000.00, 'kas_usaha', 'usaha', NULL, 'tercatat', NULL, '2026-11-16 06:18:43'),
	(12, '2026-11-06', '09:30', 'pake uang usaha buat bayar listrik rumah 300rb', 'Bayar listrik rumah', 'Keperluan pribadi', 'keluar', 300000.00, 'kas_usaha', 'pribadi', NULL, 'tercatat', NULL, '2026-11-16 06:18:43'),
	(13, '2026-11-06', '14:00', 'jual pouch 2 transfer 1jt4', 'Jual pouch 2, transfer', 'Penjualan', 'masuk', 1400000.00, NULL, NULL, 'Transfer', 'tercatat', NULL, '2026-11-16 06:18:43'),
	(14, '2026-11-07', '11:05', 'jual tas doyo 1 lunas transfer 2jt3', 'Jual tas doyo 1, transfer', 'Penjualan', 'masuk', 2300000.00, NULL, NULL, 'Transfer', 'tercatat', NULL, '2026-11-16 06:18:43'),
	(15, '2026-11-07', '16:20', 'ongkir kirim pesanan Jepang 450rb', 'Ongkir kirim pesanan Jepang', 'Ongkir', 'keluar', 450000.00, 'kas_usaha', 'usaha', 'Transfer', 'tercatat', NULL, '2026-11-16 06:18:43'),
	(16, '2026-11-08', '08:30', 'beli box kemasan 200rb', 'Beli box kemasan', 'Kemasan', 'keluar', 200000.00, 'kas_usaha', 'usaha', NULL, 'dibatalkan', NULL, '2026-11-16 06:18:43'),
	(17, '2026-11-08', '09:05', 'bayar sesuatu 50', 'Bayar sesuatu 50', 'Lainnya', 'keluar', 50.00, 'kas_usaha', 'usaha', NULL, 'perlu_dicek', 'Bot belum bisa membaca tujuan dan nominalnya, jadi menanyakan ke owner: untuk apa dan berapa rupiah?', '2026-11-16 06:18:43'),
	(18, '2026-11-08', '15:10', 'Hari ini beli benang 150 ribu', 'Beli benang', 'Bahan baku', 'keluar', 150000.00, 'kas_usaha', 'usaha', NULL, 'tercatat', NULL, '2026-11-16 06:18:43'),
	(19, '2026-11-09', '10:42', 'jual pouch 1 transfer 700rb', 'Jual pouch 1, transfer', 'Penjualan', 'masuk', 700000.00, NULL, NULL, 'Transfer', 'tercatat', NULL, '2026-11-16 06:18:43');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
