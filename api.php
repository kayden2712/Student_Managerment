<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Thêm log để debug
file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Request: " . $_SERVER['REQUEST_URI'] . "\n", FILE_APPEND);

// Database configuration
$host = 'localhost';
$dbname = 'quanlysinhvien';
$username = 'root';
$password = '';

// Helper functions
function validateDate($date, $format = 'Y-m-d')
{
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
}

function sendJsonResponse($success, $data = null, $message = '')
{
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ]);
    exit;
}

try {
    // Database connection
    $conn = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4")
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get request method and action
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';

    switch ($action) {
        case 'searchStudent':
            $keyword = trim($_GET['keyword'] ?? '');
            if (empty($keyword)) {
                sendJsonResponse(true, [], 'Vui lòng nhập từ khóa tìm kiếm');
                break;
            }

            // Cải thiện câu truy vấn SQL để tìm kiếm chính xác hơn
            $sql = "SELECT * FROM sinhvien 
                    WHERE MaSV LIKE :exactMatch 
                       OR MaSV LIKE :keyword
                       OR HoTen LIKE :keyword 
                       OR Lop LIKE :keyword
                       OR Khoa LIKE :keyword
                    ORDER BY 
                        CASE 
                            WHEN MaSV = :exactMatch THEN 1
                            WHEN MaSV LIKE :startsWith THEN 2
                            WHEN HoTen LIKE :startsWith THEN 3
                            WHEN Lop = :exactMatch THEN 4
                            WHEN Khoa = :exactMatch THEN 5
                            ELSE 6 
                        END,
                        MaSV ASC,
                        HoTen ASC";

            $stmt = $conn->prepare($sql);

            // Bind các tham số tìm kiếm
            $stmt->bindValue(':exactMatch', $keyword, PDO::PARAM_STR);
            $stmt->bindValue(':keyword', "%$keyword%", PDO::PARAM_STR);
            $stmt->bindValue(':startsWith', "$keyword%", PDO::PARAM_STR);

            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            sendJsonResponse(
                true,
                $results,
                empty($results) ? 'Không tìm thấy sinh viên nào' : null
            );
            break;

        case 'addStudent':
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }

            $data = json_decode(file_get_contents('php://input'), true);

            // Validate data
            $maSV = isset($data['code']) ? trim($data['code']) : '';
            $hoTen = isset($data['name']) ? trim($data['name']) : '';
            $ngaySinh = isset($data['birthDay']) ? trim($data['birthDay']) : '';
            $lop = isset($data['classs']) ? trim($data['classs']) : '';
            $khoa = isset($data['fos']) ? trim($data['fos']) : '';

            if (empty($maSV) || empty($hoTen) || empty($ngaySinh) || empty($lop) || empty($khoa)) {
                throw new Exception('Vui lòng điền đầy đủ thông tin sinh viên');
            }

            if (!preg_match('/^SV\d{3,}$/', $maSV)) {
                throw new Exception('Mã sinh viên không hợp lệ (phải bắt đầu bằng SV và có ít nhất 3 số)');
            }

            if (!validateDate($ngaySinh)) {
                throw new Exception('Ngày sinh không hợp lệ');
            }

            // Check if student exists
            $stmt = $conn->prepare("SELECT COUNT(*) FROM sinhvien WHERE MaSV = ?");
            $stmt->execute([$maSV]);
            if ($stmt->fetchColumn() > 0) {
                throw new Exception('Mã sinh viên đã tồn tại trong hệ thống');
            }

            // Add new student
            $sql = "INSERT INTO sinhvien (MaSV, HoTen, NgaySinh, Lop, Khoa) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $result = $stmt->execute([$maSV, $hoTen, $ngaySinh, $lop, $khoa]);

            sendJsonResponse($result, null, $result ? 'Thêm sinh viên thành công' : 'Không thể thêm sinh viên');
            break;

        case 'editStudent':
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }

            $data = json_decode(file_get_contents('php://input'), true);

            if (
                !isset($data['code']) || !isset($data['name']) || !isset($data['birthDay'])
                || !isset($data['classs']) || !isset($data['fos'])
            ) {
                throw new Exception('Thiếu thông tin cần thiết');
            }

            $sql = "UPDATE sinhvien 
                    SET HoTen = :name, 
                        NgaySinh = :birthDay, 
                        Lop = :classs, 
                        Khoa = :fos 
                    WHERE MaSV = :code";

            $stmt = $conn->prepare($sql);
            $success = $stmt->execute([
                ':name' => $data['name'],
                ':birthDay' => $data['birthDay'],
                ':classs' => $data['classs'],
                ':fos' => $data['fos'],
                ':code' => $data['code']
            ]);

            sendJsonResponse($success && $stmt->rowCount() > 0, null, $success ? ($stmt->rowCount() > 0 ? 'Cập nhật thông tin sinh viên thành công' : 'Không tìm thấy sinh viên hoặc không có thay đổi') : 'Lỗi khi thực thi câu lệnh SQL');
            break;

        case 'deleteStudent':
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }

            $data = json_decode(file_get_contents('php://input'), true);
            $studentId = trim($data['studentId'] ?? '');

            if (empty($studentId)) {
                throw new Exception('Mã sinh viên không được để trống');
            }

            $stmt = $conn->prepare("DELETE FROM sinhvien WHERE MaSV = ?");
            $stmt->execute([$studentId]);

            sendJsonResponse($stmt->rowCount() > 0, null, $stmt->rowCount() > 0 ? 'Đã xóa sinh viên thành công' : 'Không tìm thấy sinh viên');
            break;

        case 'getStudents':
            $stmt = $conn->prepare("SELECT * FROM sinhvien ORDER BY id ASC");
            $stmt->execute();
            sendJsonResponse(true, $stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'getCourses':
            try {
                $stmt = $conn->prepare("SELECT * FROM monhoc ORDER BY MaMH");
                $stmt->execute();
                $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

                sendJsonResponse(true, $courses, '');
            } catch (PDOException $e) {
                sendJsonResponse(false, null, 'Lỗi khi tải danh sách tín chỉ: ' . $e->getMessage());
            }
            break;

        case 'getCourseList':
            file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Getting course list\n", FILE_APPEND);
            $stmt = $conn->prepare("SELECT * FROM monhoc ORDER BY MaMH");
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Found " . count($result) . " courses\n", FILE_APPEND);
            echo json_encode(['success' => true, 'data' => $result]);
            exit;
            break;

        case 'registerCourse':
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }

            // Kiểm tra profile đã hoàn thành chưa (sử dụng PDO)
            if (isset($_SESSION['user_id'])) {
                $stmt = $conn->prepare("SELECT is_profile_completed FROM users WHERE id = ?");
                $stmt->execute([$_SESSION['user_id']]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($user && !$user['is_profile_completed']) {
                    throw new Exception('Vui lòng cập nhật đầy đủ thông tin cá nhân trước khi đăng ký môn học');
                }
            }

            $data = json_decode(file_get_contents('php://input'), true);
            $studentId = $data['studentId'] ?? '';
            $courseIds = $data['courseIds'] ?? [];

            if (empty($studentId) || empty($courseIds)) {
                sendJsonResponse(false, null, 'Thiếu thông tin đăng ký');
                exit;
            }

            try {
                $conn->beginTransaction();

                $successCourses = [];
                $errorCourses = [];

                // Kiểm tra sinh viên có tồn tại không
                $checkStudent = $conn->prepare("SELECT 1 FROM sinhvien WHERE MaSV = ?");
                $checkStudent->execute([$studentId]);
                if (!$checkStudent->fetch()) {
                    throw new Exception('Mã sinh viên không tồn tại');
                }

                $placeholders = str_repeat('?,', count($courseIds) - 1) . '?';

                // Kiểm tra môn học đã đăng ký
                $checkRegistered = $conn->prepare("
                    SELECT MaMH 
                    FROM dangkymonhoc 
                    WHERE MaSV = ? AND MaMH IN ($placeholders)
                    FOR UPDATE
                ");
                $checkRegistered->execute(array_merge([$studentId], $courseIds));
                $registeredCourses = $checkRegistered->fetchAll(PDO::FETCH_COLUMN);

                // Kiểm tra thông tin và khóa các môn học
                $checkCourses = $conn->prepare("
                    SELECT MaMH, SoLuongDaDangKy, SoLuongMax 
                    FROM monhoc 
                    WHERE MaMH IN ($placeholders)
                    FOR UPDATE
                ");
                $checkCourses->execute($courseIds);
                $courseStatus = [];

                while ($course = $checkCourses->fetch(PDO::FETCH_ASSOC)) {
                    $courseStatus[$course['MaMH']] = $course;
                }

                // Phân loại và đăng ký môn học
                foreach ($courseIds as $courseId) {
                    if (in_array($courseId, $registeredCourses)) {
                        $errorCourses[] = ["courseId" => $courseId, "reason" => "Đã đăng ký trước đó"];
                        continue;
                    }

                    if (!isset($courseStatus[$courseId])) {
                        $errorCourses[] = ["courseId" => $courseId, "reason" => "Môn học không tồn tại"];
                        continue;
                    }

                    if ($courseStatus[$courseId]['SoLuongDaDangKy'] >= $courseStatus[$courseId]['SoLuongMax']) {
                        $errorCourses[] = ["courseId" => $courseId, "reason" => "Lớp đã đầy"];
                        continue;
                    }

                    // Cập nhật số lượng và thêm đăng ký
                    try {
                        $updateStmt = $conn->prepare("
                            UPDATE monhoc 
                            SET SoLuongDaDangKy = SoLuongDaDangKy + 1 
                            WHERE MaMH = ? AND SoLuongDaDangKy < SoLuongMax
                        ");
                        $updateStmt->execute([$courseId]);

                        if ($updateStmt->rowCount() > 0) {
                            $insertStmt = $conn->prepare("
                                INSERT INTO dangkymonhoc (MaSV, MaMH, NgayDangKy) 
                                VALUES (?, ?, NOW())
                            ");
                            $insertStmt->execute([$studentId, $courseId]);
                            $successCourses[] = $courseId;
                        } else {
                            $errorCourses[] = ["courseId" => $courseId, "reason" => "Không thể cập nhật số lượng"];
                        }
                    } catch (PDOException $e) {
                        $errorCourses[] = ["courseId" => $courseId, "reason" => "Lỗi khi đăng ký: " . $e->getMessage()];
                    }
                }

                if (!empty($successCourses)) {
                    $conn->commit();
                } else {
                    $conn->rollBack();
                }

                // Tạo thông báo kết quả
                $messages = [];
                if (!empty($successCourses)) {
                    $messages[] = "Đăng ký thành công: " . implode(", ", $successCourses);
                }
                if (!empty($errorCourses)) {
                    foreach ($errorCourses as $error) {
                        $messages[] = "Môn {$error['courseId']}: {$error['reason']}";
                    }
                }

                sendJsonResponse(
                    !empty($successCourses),
                    [
                        'successCourses' => $successCourses,
                        'errorCourses' => $errorCourses
                    ],
                    implode("\n", $messages)
                );
            } catch (Exception $e) {
                if (isset($conn) && $conn->inTransaction()) {
                    $conn->rollBack();
                }
                sendJsonResponse(false, null, 'Lỗi: ' . $e->getMessage());
            }
            break;

        case 'getRegisteredCourses':
            $studentId = $_GET['studentId'] ?? '';
            if (empty($studentId)) {
                throw new Exception('Missing student ID');
            }

            $sql = "SELECT m.*, dk.NgayDangKy 
                    FROM dangkymonhoc dk 
                    JOIN monhoc m ON dk.MaMH = m.MaMH 
                    WHERE dk.MaSV = :studentId";

            $stmt = $conn->prepare($sql);
            $stmt->execute([':studentId' => $studentId]);
            sendJsonResponse(true, $stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'addCourse':
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }

            $data = json_decode(file_get_contents('php://input'), true);

            // Validate data
            if (
                empty($data['courseCode']) || empty($data['courseName']) ||
                empty($data['credits']) || empty($data['lecturer']) ||
                empty($data['maxStudents']) || empty($data['facultyCode'])
            ) {
                throw new Exception('Vui lòng điền đầy đủ thông tin');
            }

            // Check if course exists
            $stmt = $conn->prepare("SELECT COUNT(*) FROM monhoc WHERE MaMH = ?");
            $stmt->execute([$data['courseCode']]);
            if ($stmt->fetchColumn() > 0) {
                throw new Exception('Mã môn học đã tồn tại');
            }

            // Check if faculty exists
            $stmt = $conn->prepare("SELECT COUNT(*) FROM khoa WHERE MaKhoa = ?");
            $stmt->execute([$data['facultyCode']]);
            if ($stmt->fetchColumn() == 0) {
                throw new Exception('Mã khoa không tồn tại');
            }

            // Add new course
            $sql = "INSERT INTO monhoc (MaMH, TenMH, SoTC, GiangVien, MaKhoa, SoLuongMax) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $result = $stmt->execute([
                $data['courseCode'],
                $data['courseName'],
                $data['credits'],
                $data['lecturer'],
                $data['facultyCode'],
                $data['maxStudents']
            ]);

            sendJsonResponse($result, null, $result ? 'Thêm tín chỉ thành công' : 'Không thể thêm tín chỉ');
            break;

        case 'editCourse':
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }

            $data = json_decode(file_get_contents('php://input'), true);

            // Validate data
            if (
                empty($data['courseCode']) || empty($data['courseName']) ||
                empty($data['credits']) || empty($data['lecturer']) ||
                empty($data['maxStudents'])
            ) {
                throw new Exception('Vui lòng điền đầy đủ thông tin');
            }

            // Update course
            $sql = "UPDATE monhoc 
                    SET TenMH = ?, SoTC = ?, GiangVien = ?, SoLuongMax = ? 
                    WHERE MaMH = ?";
            $stmt = $conn->prepare($sql);
            $result = $stmt->execute([
                $data['courseName'],
                $data['credits'],
                $data['lecturer'],
                $data['maxStudents'],
                $data['courseCode']
            ]);

            sendJsonResponse($result, null, $result ? 'Cập nhật tín chỉ thành công' : 'Không thể cập nhật tín chỉ');
            break;

        case 'deleteCourse':
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }

            $data = json_decode(file_get_contents('php://input'), true);
            if (!isset($data['courseCode'])) {
                throw new Exception('Missing course code');
            }

            $courseCode = $data['courseCode'];

            try {
                // Log để debug
                file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Attempting to delete course: " . $courseCode . "\n", FILE_APPEND);

                // Kiểm tra xem môn học có tồn tại không
                $checkCourse = $conn->prepare("SELECT SoLuongDaDangKy FROM monhoc WHERE MaMH = ?");
                $checkCourse->execute([$courseCode]);
                $course = $checkCourse->fetch(PDO::FETCH_ASSOC);

                if (!$course) {
                    throw new Exception('Không tìm thấy môn học với mã này');
                }

                // Log số lượng đăng ký
                file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Current registrations: " . $course['SoLuongDaDangKy'] . "\n", FILE_APPEND);

                // Chỉ kiểm tra trong bảng dangkymonhoc nếu SoLuongDaDangKy > 0
                if ($course['SoLuongDaDangKy'] > 0) {
                    $checkRegistration = $conn->prepare("SELECT COUNT(*) FROM dangkymonhoc WHERE MaMH = ?");
                    $checkRegistration->execute([$courseCode]);
                    $registrationCount = $checkRegistration->fetchColumn();

                    // Log số lượng đăng ký thực tế
                    file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Actual registrations in dangkymonhoc: " . $registrationCount . "\n", FILE_APPEND);

                    if ($registrationCount > 0) {
                        throw new Exception('Không thể xóa môn học đã có sinh viên đăng ký');
                    }
                }

                // Nếu không có sinh viên đăng ký, tiến hành xóa môn học
                $deleteStmt = $conn->prepare("DELETE FROM monhoc WHERE MaMH = ?");
                $deleteStmt->execute([$courseCode]);

                if ($deleteStmt->rowCount() > 0) {
                    file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Successfully deleted course: " . $courseCode . "\n", FILE_APPEND);
                    sendJsonResponse(true, null, 'Xóa tín chỉ thành công');
                } else {
                    throw new Exception('Không thể xóa tín chỉ');
                }
            } catch (Exception $e) {
                file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Error deleting course: " . $e->getMessage() . "\n", FILE_APPEND);
                throw $e;
            }
            break;

        case 'cancelRegistration':
            if ($method !== 'POST') {
                sendJsonResponse(false, null, 'Method not allowed');
                break;
            }

            $data = json_decode(file_get_contents('php://input'), true);
            $studentId = $data['studentId'] ?? '';
            $courseCode = $data['courseCode'] ?? '';

            if (empty($studentId) || empty($courseCode)) {
                sendJsonResponse(false, null, 'Thiếu thông tin cần thiết');
                break;
            }

            try {
                $sql = "DELETE FROM dangkymonhoc WHERE MaSV = ? AND MaMH = ?";
                $stmt = $conn->prepare($sql);
                $result = $stmt->execute([$studentId, $courseCode]);

                if ($result) {
                    // Cập nhật số lượng đã đăng ký trong bảng monhoc
                    $updateSql = "UPDATE monhoc SET SoLuongDaDangKy = SoLuongDaDangKy - 1 WHERE MaMH = ?";
                    $updateStmt = $conn->prepare($updateSql);
                    $updateStmt->execute([$courseCode]);

                    sendJsonResponse(true, null, 'Hủy đăng ký thành công');
                } else {
                    sendJsonResponse(false, null, 'Không thể hủy đăng ký');
                }
            } catch (PDOException $e) {
                sendJsonResponse(false, null, 'Lỗi khi hủy đăng ký: ' . $e->getMessage());
            }
            break;

        case 'getRegisteredStudents':
            $courseCode = $_GET['courseCode'] ?? '';
            if (empty($courseCode)) {
                sendJsonResponse(false, null, 'Thiếu mã môn học');
                break;
            }

            try {
                $sql = "SELECT sv.MaSV, sv.HoTen, sv.Lop, dk.NgayDangKy as NgayDK 
                        FROM sinhvien sv 
                        JOIN dangkymonhoc dk ON sv.MaSV = dk.MaSV 
                        WHERE dk.MaMH = ? 
                        ORDER BY dk.NgayDangKy DESC";
                $stmt = $conn->prepare($sql);
                $stmt->execute([$courseCode]);
                $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

                sendJsonResponse(true, $students, '');
            } catch (PDOException $e) {
                sendJsonResponse(false, null, 'Lỗi khi tải danh sách sinh viên: ' . $e->getMessage());
            }
            break;

        case 'uploadAvatar':
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }

            // Kiểm tra xem có file được upload không
            if (!isset($_FILES['avatar'])) {
                throw new Exception('Không tìm thấy file ảnh');
            }

            $file = $_FILES['avatar'];
            $fileName = $file['name'];
            $fileType = $file['type'];
            $fileTmpName = $file['tmp_name'];
            $fileError = $file['error'];

            // Kiểm tra lỗi upload
            if ($fileError !== UPLOAD_ERR_OK) {
                throw new Exception('Lỗi khi upload file');
            }

            // Kiểm tra định dạng file
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($fileType, $allowedTypes)) {
                throw new Exception('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)');
            }

            // Tạo tên file mới để tránh trùng lặp
            $newFileName = uniqid() . '_' . $fileName;
            $uploadPath = 'uploads/avatars/' . $newFileName;

            // Tạo thư mục nếu chưa tồn tại
            if (!file_exists('uploads/avatars')) {
                mkdir('uploads/avatars', 0777, true);
            }

            // Di chuyển file upload vào thư mục đích
            if (move_uploaded_file($fileTmpName, $uploadPath)) {
                // Lưu đường dẫn ảnh vào session hoặc database
                session_start();
                $_SESSION['avatar'] = $uploadPath;

                sendJsonResponse(true, ['avatarUrl' => $uploadPath], 'Upload ảnh thành công');
            } else {
                throw new Exception('Không thể lưu file ảnh');
            }
            break;

        case 'getAvatar':
            session_start();
            $avatarUrl = $_SESSION['avatar'] ?? 'img/me.jpg'; // Đường dẫn ảnh mặc định
            sendJsonResponse(true, ['avatarUrl' => $avatarUrl]);
            break;

        case 'getFaculties':
            $stmt = $conn->prepare("SELECT * FROM khoa ORDER BY MaKhoa");
            $stmt->execute();
            sendJsonResponse(true, $stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'addFaculty':
            if ($method !== 'POST') {
                sendJsonResponse(false, null, 'Method not allowed');
                break;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            // Kiểm tra dữ liệu đầu vào
            if (!isset($input['MaKhoa']) || !isset($input['TenKhoa'])) {
                sendJsonResponse(false, null, 'Thiếu thông tin khoa');
                break;
            }

            $maKhoa = trim($input['MaKhoa']);
            $tenKhoa = trim($input['TenKhoa']);

            // Kiểm tra dữ liệu trống
            if (empty($maKhoa) || empty($tenKhoa)) {
                sendJsonResponse(false, null, 'Vui lòng điền đầy đủ thông tin');
                break;
            }

            try {
                // Kiểm tra mã khoa đã tồn tại
                $stmt = $conn->prepare("SELECT COUNT(*) FROM khoa WHERE MaKhoa = ?");
                $stmt->execute([$maKhoa]);
                if ($stmt->fetchColumn() > 0) {
                    sendJsonResponse(false, null, 'Mã khoa đã tồn tại');
                    break;
                }

                // Thêm khoa mới
                $stmt = $conn->prepare("INSERT INTO khoa (MaKhoa, TenKhoa) VALUES (?, ?)");
                $result = $stmt->execute([$maKhoa, $tenKhoa]);

                if ($result) {
                    sendJsonResponse(true, null, 'Thêm khoa thành công');
                } else {
                    sendJsonResponse(false, null, 'Không thể thêm khoa');
                }
            } catch (PDOException $e) {
                sendJsonResponse(false, null, 'Lỗi database: ' . $e->getMessage());
            }
            break;

        case 'editFaculty':
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }

            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['facultyCode']) || empty($data['facultyName'])) {
                throw new Exception('Vui lòng điền đầy đủ thông tin');
            }

            // Kiểm tra xem khoa có tồn tại không
            $stmt = $conn->prepare("SELECT COUNT(*) FROM khoa WHERE MaKhoa = ?");
            $stmt->execute([$data['facultyCode']]);
            if ($stmt->fetchColumn() == 0) {
                throw new Exception('Không tìm thấy khoa');
            }

            // Cập nhật thông tin khoa
            $sql = "UPDATE khoa SET TenKhoa = ? WHERE MaKhoa = ?";
            $stmt = $conn->prepare($sql);
            $result = $stmt->execute([
                $data['facultyName'],
                $data['facultyCode']
            ]);

            sendJsonResponse($result, null, $result ? 'Cập nhật thông tin khoa thành công' : 'Không thể cập nhật thông tin khoa');
            break;

        case 'deleteFaculty':
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }

            $data = json_decode(file_get_contents('php://input'), true);
            $facultyCode = $data['facultyCode'] ?? '';

            if (empty($facultyCode)) {
                throw new Exception('Mã khoa không được để trống');
            }

            // Kiểm tra xem có sinh viên nào thuộc khoa này không
            $stmt = $conn->prepare("SELECT COUNT(*) FROM sinhvien WHERE Khoa = ?");
            $stmt->execute([$facultyCode]);
            if ($stmt->fetchColumn() > 0) {
                throw new Exception('Không thể xóa khoa đã có sinh viên');
            }

            // Kiểm tra xem có môn học nào thuộc khoa này không
            $stmt = $conn->prepare("SELECT COUNT(*) FROM monhoc WHERE MaKhoa = ?");
            $stmt->execute([$facultyCode]);
            if ($stmt->fetchColumn() > 0) {
                throw new Exception('Không thể xóa khoa đã có môn học');
            }

            // Xóa khoa
            $stmt = $conn->prepare("DELETE FROM khoa WHERE MaKhoa = ?");
            $result = $stmt->execute([$facultyCode]);

            sendJsonResponse($result, null, $result ? 'Xóa khoa thành công' : 'Không thể xóa khoa');
            break;

        default:
            throw new Exception('Invalid action');
    }
} catch (Exception $e) {
    file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
} finally {
    if (isset($conn)) {
        $conn = null;
    }
}
