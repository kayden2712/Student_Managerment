<?php
require_once 'config.php';
header('Content-Type: application/json');

try {
    $sql = "SELECT MaMH, TenMH, SoTC, GiangVien, SoLuongMax, SoLuongDaDangKy 
            FROM monhoc 
            ORDER BY MaMH";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $courses
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi: ' . $e->getMessage()
    ]);
}
?> 