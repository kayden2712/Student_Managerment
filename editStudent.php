<?php
header('Content-Type: application/json');

// Lấy dữ liệu từ request
$data = json_decode(file_get_contents("php://input"));

// Kết nối đến cơ sở dữ liệu
$conn = new mysqli("localhost", "root", "", "your_database");

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Cập nhật thông tin sinh viên
$stmt = $conn->prepare("UPDATE students SET name = ?, email = ?, class = ? WHERE id = ?");
$stmt->bind_param("sssi", $data->name, $data->email, $data->class, $data->id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cập nhật sinh viên thành công']);
} else {
    echo json_encode(['success' => false, 'message' => 'Cập nhật thất bại']);
}

$stmt->close();
$conn->close();
?>
