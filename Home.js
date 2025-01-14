// Thêm sự kiện cho tất cả các mục collapsible
document.querySelectorAll('.collapsible, .collapsible-profile').forEach(collapsible => {
    collapsible.addEventListener('click', function () {
        const submenu = this.nextElementSibling; // Tìm submenu liền kề
        const toggleIcon = this.querySelector('.menu-toggle'); // Biểu tượng toggle

        // Hiển thị hoặc ẩn submenu
        if (submenu.style.display === 'block') {
            submenu.style.display = 'none';
            toggleIcon.textContent = '▼';
        } else {
            submenu.style.display = 'block';
            toggleIcon.textContent = '▲';
        }
    });
});

// Hiển thị submenu cho profile-sidebar
document.querySelector('.profile-sidebar').addEventListener('click', function (e) {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
    const submenu = this.querySelector('.submenu');

    if (submenu) {
        // Toggle hiển thị submenu
        if (submenu.style.display === 'block') {
            submenu.style.display = 'none';
        } else {
            // Đặt vị trí và style cho submenu
            submenu.style.display = 'block';
            submenu.style.position = 'absolute';
            submenu.style.bottom = '100%'; // Hiển thị ngay trên profile-sidebar
            submenu.style.left = '150px';
            submenu.style.width = '10%';
            submenu.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            submenu.style.borderRadius = '8px';
            // submenu.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.1)';
            submenu.style.zIndex = '1000';
        }
    }
});

// Hiển thị popup AddStudent
function showPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('addStudentPopup').style.display = 'block';
}
// Hiển thị popup DeleteStudent
function showDeleteStudent() {
    document.getElementById('overlayDelete').style.display = 'block';
    document.getElementById('deleteStudentPopup').style.display = 'block';
}

// Hiển thị popup EditStudent
function showEditStudent() {
    if (document.getElementById('student-table').classList.contains('show-edit')) {
        hideEditButtons();
    } else {
        showEditButtons();
    }
}
// Hàm hiển thị nút chỉnh sửa
function showEditButtons() {
    const table = document.getElementById('student-table');
    table.classList.add('show-edit');

    // Thêm nút chỉnh sửa vào mỗi dòng nếu chưa có
    const rows = document.querySelectorAll('#student-list tr');
    rows.forEach(row => {
        if (!row.querySelector('.edit-button')) {
            const editCell = document.createElement('td');
            editCell.className = 'edit-column';
            const editButton = document.createElement('button');
            editButton.className = 'edit-button';
            editButton.innerHTML = '<i class="fas fa-edit"></i> Sửa';
            editButton.onclick = () => showEditPopupForRow(row);
            editCell.appendChild(editButton);
            row.appendChild(editCell);
        }
    });
}

// Hàm ẩn nút chỉnh sửa
function hideEditButtons() {
    const table = document.getElementById('student-table');
    table.classList.remove('show-edit');
}

// Hàm hiển thị popup chỉnh sửa với dữ liệu từ dòng được chọn
function showEditPopupForRow(row) {
    const cells = row.cells;
    document.getElementById('editStudentForm').querySelector('#code').value = cells[1].textContent;
    document.getElementById('editStudentForm').querySelector('#name').value = cells[2].textContent;
    document.getElementById('editStudentForm').querySelector('#birthDay').value = cells[3].textContent;
    document.getElementById('editStudentForm').querySelector('#class').value = cells[4].textContent;
    document.getElementById('editStudentForm').querySelector('#fos').value = cells[5].textContent;

    document.getElementById('overlayEdit').style.display = 'block';
    document.getElementById('editStudentPopup').style.display = 'block';
}

// Đóng popup
function closeAddPopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('addStudentPopup').style.display = 'none';
    resetForm('addStudentForm');
}
function closeDeletePopup() {
    document.getElementById('overlayDelete').style.display = 'none';
    document.getElementById('deleteStudentPopup').style.display = 'none';
    resetForm('deleteStudentForm');
}

function closeEditPopup() {
    document.getElementById('overlayEdit').style.display = 'none';
    document.getElementById('editStudentPopup').style.display = 'none';
    resetForm('editStudentForm');
    hideEditButtons();
}

// Hàm hiển thị quản lý sinh viên
function showStudentManagement() {
    document.getElementById('Find').style.display = 'none';
    document.getElementById('header2').textContent = 'Danh Sách Sinh Viên';
    hideAllTables();
    document.getElementById('student-table').style.display = 'block';
    document.querySelector('.button').style.display = 'flex';
    loadStudents();
}


function showPopupAlert(message, type) {
    // Xóa alert cũ nếu có
    const oldAlert = document.querySelector('.popup-alert');
    if (oldAlert) {
        oldAlert.remove();
    }

    // Tạo alert mới
    const alert = document.createElement('div');
    alert.className = `popup-alert ${type}`;
    alert.textContent = message;

    // Chèn alert vào đầu form
    const form = document.getElementById('addStudentForm');
    form.insertBefore(alert, form.firstChild);

    // Tự động xóa alert sau 3 giây
    setTimeout(() => {
        alert.style.animation = 'slideOutUp 0.3s ease forwards';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 1000);
}

function toggleDarkMode() {
    // Chuyển đổi lớp "dark-mode" cho thẻ body
    document.body.classList.toggle('dark-mode');

    // Chuyển đổi Dark Mode cho các phần tử khác nếu cần
    const sidebar = document.querySelector('.sidebar');
    const table = document.querySelector('.table');

    sidebar.classList.toggle('dark-mode');
    table.classList.toggle('dark-mode');
}

// Thêm event listener với debounce
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('textSearch');
    const debouncedSearch = debounce(searchStudent, 300); // Đợi 300ms sau khi ngừng gõ

    searchInput.addEventListener('input', debouncedSearch);
});

