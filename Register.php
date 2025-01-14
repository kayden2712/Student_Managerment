<?php
// Đảm bảo không có output buffering can thiệp
while (ob_get_level()) ob_end_clean();

// Thiết lập header JSON với UTF-8
header('Content-Type: application/json; charset=utf-8');

// Xử lý lỗi tùy chỉnh để chuyển đổi tất cả lỗi thành exceptions
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

try {
    require_once "config.php";

    if (!isset($conn) || !$conn) {
        throw new Exception("Kết nối cơ sở dữ liệu thất bại");
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        // Kiểm tra xem tên người dùng đã tồn tại chưa
        $sql_check = "SELECT id FROM users WHERE username = ?";
        $stmt_check = $conn->prepare($sql_check);
        $stmt_check->execute([$username]);
        
        if ($stmt_check->rowCount() > 0) {
            die(json_encode([
                "success" => false, 
                "message" => "Tên người dùng đã tồn tại"
            ], JSON_UNESCAPED_UNICODE));
        }

        // Mã hóa mật khẩu
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        
        if ($stmt->execute([$username, $hashed_password])) {
            die(json_encode([
                "success" => true, 
                "message" => "Đăng ký thành công"
            ], JSON_UNESCAPED_UNICODE));
        } else {
            die(json_encode([
                "success" => false, 
                "message" => "Đăng ký thất bại"
            ], JSON_UNESCAPED_UNICODE));
        }
    } else {
        throw new Exception("Phương thức yêu cầu không hợp lệ");
    }
} catch (Throwable $e) {
    die(json_encode([
        "success" => false,
        "message" => "Lỗi máy chủ: " . $e->getMessage(),
        "debug" => [
            "file" => "Tệp: " . $e->getFile(),
            "line" => "Dòng: " . $e->getLine()
        ]
    ], JSON_UNESCAPED_UNICODE));
}
?>
