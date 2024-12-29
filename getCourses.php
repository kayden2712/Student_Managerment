<?php
require_once 'config.php';

try {
    $sql = "SELECT * FROM monhoc";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $courses
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi khi tải danh sách môn học: ' . $e->getMessage()
    ]);
}
$conn = null;
?> 