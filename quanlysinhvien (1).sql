-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 13, 2025 at 07:00 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanlysinhvien`
--

-- --------------------------------------------------------

--
-- Table structure for table `dangkymonhoc`
--

CREATE TABLE `dangkymonhoc` (
  `id` int NOT NULL,
  `MaSV` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaMH` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NgayDangKy` datetime DEFAULT CURRENT_TIMESTAMP,
  `TrangThai` tinyint DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dangkymonhoc`
--

INSERT INTO `dangkymonhoc` (`id`, `MaSV`, `MaMH`, `NgayDangKy`, `TrangThai`) VALUES
(186, 'Sv001', 'CNTT', '2025-01-13 13:56:38', 1);

-- --------------------------------------------------------

--
-- Table structure for table `hocky`
--

CREATE TABLE `hocky` (
  `MaHK` int NOT NULL,
  `TenHK` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NgayBatDau` date DEFAULT NULL,
  `NgayKetThuc` date DEFAULT NULL,
  `TrangThai` tinyint(1) DEFAULT '1',
  `NgayBatDauDK` date DEFAULT NULL,
  `NgayKetThucDK` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hocky`
--

INSERT INTO `hocky` (`MaHK`, `TenHK`, `NgayBatDau`, `NgayKetThuc`, `TrangThai`, `NgayBatDauDK`, `NgayKetThucDK`) VALUES
(1, 'Học kỳ 1 - 2023-2024', '2023-09-01', '2024-01-31', 0, '2023-08-01', '2023-08-31'),
(2, 'Học kỳ 2 - 2023-2024', '2024-02-01', '2024-06-30', 1, '2024-01-01', '2024-01-31');

-- --------------------------------------------------------

--
-- Table structure for table `khoa`
--

CREATE TABLE `khoa` (
  `MaKhoa` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenKhoa` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `khoa`
--

INSERT INTO `khoa` (`MaKhoa`, `TenKhoa`) VALUES
('CK', 'Cơ Khí'),
('CNTT', 'Công nghệ thông tin'),
('ĐT', 'Điện Tử'),
('HTTT', 'Hệ thống thông tin'),
('KT', 'Kinh tế'),
('QTKD', 'Quản Trị Kinh Doanh'),
('TC', 'Tài Chính'),
('XD', 'Xây Dựng');

-- --------------------------------------------------------

--
-- Table structure for table `monhoc`
--

CREATE TABLE `monhoc` (
  `MaMH` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenMH` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoTC` int NOT NULL,
  `GiangVien` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoLuongMax` int NOT NULL DEFAULT '50',
  `SoLuongDaDangKy` int NOT NULL DEFAULT '0',
  `MaKhoa` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaHK` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `monhoc`
--

INSERT INTO `monhoc` (`MaMH`, `TenMH`, `SoTC`, `GiangVien`, `SoLuongMax`, `SoLuongDaDangKy`, `MaKhoa`, `MaHK`) VALUES
('CNTT', 'Lập trình C++', 4, 'a', 70, 1, 'CNTT', 2),
('CNTT1', 'Lập trinh JAVA', 4, 'A', 70, 0, 'CNTT', 2),
('KT1', 'Kinh tế vi mô', 4, 'B', 70, 0, 'KT', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sinhvien`
--

CREATE TABLE `sinhvien` (
  `id` int NOT NULL,
  `MaSV` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgaySinh` date NOT NULL,
  `Lop` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Khoa` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `sinhvien`
--

INSERT INTO `sinhvien` (`id`, `MaSV`, `HoTen`, `NgaySinh`, `Lop`, `Khoa`, `created_at`) VALUES
(20, 'Sv001', 'Hòa', '3434-02-02', '1', 'Công nghệ thông tin', '2025-01-11 13:33:45');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `is_profile_completed` tinyint(1) DEFAULT '0',
  `student_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `class` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `faculty` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`, `full_name`, `birth_date`, `is_profile_completed`, `student_id`, `class`, `faculty`) VALUES
(1, 'admin', '$2y$10$YourHashedPasswordHere', 'admin', '2025-01-04 14:17:37', NULL, NULL, 0, NULL, NULL, NULL),
(2, '3', '$2y$10$Qg0v6dYmKCrW3IlNmTlRFu5qnhlGVaJubtw8jkIpYMuZcBjXrwViO', 'user', '2025-01-11 02:23:38', 'Hòa', '3434-02-02', 1, 'Sv001', '1', 'CNTT'),
(3, '2', '$2y$10$1DNMrXLmERbQsKdfG6o8P.41sXGzmv8b.0gmMbB0CvGHqQIxFhW2S', 'admin', '2025-01-11 02:26:14', NULL, NULL, 0, NULL, NULL, NULL),
(4, '1', '$2y$10$uvdCESt3BTJ9enfPCRTbt.1DpT7ZuZtXPHFT6rHY1sPbEb9tRXx0S', 'user', '2025-01-11 02:27:24', 'Nguỹe', '4342-03-23', 1, 'SV1213', '12', 'HTTT'),
(5, '5', '$2y$10$ZLGT23gG2sGW2Om4/gqZM.v5HwBwuD/PJe54lg3YREHGoRh4Ggg2y', 'user', '2025-01-13 02:04:34', NULL, NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_avatars`
--

CREATE TABLE `user_avatars` (
  `id` int NOT NULL,
  `user_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dangkymonhoc`
--
ALTER TABLE `dangkymonhoc`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_dangky` (`MaSV`,`MaMH`),
  ADD KEY `MaMH` (`MaMH`);

--
-- Indexes for table `hocky`
--
ALTER TABLE `hocky`
  ADD PRIMARY KEY (`MaHK`);

--
-- Indexes for table `khoa`
--
ALTER TABLE `khoa`
  ADD PRIMARY KEY (`MaKhoa`);

--
-- Indexes for table `monhoc`
--
ALTER TABLE `monhoc`
  ADD PRIMARY KEY (`MaMH`),
  ADD KEY `MaKhoa` (`MaKhoa`),
  ADD KEY `MaHK` (`MaHK`);

--
-- Indexes for table `sinhvien`
--
ALTER TABLE `sinhvien`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MaSV` (`MaSV`),
  ADD KEY `idx_lop` (`Lop`),
  ADD KEY `idx_khoa` (`Khoa`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD KEY `fk_users_khoa` (`faculty`);

--
-- Indexes for table `user_avatars`
--
ALTER TABLE `user_avatars`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dangkymonhoc`
--
ALTER TABLE `dangkymonhoc`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

--
-- AUTO_INCREMENT for table `sinhvien`
--
ALTER TABLE `sinhvien`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_avatars`
--
ALTER TABLE `user_avatars`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dangkymonhoc`
--
ALTER TABLE `dangkymonhoc`
  ADD CONSTRAINT `dangkymonhoc_ibfk_1` FOREIGN KEY (`MaSV`) REFERENCES `sinhvien` (`MaSV`) ON DELETE CASCADE,
  ADD CONSTRAINT `dangkymonhoc_ibfk_2` FOREIGN KEY (`MaMH`) REFERENCES `monhoc` (`MaMH`) ON DELETE CASCADE;

--
-- Constraints for table `monhoc`
--
ALTER TABLE `monhoc`
  ADD CONSTRAINT `monhoc_ibfk_1` FOREIGN KEY (`MaKhoa`) REFERENCES `khoa` (`MaKhoa`),
  ADD CONSTRAINT `monhoc_ibfk_2` FOREIGN KEY (`MaHK`) REFERENCES `hocky` (`MaHK`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_khoa` FOREIGN KEY (`faculty`) REFERENCES `khoa` (`MaKhoa`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
