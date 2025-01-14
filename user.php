<?php
session_start();
require_once "config.php";

header('Content-Type: application/json');

// Kiểm tra đăng nhập và role
function checkAuth() {
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
        return false;
    }
    return $_SESSION['role'] === 'user';
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'checkAuth':
        echo json_encode([
            'success' => checkAuth(),
            'role' => $_SESSION['role'] ?? null
        ]);
        break;

    case 'getUserInfo':
        if (!checkAuth()) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        try {
            // Lấy thông tin user kết hợp với thông tin khoa và sinh viên
            $stmt = $conn->prepare("
                SELECT 
                    u.*,
                    s.HoTen as fullName,
                    s.NgaySinh as birthDate,
                    s.MaSV as studentId,
                    s.Lop as class,
                    s.MaKhoa as faculty,
                    k.TenKhoa as facultyName
                FROM users u
                LEFT JOIN sinhvien s ON u.student_id = s.MaSV
                LEFT JOIN khoa k ON s.MaKhoa = k.MaKhoa
                WHERE u.id = ?
            ");
            
            $stmt->execute([$_SESSION['user_id']]);
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($userData) {
                // Kiểm tra xem đã cập nhật thông tin chưa
                $is_profile_completed = !empty($userData['fullName']) && 
                                      !empty($userData['studentId']) && 
                                      !empty($userData['birthDate']) && 
                                      !empty($userData['class']) && 
                                      !empty($userData['faculty']);

                $userData['is_profile_completed'] = $is_profile_completed;

                // Format ngày sinh nếu có
                if (!empty($userData['birthDate'])) {
                    $userData['birthDate'] = date('Y-m-d', strtotime($userData['birthDate']));
                }

                echo json_encode([
                    'success' => true,
                    'data' => $userData
                ]);
            } else {
                throw new Exception('Không tìm thấy thông tin người dùng');
            }
        } catch (Exception $e) {
            error_log("Error in getUserInfo: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'updateProfile':
        if (!checkAuth()) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        try {
            // Bắt đầu transaction
            $conn->beginTransaction();
            
            // 1. Cập nhật bảng users
            $stmt = $conn->prepare("
                UPDATE users 
                SET full_name = ?, 
                    birth_date = ?, 
                    student_id = ?,
                    class = ?,
                    faculty = ?,
                    is_profile_completed = TRUE 
                WHERE id = ?
            ");

            $stmt->execute([
                $data['fullName'],
                $data['birthDate'],
                $data['studentId'],
                $data['class'],
                $data['faculty'],
                $_SESSION['user_id']
            ]);

            // 2. Kiểm tra xem sinh viên đã tồn tại trong bảng sinhvien chưa
            $checkStmt = $conn->prepare("SELECT MaSV FROM sinhvien WHERE MaSV = ?");
            $checkStmt->execute([$data['studentId']]);
            
            if ($checkStmt->rowCount() > 0) {
                // Nếu đã tồn tại, cập nhật thông tin
                $updateStmt = $conn->prepare("
                    UPDATE sinhvien 
                    SET HoTen = ?,
                        NgaySinh = ?,
                        Lop = ?,
                        Khoa = (SELECT TenKhoa FROM khoa WHERE MaKhoa = ?)
                    WHERE MaSV = ?
                ");
                
                $updateStmt->execute([
                    $data['fullName'],
                    $data['birthDate'],
                    $data['class'],
                    $data['faculty'],
                    $data['studentId']
                ]);
            } else {
                // Nếu chưa tồn tại, thêm mới
                $insertStmt = $conn->prepare("
                    INSERT INTO sinhvien (MaSV, HoTen, NgaySinh, Lop, Khoa)
                    SELECT ?, ?, ?, ?, TenKhoa
                    FROM khoa
                    WHERE MaKhoa = ?
                ");
                
                $insertStmt->execute([
                    $data['studentId'],
                    $data['fullName'],
                    $data['birthDate'],
                    $data['class'],
                    $data['faculty']
                ]);
            }

            // Commit transaction
            $conn->commit();
            
            echo json_encode([
                'success' => true,
                'message' => 'Thông tin đã được cập nhật thành công'
            ]);

        } catch (PDOException $e) {
            // Rollback nếu có lỗi
            $conn->rollBack();
            
            echo json_encode([
                'success' => false,
                'message' => 'Lỗi cập nhật: ' . $e->getMessage()
            ]);
        }
        break;

    case 'getFaculties':
        try {
            $stmt = $conn->prepare("SELECT MaKhoa, TenKhoa FROM khoa ORDER BY TenKhoa");
            $stmt->execute();
            $faculties = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'faculties' => $faculties
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ]);
        }
        break;

    case 'getAvailableCourses':
        try {
            if (!checkAuth()) {
                throw new Exception('Unauthorized');
            }

            // Lấy MaSV và MaKhoa của user hiện tại
            $stmt = $conn->prepare("
                SELECT 
                    u.student_id, 
                    k.MaKhoa
                FROM users u
                JOIN sinhvien s ON u.student_id = s.MaSV
                JOIN khoa k ON s.Khoa = k.TenKhoa
                WHERE u.id = ?
            ");
            $stmt->execute([$_SESSION['user_id']]);
            $studentInfo = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$studentInfo) {
                throw new Exception('Vui lòng cập nhật thông tin sinh viên trước');
            }

            // Lấy học kỳ hiện tại
            $semesterStmt = $conn->prepare("
                SELECT MaHK 
                FROM hocky 
                WHERE TrangThai = TRUE 
                LIMIT 1
            ");
            $semesterStmt->execute();
            $currentSemester = $semesterStmt->fetch(PDO::FETCH_ASSOC);

            if (!$currentSemester) {
                throw new Exception('Không tìm thấy học kỳ hiện tại. Vui lòng liên hệ quản trị viên.');
            }

            // Lấy danh sách môn học
            $stmt = $conn->prepare("
                SELECT 
                    m.*,
                    h.TenHK,
                    COALESCE(m.SoLuongDaDangKy, 0) as SoLuongDaDangKy,
                    CASE WHEN EXISTS(
                        SELECT 1 FROM dangkymonhoc 
                        WHERE MaMH = m.MaMH AND MaSV = ?
                    ) THEN 1 ELSE 0 END as DaDangKy
                FROM monhoc m
                JOIN hocky h ON m.MaHK = h.MaHK
                WHERE m.MaKhoa = ? 
                AND m.MaHK = ?
                AND NOT EXISTS (
                    SELECT 1 
                    FROM dangkymonhoc dk 
                    WHERE dk.MaMH = m.MaMH 
                    AND dk.MaSV = ?
                )
                ORDER BY m.MaMH
            ");
            
            $stmt->execute([
                $studentInfo['student_id'],
                $studentInfo['MaKhoa'],
                $currentSemester['MaHK'],
                $studentInfo['student_id']
            ]);
            $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'courses' => $courses,
                'semester' => $currentSemester
            ]);

        } catch (Exception $e) {
            error_log("Error in getAvailableCourses: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'getCurrentSemester':
        try {
            $stmt = $conn->prepare("
                SELECT 
                    MaHK, 
                    TenHK, 
                    NgayBatDau, 
                    NgayKetThuc,
                    NgayBatDauDK,
                    NgayKetThucDK,
                    TrangThai,
                    CASE 
                        WHEN CURRENT_DATE < NgayBatDauDK THEN 'CHUA_DEN'
                        WHEN CURRENT_DATE > NgayKetThucDK THEN 'DA_HET'
                        ELSE 'DANG_MO'
                    END as TrangThaiDK
                FROM hocky
                WHERE TrangThai = TRUE
                LIMIT 1
            ");
            $stmt->execute();
            $semester = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($semester) {
                // Format dates
                $semester['NgayBatDauDK'] = date('Y-m-d', strtotime($semester['NgayBatDauDK']));
                $semester['NgayKetThucDK'] = date('Y-m-d', strtotime($semester['NgayKetThucDK']));
                $semester['NgayBatDau'] = date('Y-m-d', strtotime($semester['NgayBatDau']));
                $semester['NgayKetThuc'] = date('Y-m-d', strtotime($semester['NgayKetThuc']));
            }

            echo json_encode([
                'success' => true,
                'semester' => $semester
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'registerCourses':
        try {
            if (!checkAuth()) {
                throw new Exception('Unauthorized');
            }

            $data = json_decode(file_get_contents('php://input'), true);
            $courseIds = $data['courseIds'] ?? [];

            if (empty($courseIds)) {
                throw new Exception('Vui lòng chọn ít nhất một môn học');
            }

            // Lấy MaSV của user
            $stmt = $conn->prepare("SELECT student_id FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $studentId = $stmt->fetchColumn();

            if (!$studentId) {
                throw new Exception('Vui lòng cập nhật thông tin sinh viên trước');
            }

            $conn->beginTransaction();

            foreach ($courseIds as $courseId) {
                // Kiểm tra số lượng đăng ký
                $checkStmt = $conn->prepare("
                    SELECT 
                        m.SoLuongMax,
                        COALESCE(m.SoLuongDaDangKy, 0) as SoLuongHienTai
                    FROM monhoc m
                    WHERE m.MaMH = ?
                    FOR UPDATE
                ");
                $checkStmt->execute([$courseId]);
                $courseInfo = $checkStmt->fetch(PDO::FETCH_ASSOC);

                if ($courseInfo['SoLuongHienTai'] >= $courseInfo['SoLuongMax']) {
                    throw new Exception("Môn học $courseId đã đủ số lượng");
                }

                // Kiểm tra đã đăng ký chưa
                $existStmt = $conn->prepare("
                    SELECT COUNT(*) FROM dangkymonhoc 
                    WHERE MaSV = ? AND MaMH = ?
                ");
                $existStmt->execute([$studentId, $courseId]);
                
                if ($existStmt->fetchColumn() > 0) {
                    throw new Exception("Môn học $courseId đã được đăng ký trước đó");
                }

                // Thực hiện đăng ký
                $insertStmt = $conn->prepare("
                    INSERT INTO dangkymonhoc (MaSV, MaMH, NgayDangKy, TrangThai)
                    VALUES (?, ?, NOW(), 1)
                ");
                $insertStmt->execute([$studentId, $courseId]);

                // Cập nhật số lượng đã đăng ký trong bảng monhoc
                $updateStmt = $conn->prepare("
                    UPDATE monhoc 
                    SET SoLuongDaDangKy = COALESCE(SoLuongDaDangKy, 0) + 1
                    WHERE MaMH = ?
                ");
                $updateStmt->execute([$courseId]);
            }

            $conn->commit();

            echo json_encode([
                'success' => true,
                'message' => 'Đăng ký môn học thành công'
            ]);

        } catch (Exception $e) {
            if ($conn->inTransaction()) {
                $conn->rollBack();
            }
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'getRegisteredCourses':
        if (!checkAuth()) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        try {
            // Lấy MaSV của user hiện tại
            $stmt = $conn->prepare("
                SELECT student_id 
                FROM users 
                WHERE id = ?
            ");
            $stmt->execute([$_SESSION['user_id']]);
            $studentId = $stmt->fetchColumn();

            if (!$studentId) {
                throw new Exception('Vui lòng cập nhật thông tin sinh viên');
            }

            // Lấy danh sách môn học đã đăng ký
            $stmt = $conn->prepare("
                SELECT 
                    d.MaMH,
                    m.TenMH,
                    m.SoTC,
                    m.GiangVien,
                    d.NgayDangKy
                FROM dangkymonhoc d
                JOIN monhoc m ON d.MaMH = m.MaMH
                WHERE d.MaSV = ?
                ORDER BY d.NgayDangKy DESC
            ");
            
            $stmt->execute([$studentId]);
            $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'courses' => $courses
            ]);

        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'cancelRegistration':
        if (!checkAuth()) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $courseId = $data['courseId'] ?? '';

            if (empty($courseId)) {
                throw new Exception('Không tìm thấy mã môn học');
            }

            // Lấy MaSV của user
            $stmt = $conn->prepare("SELECT student_id FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $studentId = $stmt->fetchColumn();

            if (!$studentId) {
                throw new Exception('Không tìm thấy thông tin sinh viên');
            }

            // Bắt đầu transaction
            $conn->beginTransaction();

            // Kiểm tra xem môn học có tồn tại và đã đăng ký chưa
            $checkStmt = $conn->prepare("
                SELECT COUNT(*) 
                FROM dangkymonhoc 
                WHERE MaSV = ? AND MaMH = ?
            ");
            $checkStmt->execute([$studentId, $courseId]);
            
            if ($checkStmt->fetchColumn() == 0) {
                throw new Exception('Bạn chưa đăng ký môn học này');
            }

            // Xóa đăng ký
            $deleteStmt = $conn->prepare("
                DELETE FROM dangkymonhoc 
                WHERE MaSV = ? AND MaMH = ?
            ");
            $deleteStmt->execute([$studentId, $courseId]);

            // Commit transaction
            $conn->commit();

            echo json_encode([
                'success' => true,
                'message' => 'Hủy đăng ký thành công'
            ]);

        } catch (Exception $e) {
            // Rollback nếu có lỗi
            if ($conn->inTransaction()) {
                $conn->rollBack();
            }
            
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'getDashboardStats':
        if (!checkAuth()) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        try {
            // Lấy MaSV của user
            $stmt = $conn->prepare("SELECT student_id FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $studentId = $stmt->fetchColumn();

            if (!$studentId) {
                throw new Exception('Vui lòng cập nhật thông tin sinh viên');
            }

            // Lấy thống kê
            $stmt = $conn->prepare("
                SELECT 
                    COUNT(d.MaMH) as courseCount,
                    COALESCE(SUM(m.SoTC), 0) as totalCredits
                FROM dangkymonhoc d
                JOIN monhoc m ON d.MaMH = m.MaMH
                WHERE d.MaSV = ?
            ");
            
            $stmt->execute([$studentId]);
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'stats' => $stats
            ]);

        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    default:
        echo json_encode([
            'success' => false,
            'message' => 'Invalid action'
        ]);
}
?>
