<?php
require_once 'config.php';

$studentId = $_GET['studentId'] ?? '';

try {
    $sql = "SELECT m.*, dk.NgayDangKy 
            FROM dangkymonhoc dk 
            JOIN monhoc m ON dk.MaMH = m.MaMH 
            WHERE dk.MaSV = :studentId";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([':studentId' => $studentId]);
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $courses
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi khi tải danh sách môn học đã đăng ký: ' . $e->getMessage()
    ]);
}
$conn = null;
?> 