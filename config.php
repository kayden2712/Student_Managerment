<?php
// Thông tin kết nối database
$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "quanlysinhvien";

try {
    $conn = new PDO(
        "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
        $db_user,
        $db_pass,
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
    );
} catch(PDOException $e) {
    die(json_encode([
        "success" => false,
        "message" => "Kết nối database thất bại: " . $e->getMessage()
    ]));
}
?>