// Hàm chọn hàng trong bảng
function selectRow(row) {
    // Bỏ chọn hàng cũ
    const selectedRow = document.querySelector('tr.selected');
    if (selectedRow) {
        selectedRow.classList.remove('selected');
    }
    // Chọn hàng mới
    row.classList.add('selected');
}

// Hàm thêm sinh viên
function addStudent(event) {
    event.preventDefault();

    const studentCode = document.getElementById("code").value;
    const name = document.getElementById("name").value;
    const birthDay = document.getElementById("birthDay").value;
    const classs = document.getElementById("class").value;
    const fieldOfStudy = document.getElementById("fos").value;

    fetch('api.php?action=addStudent', {
        method: "POST",
        body: JSON.stringify({
            code: studentCode,
            name: name,
            birthDay: birthDay,
            classs: classs,
            fos: fieldOfStudy
        }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(res => {
            showPopupAlert(res.message, res.success ? 'success' : 'error');
            if (res.success) {
                setTimeout(() => {
                    resetForm('addStudentForm');
                    closeAddPopup();
                    loadStudents();
                    window.location.href = 'Home.html';
                }, 1000);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            swal({
                title: "Thông báo!",
                text: "Lỗi khi thêm sinh viên!",
                icon: "error",
                button: "Ok",
            });
        });
}

// Hàm hiển thị sinh viên
function loadStudents() {
    const tableStudents = document.getElementById("student-list");

    fetch("api.php?action=getStudents")  // Thêm action parameter
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            if (!result.success) {
                throw new Error(result.message || 'Không thể tải dữ liệu sinh viên');
            }

            const students = result.data;
            tableStudents.innerHTML = "";

            if (students.length === 0) {
                tableStudents.innerHTML = "<tr><td colspan='7' style='text-align: center;'>Không có sinh viên nào</td></tr>";
                return;
            }

            students.forEach((student, index) => {
                const row = `
                    <tr onclick="selectRow(this)">
                        <td style="text-align: center;">${index + 1}</td>
                        <td style="text-align: center;">${student.MaSV}</td>
                        <td>${student.HoTen}</td>
                        <td style="text-align: center;">${convertToDateFormat(student.NgaySinh)}</td>
                        <td style="text-align: center;">${student.Lop}</td>
                        <td style="text-align: center;">${student.Khoa}</td>
                        <td class="edit-column">
                            <button class="edit-button" onclick="showEditPopupForRow(this.closest('tr'))">
                                Chỉnh sửa
                            </button>
                        </td>
                    </tr>`;
                tableStudents.innerHTML += row;
            });
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Không thể tải dữ liệu sinh viên. Vui lòng thử lại sau.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            tableStudents.innerHTML = "<tr><td colspan='7' style='text-align: center;'>Lỗi khi tải dữ liệu</td></tr>";
        });
}

// Tải danh sách sinh viên khi trang được load
window.onload = loadStudents;

// Hàm xóa sinh viên 
function deleteStudent(event) {
    event.preventDefault();
    const studentId = document.getElementById('deleteStudentForm').querySelector('#code').value;
    closeDeletePopup();

    Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa?',
        text: 'Bạn sẽ không thể hoàn tác hành động này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("api.php?action=deleteStudent", {
                method: "POST",
                body: JSON.stringify({ studentId }),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        Swal.fire({
                            title: "Thông báo!",
                            text: result.message,
                            icon: "success",
                            button: "Ok",
                        }).then(() => {
                            resetForm('deleteStudentForm');
                            loadStudents();
                            window.location.href = 'Home.html';
                        });
                    } else {
                        Swal.fire({
                            title: "Thông báo!",
                            text: "Sinh viên đã đăng ký tín chỉ, không thể xóa!",
                            icon: "error",
                            button: "Ok",
                        });
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    Swal.fire({
                        title: "Thông báo!",
                        text: "Xóa sinh viên thất bại!",
                        icon: "error",
                        button: "Ok",
                    });
                });
        }
    });
}


// Hàm reset form
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const inputs = form.getElementsByTagName('input');
        for (let input of inputs) {
            input.value = '';
        }
    }
}

