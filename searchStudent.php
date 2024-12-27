<?php
header('Content-Type: application/json; charset=utf-8');

try {
    $conn = new PDO("mysql:host=localhost;dbname=quanlysinhvien", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8");
    
    $keyword = trim($_GET['keyword'] ?? '');
    
    if (empty($keyword)) {
        throw new Exception('Từ khóa tìm kiếm không được để trống');
    }

    // Tìm kiếm với LIKE để có kết quả ngay khi gõ
    $stmt = $conn->prepare("
        SELECT * FROM sinhvien 
        WHERE MaSV LIKE ? 
        OR HoTen LIKE ?
        ORDER BY 
            CASE WHEN MaSV LIKE ? THEN 0 
                 WHEN HoTen LIKE ? THEN 1 
            ELSE 2 END,
            HoTen ASC
    ");
    
    $searchPattern = "%$keyword%";
    $stmt->execute([$searchPattern, $searchPattern, $searchPattern, $searchPattern]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch(Exception $e) {
    echo json_encode([]);
} finally {
    $conn = null;
}
?>