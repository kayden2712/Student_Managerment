<?php
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$studentId = $data['studentId'];
$courseIds = $data['courseIds'];

try {
    $conn->beginTransaction();

    $sql = "INSERT INTO dangkymonhoc (MaSV, MaMH, NgayDangKy) VALUES (:studentId, :courseId, NOW())";
    $stmt = $conn->prepare($sql);

    foreach ($courseIds as $courseId) {
        $stmt->execute([
            ':studentId' => $studentId,
            ':courseId' => $courseId
        ]);
    }

    $conn->commit();
    echo json_encode([
        'success' => true,
        'message' => 'Đăng ký môn học thành công!'
    ]);
} catch(PDOException $e) {
    $conn->rollBack();
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi khi đăng ký môn học: ' . $e->getMessage()
    ]);
}
$conn = null;
?> 