// Thêm hàm debounce để tránh gọi API quá nhiều lần
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Hàm tìm kiếm
function searchStudent() {
    const keyword = document.getElementById('textSearch').value.trim();
    const tableBody = document.getElementById('student-list');

    if (!keyword) {
        loadStudents(); // Load lại toàn bộ danh sách khi không có từ khóa
        return;
    }

    fetch(`api.php?action=searchStudent&keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(result => {
            if (!result.success) {
                throw new Error(result.message || 'Có lỗi xảy ra khi tìm kiếm');
            }

            tableBody.innerHTML = '';

            if (!result.data || result.data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Không tìm thấy sinh viên nào</td></tr>';
                return;
            }

            result.data.forEach((student, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="text-align: center;">${index + 1}</td>
                    <td style="text-align: center;">${student.MaSV}</td>
                    <td>${student.HoTen}</td>
                    <td style="text-align: center;">${convertToDateFormat(student.NgaySinh)}</td>
                    <td style="text-align: center;">${student.Lop}</td>
                    <td style="text-align: center;">${student.Khoa}</td>
                    <td class="edit-column">
                        <button class="edit-button" onclick="showEditPopupForRow(this.closest('tr'))">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                    </td>
                `;
                row.onclick = () => selectRow(row);
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire({
                title: 'Lỗi!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
}

// Thêm debounce để tối ưu hiệu năng tìm kiếm
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('textSearch');
    if (searchInput) {
        const debouncedSearch = debounce(searchStudent, 300);
        searchInput.addEventListener('input', debouncedSearch);
    }
});
//Hàm chỉnh sửa sinh viên
function editStudent(event) {
    event.preventDefault();

    const form = document.getElementById('editStudentForm');
    const data = {
        code: form.querySelector('#code').value,
        name: form.querySelector('#name').value,
        birthDay: form.querySelector('#birthDay').value,
        classs: form.querySelector('#class').value,
        fos: form.querySelector('#fos').value
    };

    if (!data.code || !data.name || !data.birthDay || !data.classs || !data.fos) {
        Swal.fire({
            title: 'Lỗi!',
            text: 'Vui lòng điền đầy đủ thông tin',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    fetch('api.php?action=editStudent', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(res => {
            closeEditPopup();
            if (res.success) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Chỉnh sửa sinh viên thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        loadStudents();
                    }
                });
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Không thể thay đổi mã sinh viên hoặc không có gì thay đổi!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi kết nối với server!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
}
// Hàm format ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function convertToDateFormat(inputDate) {
    // Tách các phần của ngày từ chuỗi đầu vào
    const [year, month, day] = inputDate.split('-');

    // Kiểm tra định dạng đầu vào hợp lệ
    if (!year || !month || !day) {
        throw new Error("Invalid date format. Expected 'yyyy-MM-dd'.");
    }

    // Chuyển sang định dạng dd/MM/yyyy
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
}

// Hàm lấy text trạng thái
function getStatusText(status) {
    return status === 1 ?
        '<span class="status-active">Đã đăng ký</span>' :
        '<span class="status-inactive">Đã hủy</span>';
}

// Hàm hiển thị danh sách tín chỉ
function showCourseList() {
    document.getElementById('Find').style.display = 'none';
    document.getElementById('header2').textContent = 'Danh Sách Tín Chỉ';
    hideAllTables();
    document.getElementById('course-list-table').style.display = 'block';
    document.querySelector('.button').style.display = 'flex';
    loadCourses();
}

// Hàm load danh sách tín chỉ
function loadCourses() {
    fetch('api.php?action=getCourses')
        .then(response => response.json())
        .then(result => {
            if (!result.success) {
                throw new Error(result.message || 'Không thể tải danh sách tín chỉ');
            }

            const tbody = document.getElementById('course-list');
            tbody.innerHTML = '';

            if (!result.data || result.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Không có tín chỉ nào</td></tr>';
                return;
            }

            result.data.forEach((course, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="text-align: center;">${index + 1}</td>
                    <td style="text-align: center;">
                        <a href="#" class="course-code" data-course="${course.MaMH}" onclick="showRegisteredStudents('${course.MaMH}', '${course.TenMH}')">${course.MaMH}</a>
                    </td>
                    <td>${course.TenMH}</td>
                    <td style="text-align: center;">${course.SoTC}</td>
                    <td>${course.GiangVien}</td>
                    <td style="text-align: center;">${course.MaKhoa}</td>
                    <td style="text-align: center;">${course.SoLuongMax}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Lỗi',
                text: error.message,
                icon: 'error'
            });
        });
}

// Thêm event listener cho link danh sách tín chỉ
document.addEventListener('DOMContentLoaded', function() {
    const courseListLink = document.querySelector('#show-course-list');
    if (courseListLink) {
        courseListLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCourseList();
        });
    }
});

// Hàm ẩn tất cả các bảng
function hideAllTables() {
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        table.style.display = 'none';
    });
}

// Thêm loading spinner
function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(spinner);
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Thêm event listeners khi trang được load
document.addEventListener('DOMContentLoaded', function () {
    // Event listener cho link danh sách tín chỉ
    const courseListLink = document.querySelector('a[href="#"]');
    if (courseListLink && courseListLink.textContent === 'Danh sách tín chỉ') {
        courseListLink.addEventListener('click', function (e) {
            e.preventDefault();
            showCourseList();
        });
    }

    // Event listener cho đăng ký tín chỉ
    const creditRegistrationLink = document.getElementById('show-credit-registration');
    if (creditRegistrationLink) {
        creditRegistrationLink.addEventListener('click', function (e) {
            e.preventDefault();
            showCreditRegistration();
        });
    }

    // Event listener cho xem danh sách đã đăng ký
    const registeredCoursesLink = document.getElementById('show-registered-courses');
    if (registeredCoursesLink) {
        registeredCoursesLink.addEventListener('click', function (e) {
            e.preventDefault();
            //showRegisteredCourses();
        });
    }
});
// Hàm hiển thị đăng ký tín chỉ
function showCreditRegistration() {
    document.getElementById('header2').textContent = 'Đăng Ký Tín Chỉ';
    hideAllTables();
    const registrationTable = document.getElementById('credit-registration-table');
    if (registrationTable) {
        registrationTable.style.display = 'block';
        document.getElementById('studentSearchForCredit').value = ''; // Reset input
        loadCourseListForRegistration(); // Load danh sách môn học
    } else {
        console.error('Registration table not found');
    }
}

