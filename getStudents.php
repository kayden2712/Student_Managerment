<?php
header('Content-Type: application/json; charset=utf-8');

try {
    $host = "localhost";
    $dbname = "quanlysinhvien";
    $username = "root";
    $password = "";

    $conn = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4")
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Lấy danh sách sinh viên với đầy đủ thông tin
    $stmt = $conn->prepare("SELECT * FROM sinhvien ORDER BY id ASC");
    $stmt->execute();
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $students
    ]);

} catch(PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi khi tải danh sách sinh viên'
    ]);
} finally {
    if (isset($conn)) {
        $conn = null;
    }
}
?> 