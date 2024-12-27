<?php
header('Content-Type: application/json; charset=utf-8');

try {
    $conn = new PDO("mysql:host=localhost;dbname=quanlysinhvien", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8");

    $data = json_decode(file_get_contents('php://input'), true);
    $studentId = trim($data['studentId'] ?? '');
    
    if (empty($studentId)) {
        throw new Exception('Mã sinh viên không được để trống');
    }

    $stmt = $conn->prepare("DELETE FROM sinhvien WHERE MaSV = ?");
    $stmt->execute([$studentId]);

    echo json_encode([
        'success' => $stmt->rowCount() > 0,
        'message' => $stmt->rowCount() > 0 ? 'Đã xóa sinh viên thành công' : 'Không tìm thấy sinh viên'
    ]);

} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi: ' . $e->getMessage()
    ]);
} finally {
    $conn = null;
}
?>