// // Hàm hiển thị danh sách môn học đã đăng ký
// function showRegisteredCourses() {
//     document.getElementById('header2').textContent = 'Danh Sách Tín Chỉ Đã Đăng Ký';
//     hideAllTables();
//     document.getElementById('registered-courses-table').style.display = 'block';
//     // Yêu cầu nhập mã sinh viên
//     const studentId = prompt('Nhập mã sinh viên để xem danh sách đăng ký:');
//     if (!studentId) return;

//     loadRegisteredCourses(studentId);
// }

// Hàm load danh sách môn học đã đăng ký từ server
function loadRegisteredCourses(studentId) {
    if (!studentId) return;

    fetch(`api.php?action=getRegisteredCourses&studentId=${studentId}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const tbody = document.getElementById('registered-courses-list');
                if (tbody) {
                    tbody.innerHTML = '';
                    if (result.data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Không có môn học nào được đăng ký</td></tr>';
                        return;
                    }
                    result.data.forEach((course, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${course.MaMH}</td>
                            <td>${course.TenMH}</td>
                            <td>${course.SoTC}</td>
                            <td>${course.GiangVien}</td>
                            <td>${formatDate(course.NgayDangKy)}</td>
                            <td>
                                <button class="cancel-registration-button" 
                                        onclick="cancelCourseRegistration('${course.MaMH}', '${studentId}')">
                                    Hủy đăng ký
                                </button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Lỗi',
                text: error.message,
                icon: 'error'
            });
        });
}

// Hàm hiển thị danh sách môn học đã đăng ký
function displayRegisteredCourses(courses) {
    const tbody = document.getElementById('registered-courses-list');
    tbody.innerHTML = '';

    if (courses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">Không có môn học nào được đăng ký</td>
            </tr>`;
        return;
    }

    courses.forEach((course, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${course.MaMH}</td>
            <td>${course.TenMH}</td>
            <td>${course.SoTC}</td>
            <td>${course.GiangVien}</td>
            <td>${formatDate(course.NgayDangKy)}</td>
            <td>
                <button class="cancel-registration-button" 
                        onclick="cancelCourseRegistration('${course.MaMH}')">
                    Hủy đăng ký
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Thêm hàm hủy đăng ký môn học
function cancelCourseRegistration(courseId) {
    const studentId = prompt('Nhập mã sinh viên để xác nhận hủy đăng ký:');
    if (!studentId) return;

    Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn hủy đăng ký môn học này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hủy đăng ký',
        cancelButtonText: 'Không'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('api.php?action=cancelRegistration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentId: studentId,
                    courseId: courseId
                })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        Swal.fire({
                            title: 'Thành công',
                            text: 'Đã hủy đăng ký môn học',
                            icon: 'success'
                        }).then(() => {
                            loadRegisteredCourses(studentId); // Truyền studentId khi load lại danh sách
                        });
                    } else {
                        throw new Error(result.message);
                    }
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Lỗi',
                        text: error.message,
                        icon: 'error'
                    });
                });
        }
    });
}

// Hiển thị popup thêm tín chỉ
function showAddCoursePopup() {
    document.getElementById('overlayAddCourse').style.display = 'block';
    document.getElementById('addCoursePopup').style.display = 'block';
    loadFacultySelect(); // Load danh sách khoa khi mở popup
}

// Đóng popup thêm tín chỉ
function closeAddCoursePopup() {
    document.getElementById('overlayAddCourse').style.display = 'none';
    document.getElementById('addCoursePopup').style.display = 'none';
    resetForm('addCourseForm');
}

// Thêm tín chỉ mới
function addCourse(event) {
    event.preventDefault();

    const data = {
        courseCode: document.getElementById('courseCode').value,
        courseName: document.getElementById('courseName').value,
        credits: document.getElementById('credits').value,
        lecturer: document.getElementById('lecturer').value,
        facultyCode: document.getElementById('facultyCode').value,
        maxStudents: document.getElementById('maxStudents').value
    };

    if (!data.facultyCode) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng chọn khoa',
            icon: 'error'
        });
        return;
    }

    fetch('api.php?action=addCourse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                Swal.fire({
                    title: 'Thành công',
                    text: 'Thêm tín chỉ thành công',
                    icon: 'success'
                }).then(() => {
                    closeAddCoursePopup();
                    loadCourses();
                });
            } else {
                throw new Error(result.message);
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Lỗi',
                text: error.message,
                icon: 'error'
            });
        });
}

// Hiển thị nút sửa
function showEditCourse() {
    const table = document.getElementById('course-list-table');
    table.classList.toggle('show-edit');

    if (table.classList.contains('show-edit')) {
        const rows = document.querySelectorAll('#course-list tr');
        rows.forEach(row => {
            if (!row.querySelector('.edit-button')) {
                const editCell = document.createElement('td');
                editCell.className = 'edit-column';
                const editButton = document.createElement('button');
                editButton.className = 'edit-button';
                editButton.innerHTML = 'Sửa';
                editButton.onclick = () => showEditCoursePopup(row);
                editCell.appendChild(editButton);
                row.appendChild(editCell);
            }
        });
    }
}

