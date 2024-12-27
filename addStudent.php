<?php
header('Content-Type: application/json; charset=utf-8');

// Hàm kiểm tra định dạng ngày
function validateDate($date, $format = 'Y-m-d') {
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
}

try {
    // Kết nối database
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

    // Lấy và kiểm tra dữ liệu
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate dữ liệu
    $maSV = isset($data['code']) ? trim($data['code']) : '';
    $hoTen = isset($data['name']) ? trim($data['name']) : '';
    $ngaySinh = isset($data['birthDay']) ? trim($data['birthDay']) : '';
    $lop = isset($data['classs']) ? trim($data['classs']) : '';
    $khoa = isset($data['fos']) ? trim($data['fos']) : '';

    // Kiểm tra dữ liệu trống
    if (empty($maSV) || empty($hoTen) || empty($ngaySinh) || empty($lop) || empty($khoa)) {
        throw new Exception('Vui lòng điền đầy đủ thông tin sinh viên');
    }

    // Kiểm tra định dạng mã SV (ví dụ: phải bắt đầu bằng SV và có ít nhất 5 ký tự)
    if (!preg_match('/^SV\d{3,}$/', $maSV)) {
        throw new Exception('Mã sinh viên không hợp lệ (phải bắt đầu bằng SV và có ít nhất 3 số)');
    }

    // Kiểm tra định dạng ngày
    if (!validateDate($ngaySinh)) {
        throw new Exception('Ngày sinh không hợp lệ');
    }

    // Kiểm tra mã sinh viên đã tồn tại
    $stmt = $conn->prepare("SELECT COUNT(*) FROM sinhvien WHERE MaSV = ?");
    $stmt->execute([$maSV]);
    if ($stmt->fetchColumn() > 0) {
        throw new Exception('Mã sinh viên đã tồn tại trong hệ thống');
    }

    // Thêm sinh viên mới
    $sql = "INSERT INTO sinhvien (MaSV, HoTen, NgaySinh, Lop, Khoa) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    $result = $stmt->execute([
        $maSV,
        $hoTen,
        $ngaySinh,
        $lop,
        $khoa
    ]);

    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Thêm sinh viên thành công'
        ]);
    } else {
        throw new Exception('Không thể thêm sinh viên');
    }

} catch(PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi hệ thống, vui lòng thử lại sau'
    ]);
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn = null;
    }
}
?> 