<?php
require_once "config.php";

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    try {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $sql = "SELECT id, username, password, role FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            
            echo json_encode([
                "success" => true, 
                "message" => "Đăng nhập thành công",
                "role" => $user['role']
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode([
                "success" => false, 
                "message" => "Tài khoản hoặc mật khẩu không chính xác"
            ], JSON_UNESCAPED_UNICODE);
        }
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi đăng nhập: " . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
}
?>