// Hiển thị popup sửa tín chỉ
function showEditCoursePopup(row) {
    const cells = row.cells;
    document.getElementById('courseCodeEdit').value = cells[1].textContent;
    document.getElementById('courseNameEdit').value = cells[2].textContent;
    document.getElementById('creditsEdit').value = cells[3].textContent;
    document.getElementById('lecturerEdit').value = cells[4].textContent;
    const maxStudents = cells[5].textContent.split('/')[1];
    document.getElementById('maxStudentsEdit').value = maxStudents;

    document.getElementById('overlayEditCourse').style.display = 'block';
    document.getElementById('editCoursePopup').style.display = 'block';
}

// Đóng popup sửa tín chỉ
function closeEditCoursePopup() {
    document.getElementById('overlayEditCourse').style.display = 'none';
    document.getElementById('editCoursePopup').style.display = 'none';
    resetForm('editCourseForm');
}

// Sửa tín chỉ
function editCourse(event) {
    event.preventDefault();

    const data = {
        courseCode: document.getElementById('courseCodeEdit').value,
        courseName: document.getElementById('courseNameEdit').value,
        credits: document.getElementById('creditsEdit').value,
        lecturer: document.getElementById('lecturerEdit').value,
        maxStudents: document.getElementById('maxStudentsEdit').value
    };

    fetch('api.php?action=editCourse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                Swal.fire({
                    title: 'Thành công',
                    text: 'Cập nhật tín chỉ thành công',
                    icon: 'success'
                }).then(() => {
                    closeEditCoursePopup();
                    loadCourseList();
                });
            } else {
                throw new Error(result.message);
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Lỗi',
                text: error.message,
                icon: 'error'
            });
        });
}

// Hiển thị popup xóa tín chỉ
function showDeleteCourse() {
    document.getElementById('overlayDeleteCourse').style.display = 'block';
    document.getElementById('deleteCoursePopup').style.display = 'block';
}

// Đóng popup xóa tín chỉ
function closeDeleteCoursePopup() {
    document.getElementById('overlayDeleteCourse').style.display = 'none';
    document.getElementById('deleteCoursePopup').style.display = 'none';
    document.getElementById('courseCodeDelete').value = '';
}

// Cập nhật event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Event listener cho nút xóa tín chỉ
    const deleteButton = document.querySelector('.DeleteCourse');
    if (deleteButton) {
        deleteButton.addEventListener('click', function (e) {
            e.preventDefault();
            showDeleteCourse();
        });
    }

    // Event listener cho form xóa tín chỉ
    const deleteCourseForm = document.getElementById('deleteCourseForm');
    if (deleteCourseForm) {
        deleteCourseForm.addEventListener('submit', function (e) {
            e.preventDefault();
            deleteCourse(e);
        });
    }

    // Event listener cho nút đóng popup
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            closeDeleteCoursePopup();
        });
    });
});

// Hàm xóa tín chỉ
function deleteCourse(event) {
    event.preventDefault();

    const courseCode = document.getElementById('courseCodeDelete').value;
    if (!courseCode) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng nhập mã môn học',
            icon: 'error'
        });
        return;
    }

    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa tín chỉ này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('api.php?action=deleteCourse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseCode })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        Swal.fire({
                            title: 'Thành công',
                            text: 'Xóa tín chỉ thành công',
                            icon: 'success'
                        }).then(() => {
                            closeDeleteCoursePopup();
                            loadCourseList(); // Tải lại danh sách tín chỉ
                        });
                    } else {
                        throw new Error(result.message);
                    }
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Lỗi',
                        text: error.message,
                        icon: 'error'
                    });
                });
        }
    });
}

// Hàm hiển thị danh sách môn học có thể đăng ký
function loadCourseListForRegistration() {
    fetch('api.php?action=getCourseList')
        .then(response => response.json())
        .then(result => {
            if (!result.success) {
                throw new Error(result.message || 'Không thể tải danh sách môn học');
            }

            const tbody = document.getElementById('registration-list');
            tbody.innerHTML = '';

            result.data.forEach((course, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${course.MaMH}</td>
                    <td>${course.TenMH}</td>
                    <td>${course.SoTC}</td>
                    <td>${course.GiangVien}</td>
                    <td>${course.SoLuongDaDangKy}/${course.SoLuongMax}</td>
                    <td>
                        <input type="checkbox" 
                               name="courseSelect" 
                               value="${course.MaMH}"
                               ${course.SoLuongDaDangKy >= course.SoLuongMax ? 'disabled' : ''}>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: error.message,
                icon: 'error'
            });
        });
}

// Hàm hiển thị danh sách môn học có thể đăng ký
function displayCourses(courses) {
    const tbody = document.getElementById('registration-list');
    tbody.innerHTML = '';

    courses.forEach((course, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${course.MaMH}</td>
            <td>${course.TenMH}</td>
            <td>${course.SoTC}</td>
            <td>${course.GiangVien}</td>
            <td>${course.SoLuongDaDangKy}/${course.SoLuongMax}</td>
            <td>
                <input type="checkbox" 
                       class="course-checkbox" 
                       name="courseCheckbox"
                       value="${course.MaMH}"
                       ${course.SoLuongDaDangKy >= course.SoLuongMax ? 'disabled' : ''}>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Thêm hàm hideAllTables nếu chưa có
function hideAllTables() {
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        table.style.display = 'none';
    });
}

// Thêm event listener cho nút xem danh sách đã đăng ký
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('show-registered-courses').addEventListener('click', showRegisteredCourses);
});

