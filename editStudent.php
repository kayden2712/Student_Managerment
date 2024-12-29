<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Kết nối database
    $conn = new PDO(
        "mysql:host=localhost;dbname=quanlysinhvien;charset=utf8mb4",
        "root",
        ""
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Lấy và kiểm tra dữ liệu đầu vào
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Log dữ liệu nhận được
    error_log("Received data: " . print_r($data, true));

    // Kiểm tra dữ liệu
    if (!isset($data['code']) || !isset($data['name']) || !isset($data['birthDay']) 
        || !isset($data['classs']) || !isset($data['fos'])) {
        throw new Exception('Thiếu thông tin cần thiết');
    }

    // Chuẩn bị câu lệnh SQL
    $sql = "UPDATE sinhvien 
            SET HoTen = :name, 
                NgaySinh = :birthDay, 
                Lop = :classs, 
                Khoa = :fos 
            WHERE MaSV = :code";
    
    $stmt = $conn->prepare($sql);
    
    // Log câu lệnh SQL và tham số
    error_log("SQL Query: " . $sql);
    error_log("Parameters: " . print_r([
        ':name' => $data['name'],
        ':birthDay' => $data['birthDay'],
        ':classs' => $data['classs'],
        ':fos' => $data['fos'],
        ':code' => $data['code']
    ], true));

    // Thực thi câu lệnh
    $success = $stmt->execute([
        ':name' => $data['name'],
        ':birthDay' => $data['birthDay'],
        ':classs' => $data['classs'],
        ':fos' => $data['fos'],
        ':code' => $data['code']
    ]);

    // Kiểm tra kết quả
    if ($success) {
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Cập nhật thông tin sinh viên thành công'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Không tìm thấy sinh viên hoặc không có thay đổi'
            ]);
        }
    } else {
        throw new Exception('Lỗi khi thực thi câu lệnh SQL');
    }

} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi: ' . $e->getMessage()
    ]);
}
?>
