<?php
// Ensure no output buffering interferes
while (ob_get_level()) ob_end_clean();

// Set JSON header with UTF-8
header('Content-Type: application/json; charset=utf-8');

// Custom error handler to convert all errors to exceptions
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

try {
    // Check if config.php exists
    if (!file_exists("config.php")) {
        throw new Exception("Không tìm thấy tệp cấu hình");
    }

    require_once "config.php";

    if (!isset($conn) || !$conn) {
        throw new Exception("Kết nối cơ sở dữ liệu thất bại");
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        // Add validation
        if (empty($username) || empty($password)) {
            throw new Exception("Vui lòng điền đầy đủ thông tin");
        }

        // Check if username already exists
        $sql_check = "SELECT id FROM users WHERE username = ?";
        $stmt_check = $conn->prepare($sql_check);
        $stmt_check->execute([$username]);
        
        if ($stmt_check->rowCount() > 0) {
            die(json_encode([
                "success" => false, 
                "message" => "Tên người dùng đã tồn tại"
            ], JSON_UNESCAPED_UNICODE));
        }

        // Hash the password before saving
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