// Hàm đăng ký tín chỉ
function registerCourses() {
    const studentId = document.getElementById('studentSearchForCredit').value.trim();
    if (!studentId) {
        Swal.fire({
            title: 'Lỗi!',
            text: 'Vui lòng nhập mã sinh viên',
            icon: 'error'
        });
        return;
    }

    const selectedCourses = Array.from(document.querySelectorAll('input[name="courseSelect"]:checked'))
        .map(checkbox => checkbox.value);

    if (selectedCourses.length === 0) {
        Swal.fire({
            title: 'Lỗi!',
            text: 'Vui lòng chọn ít nhất một môn học',
            icon: 'error'
        });
        return;
    }

    // Hiển thị dialog xác nhận
    Swal.fire({
        title: 'Xác nhận đăng ký',
        text: `Bạn có chắc chắn muốn đăng ký ${selectedCourses.length} môn học?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Đăng ký',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('api.php?action=registerCourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: studentId,
                    courseIds: selectedCourses
                })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        Swal.fire({
                            title: 'Thành công!',
                            text: result.message,
                            icon: 'success'
                        }).then(() => {
                            // Reload danh sách sau khi đăng ký thành công
                            loadCourseListForRegistration();
                        });
                    } else {
                        Swal.fire({
                            title: 'Thông báo',
                            text: result.message,
                            icon: 'info'
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Có lỗi xảy ra khi đăng ký môn học',
                        icon: 'error'
                    });
                });
        }
    });
}

// Thêm event listeners
document.addEventListener('DOMContentLoaded', function () {
    // ... existing code ...

    // Event listener cho nút đăng ký
    const registerButton = document.querySelector('.register-button');
    if (registerButton) {
        registerButton.addEventListener('click', function (e) {
            e.preventDefault();
            registerCourses();
        });
    } else {
        console.error('Register button not found'); // Debug log
    }
});

// Thêm hàm mới để hiển thị danh sách sinh viên đã đăng ký
function showRegisteredStudents(courseId) {
    fetch(`api.php?action=getRegisteredStudents&courseId=${courseId}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const popup = document.getElementById('studentListPopup');
                const tbody = document.getElementById('registeredStudentsList');
                document.getElementById('courseTitle').textContent = courseId;

                tbody.innerHTML = '';

                if (result.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center">Chưa có sinh viên đăng ký môn học này</td></tr>';
                } else {
                    result.data.forEach((student, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${student.MaSV}</td>
                            <td>${student.HoTen}</td>
                            <td>${student.Lop}</td>
                            <td>${formatDate(student.NgayDangKy)}</td>
                            <td>
                                <button class="cancel-registration-button" 
                                        onclick="cancelRegistration('${student.MaSV}', '${courseId}')">
                                    Hủy đăng ký
                                </button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                }

                popup.style.display = 'block';
            } else {
                throw new Error(result.message || 'Không thể tải danh sách sinh viên');
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Lỗi',
                text: error.message,
                icon: 'error'
            });
        });
}

// Thêm hàm hủy đăng ký
function cancelRegistration(studentId, courseId) {
    Swal.fire({
        title: 'Xác nhận hủy đăng ký',
        text: 'Bạn có chắc chắn muốn hủy đăng ký môn học này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('api.php?action=cancelRegistration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentId: studentId,
                    courseId: courseId
                })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        Swal.fire({
                            title: 'Thành công',
                            text: 'Đã hủy đăng ký môn học',
                            icon: 'success'
                        }).then(() => {
                            // Tải lại danh sách sinh viên trong popup
                            showRegisteredStudents(courseId);

                            // Cập nhật số lượng trong bảng môn học
                            const courseRow = document.querySelector(`tr:has(a.course-code[onclick*="${courseId}"])`);
                            if (courseRow) {
                                const countCell = courseRow.querySelector('td:nth-child(6)');
                                if (countCell) {
                                    const [current, max] = countCell.textContent.split('/');
                                    const newCount = parseInt(current) - 1;
                                    countCell.textContent = `${newCount}/${max}`;
                                }
                            }
                        });
                    } else {
                        throw new Error(result.message || 'Không thể hủy đăng ký');
                    }
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Lỗi',
                        text: error.message,
                        icon: 'error'
                    });
                });
        }
    });
}

// Thêm hàm đóng popup
function closeStudentListPopup() {
    document.getElementById('studentListPopup').style.display = 'none';
}

// Thêm hàm hủy đăng ký
function cancelRegistration(studentId, courseCode) {
    Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn hủy đăng ký này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('api.php?action=cancelRegistration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: studentId,
                    courseCode: courseCode
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Thành công',
                        text: 'Đã hủy đăng ký thành công',
                        icon: 'success'
                    }).then(() => {
                        showRegisteredStudents(courseCode);
                    });
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                Swal.fire({
                    title: 'Lỗi',
                    text: error.message,
                    icon: 'error'
                });
            });
        }
    });
}

