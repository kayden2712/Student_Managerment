<?php
session_start();

// Xóa tất cả các biến session
$_SESSION = array();

// Hủy cookie session
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Hủy session
session_destroy();

// Gửi phản hồi JSON
header('Content-Type: application/json');
echo json_encode([
    "success" => true,
    "message" => "Đăng xuất thành công"
], JSON_UNESCAPED_UNICODE);
?>
