-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS quanlysinhvien
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Sử dụng database
USE quanlysinhvien;

-- Xóa bảng nếu tồn tại
DROP TABLE IF EXISTS sinhvien;

-- Tạo bảng sinh viên
CREATE TABLE sinhvien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    MaSV VARCHAR(20) UNIQUE NOT NULL,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE NOT NULL,
    Lop VARCHAR(50) NOT NULL,
    Khoa VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm dữ liệu mẫu
INSERT INTO sinhvien (MaSV, HoTen, NgaySinh, Lop, Khoa) 
VALUES 
    ('SV001', 'Trần Đức Anh', '2005-11-25', 'HT21', 'Công nghệ thông tin'),
    ('SV002', 'Lương Đức Độ', '2003-05-20', 'KT07', 'Kinh tế'),
    ('SV003', 'Trần Văn Khoa', '2000-08-10', 'TT09', 'Công nghệ thông tin'),
    ('SV004', 'Phạm Thị Huyền', '2000-12-25', 'NN03', 'Ngoại ngữ'),
    ('SV005', 'Nguyễn Tiến Đoàn', '2005-10-26', 'HT21', 'Công nghệ thông tin');

-- Kiểm tra ràng buộc và index
ALTER TABLE sinhvien
ADD CONSTRAINT check_masv CHECK (LENGTH(MaSV) >= 4),
ADD INDEX idx_lop (Lop),
ADD INDEX idx_khoa (Khoa);

-- Cấp quyền cho user root
GRANT ALL PRIVILEGES ON quanlysinhvien.* TO 'root'@'localhost';
FLUSH PRIVILEGES; 