// Thêm hàm hiển thị danh sách sinh viên đăng ký
function showRegisteredStudents(courseCode, courseName) {
    fetch(`api.php?action=getRegisteredStudents&courseCode=${courseCode}`)
        .then(response => response.json())
        .then(result => {
            if (!result.success) {
                throw new Error(result.message);
            }

            document.getElementById('courseTitle').textContent = `${courseCode} - ${courseName}`;
            const tbody = document.getElementById('registeredStudentsList');
            tbody.innerHTML = '';

            if (!result.data || result.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Chưa có sinh viên đăng ký</td></tr>';
            } else {
                result.data.forEach((student, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="text-align: center;">${index + 1}</td>
                        <td style="text-align: center;">${student.MaSV}</td>
                        <td>${student.HoTen}</td>
                        <td>${student.Lop}</td>
                        <td style="text-align: center;">${student.NgayDK}</td>
                        <td style="text-align: center;">
                            <button onclick="cancelRegistration('${student.MaSV}', '${courseCode}')" class="cancel-btn">Hủy đăng ký</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }

            document.getElementById('studentListPopup').style.display = 'block';
        })
        .catch(error => {
            Swal.fire({
                title: 'Lỗi',
                text: error.message,
                icon: 'error'
            });
        });
}

// Thêm event listener cho việc chọn ảnh
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const profileImage = document.getElementById('profileImage');

    // Khôi phục ảnh đại diện từ session khi tải trang
    fetch('api.php?action=getAvatar')
        .then(response => response.json())
        .then(result => {
            if (result.success && result.data.avatarUrl) {
                profileImage.src = result.data.avatarUrl;
            }
        });

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra xem file có phải là ảnh không
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Vui lòng chọn file ảnh',
                    icon: 'error'
                });
                return;
            }

            // Tạo FormData object để upload file
            const formData = new FormData();
            formData.append('avatar', file);

            // Upload ảnh lên server
            fetch('api.php?action=uploadAvatar', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Cập nhật ảnh đại diện
                    profileImage.src = result.data.avatarUrl;
                    Swal.fire({
                        title: 'Thành công',
                        text: 'Đã cập nhật ảnh đại diện',
                        icon: 'success'
                    });
                } else {
                    throw new Error(result.message);
                }
            })
            .catch(error => {
                Swal.fire({
                    title: 'Lỗi',
                    text: error.message || 'Không thể upload ảnh',
                    icon: 'error'
                });
            });
        }
    });
});
function hideButton() {
    document.querySelector('.button').style.display = 'none';
}
function logout(){
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")){
        window.location.href = 'Login.html';
    }
}

// Hiển thị danh sách khoa
function showFacultyList() {
    document.getElementById('header2').textContent = 'Danh Sách Khoa';
    hideAllTables();
    document.getElementById('faculty-table').style.display = 'block';
    loadFacultyList();
}

// Load danh sách khoa
function loadFacultyList() {
    fetch('api.php?action=getFaculties')
        .then(response => response.json())
        .then(result => {
            if (!result.success) {
                throw new Error(result.message || 'Không thể tải danh sách khoa');
            }

            const tbody = document.getElementById('faculty-list');
            tbody.innerHTML = '';

            result.data.forEach((faculty, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${faculty.MaKhoa}</td>
                    <td>${faculty.TenKhoa}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: error.message,
                icon: 'error'
            });
        });
}

// Hàm hiển thị popup thêm khoa
function showAddFacultyPopup() {
    console.log('Showing popup'); // Debug log
    const overlay = document.getElementById('overlayAddFaculty');
    const popup = document.getElementById('addFacultyPopup');
    
    if (!overlay || !popup) {
        console.error('Overlay or popup not found');
        return;
    }
    
    overlay.style.display = 'block';
    popup.style.display = 'block';
}

// Hàm đóng popup thêm khoa
function closeAddFacultyPopup() {
    const overlay = document.getElementById('overlayAddFaculty');
    const popup = document.getElementById('addFacultyPopup');
    const form = document.getElementById('addFacultyForm');
    
    if (overlay) overlay.style.display = 'none';
    if (popup) popup.style.display = 'none';
    if (form) form.reset();
}

// Hàm thêm khoa
function addFaculty(event) {
    event.preventDefault();
    console.log('Form submitted'); // Debug log

    const maKhoa = document.getElementById('MaKhoa').value.trim();
    const tenKhoa = document.getElementById('TenKhoa').value.trim();

    console.log('MaKhoa:', maKhoa); // Debug log
    console.log('TenKhoa:', tenKhoa); // Debug log

    if (!maKhoa) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng nhập mã khoa',
            icon: 'error'
        });
        return;
    }

    if (!tenKhoa) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng nhập tên khoa',
            icon: 'error'
        });
        return;
    }

    fetch('api.php?action=addFaculty', {
        method: 'POST',
        body: JSON.stringify({
            MaKhoa: maKhoa,
            TenKhoa: tenKhoa
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Thành công',
                text: 'Thêm khoa thành công',
                icon: 'success'
            }).then(() => {
                closeAddFacultyPopup();
                loadFacultyList();
            });
        } else {
            throw new Error(data.message);
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Lỗi',
            text: error.message || 'Có lỗi xảy ra khi thêm khoa',
            icon: 'error'
        });
    });
}

