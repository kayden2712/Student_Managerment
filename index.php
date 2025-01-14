<?php
session_start();

// Kiểm tra nếu chưa đăng nhập thì chuyển về trang login
if (!isset($_SESSION['user_id'])) {
    header('Location: Login.html');
    exit;
}

// Kiểm tra role
if ($_SESSION['role'] === 'admin') {
    header('Location: Home.html');
} else {
    header('Location: user.html');
}
exit;