// Thêm event listeners khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded'); // Debug log
    
    // Event listener cho form submit
    const addFacultyForm = document.getElementById('addFacultyForm');
    if (addFacultyForm) {
        console.log('Form found'); // Debug log
        addFacultyForm.addEventListener('submit', addFaculty);
    } else {
        console.error('Form not found');
    }
});

// Thêm event listener khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    const facultyListLink = document.querySelector('#show-faculty-list');
    if (facultyListLink) {
        facultyListLink.addEventListener('click', function(e) {
            e.preventDefault();
            showFacultyList();
        });
    }
});

// Hàm load danh sách khoa vào select
function loadFacultySelect() {
    fetch('api.php?action=getFaculties')
        .then(response => response.json())
        .then(result => {
            if (!result.success) {
                throw new Error(result.message || 'Không thể tải danh sách khoa');
            }

            const select = document.getElementById('facultyCode');
            select.innerHTML = '<option value="">Chọn khoa</option>';

            result.data.forEach(faculty => {
                const option = document.createElement('option');
                option.value = faculty.MaKhoa;
                option.textContent = `${faculty.MaKhoa} - ${faculty.TenKhoa}`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: error.message,
                icon: 'error'
            });
        });
}

// Hiển thị popup sửa khoa
function showEditFaculty() {
    const selectedRow = document.querySelector('#faculty-list tr.selected');
    if (!selectedRow) {
        Swal.fire({
            title: 'Thông báo',
            text: 'Vui lòng chọn khoa cần sửa',
            icon: 'warning'
        });
        return;
    }

    const facultyCode = selectedRow.cells[1].textContent;
    const facultyName = selectedRow.cells[2].textContent;

    document.getElementById('editFacultyCode').value = facultyCode;
    document.getElementById('editFacultyName').value = facultyName;

    document.getElementById('overlayEditFaculty').style.display = 'block';
    document.getElementById('editFacultyPopup').style.display = 'block';
}

// Đóng popup sửa khoa
function closeEditFacultyPopup() {
    document.getElementById('overlayEditFaculty').style.display = 'none';
    document.getElementById('editFacultyPopup').style.display = 'none';
    document.getElementById('editFacultyForm').reset();
}

// Sửa thông tin khoa
function editFaculty(event) {
    event.preventDefault();

    const data = {
        facultyCode: document.getElementById('editFacultyCode').value,
        facultyName: document.getElementById('editFacultyName').value
    };

    fetch('api.php?action=editFaculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                Swal.fire({
                    title: 'Thành công',
                    text: 'Cập nhật thông tin khoa thành công',
                    icon: 'success'
                }).then(() => {
                    closeEditFacultyPopup();
                    loadFacultyList();
                });
            } else {
                throw new Error(result.message);
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Lỗi',
                text: error.message,
                icon: 'error'
            });
        });
}

// Hiển thị popup xóa khoa
function showDeleteFacultyPopup() {
    const selectedRow = document.querySelector('#faculty-list tr.selected');
    if (!selectedRow) {
        Swal.fire({
            title: 'Thông báo',
            text: 'Vui lòng chọn khoa cần xóa',
            icon: 'warning'
        });
        return;
    }

    document.getElementById('deleteFacultyCode').value = selectedRow.cells[1].textContent;
    document.getElementById('overlayDeleteFaculty').style.display = 'block';
    document.getElementById('deleteFacultyPopup').style.display = 'block';
}

// Đóng popup xóa khoa
function closeDeleteFacultyPopup() {
    document.getElementById('overlayDeleteFaculty').style.display = 'none';
    document.getElementById('deleteFacultyPopup').style.display = 'none';
    document.getElementById('deleteFacultyForm').reset();
}

// Xóa khoa
function deleteFaculty(event) {
    event.preventDefault();

    const facultyCode = document.getElementById('deleteFacultyCode').value;

    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa khoa này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('api.php?action=deleteFaculty', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ facultyCode: facultyCode })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        Swal.fire({
                            title: 'Thành công',
                            text: 'Xóa khoa thành công',
                            icon: 'success'
                        }).then(() => {
                            closeDeleteFacultyPopup();
                            loadFacultyList();
                        });
                    } else {
                        throw new Error(result.message);
                    }
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Lỗi',
                        text: error.message,
                        icon: 'error'
                    });
                });
        }
    });
}

// Thêm sự kiện click cho các hàng trong bảng khoa
function addFacultyTableRowClickHandler() {
    const rows = document.querySelectorAll('#faculty-list tr');
    rows.forEach(row => {
        row.addEventListener('click', function() {
            // Bỏ chọn hàng cũ
            const selectedRow = document.querySelector('#faculty-list tr.selected');
            if (selectedRow) {
                selectedRow.classList.remove('selected');
            }
            // Chọn hàng mới
            this.classList.add('selected');
        });
    });
}

// Cập nhật hàm loadFacultyList để thêm click handler
function loadFacultyList() {
    fetch('api.php?action=getFaculties')
        .then(response => response.json())
        .then(result => {
            if (!result.success) {
                throw new Error(result.message || 'Không thể tải danh sách khoa');
            }

            const tbody = document.getElementById('faculty-list');
            tbody.innerHTML = '';

            result.data.forEach((faculty, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${faculty.MaKhoa}</td>
                    <td>${faculty.TenKhoa}</td>
                `;
                tbody.appendChild(row);
            });

            addFacultyTableRowClickHandler();
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: error.message,
                icon: 'error'
            });
        });
}
