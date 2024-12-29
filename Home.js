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
    // Thay đổi tiêu đề
    document.getElementById('header2').textContent = 'Danh Sách Sinh Viên';

    // Hiển thị phần quản lý sinh viên
    document.getElementById('student-table').style.display = 'block';
    document.querySelector('.button').style.display = 'flex';
    document.getElementById('Find').style.display = 'none';

    // Ẩn các phần quản lý tín chỉ
    document.getElementById('credit-registration-table').style.display = 'none';
    document.getElementById('registered-courses-table').style.display = 'none';
}

// Hàm hiển thị đăng ký tín chỉ
function showCreditRegistration() {
    // Thay đổi tiêu đề
    document.getElementById('header2').textContent = 'Đăng Ký Tín Chỉ';

    // Ẩn phần quản lý sinh viên
    document.getElementById('student-table').style.display = 'none';
    document.querySelector('.button').style.display = 'none';
    document.getElementById('Find').style.display = 'none';

    // Hiển thị bảng đăng ký tín chỉ
    document.getElementById('credit-registration-table').style.display = 'block';
    document.getElementById('registered-courses-table').style.display = 'none';

    // Load danh sách môn học
    loadCourses();
}

// Hàm hiển thị môn học đã đăng ký
function showRegisteredCourses() {
    // Thay đổi tiêu đề
    document.getElementById('header2').textContent = 'Môn Học Đã Đăng Ký';

    // Ẩn phần quản lý sinh viên
    document.getElementById('student-table').style.display = 'none';
    document.querySelector('.button').style.display = 'none';
    document.getElementById('Find').style.display = 'none';

    // Ẩn bảng đăng ký tín chỉ và hiển thị bảng môn học đã đăng ký
    document.getElementById('credit-registration-table').style.display = 'none';
    document.getElementById('registered-courses-table').style.display = 'block';

    // Load danh sách môn học đã đăng ký
    loadRegisteredCourses();
}

// Hàm hủy đăng ký và quay lại màn hình danh sách sinh viên
function cancelRegistration() {
    showStudentManagement();
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

    fetch('addStudent.php', {
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
                    loadStudents(); // Tải lại danh sách sinh viên
                    window.location.href = 'Home.html'; // Quay về trang chủ
                }, 1000);
            }
        })
        .catch(error => {
            console.log("Error: ", error);
            swal({
                title: "Thông báo!",
                text: "Lỗi tải trang!",
                icon: "error",
                button: "Ok",
            });
        });
}

// Hàm hiển thị sinh viên
function loadStudents() {
    const tableStudents = document.getElementById("student-list");

    fetch("getStudents.php")
        .then(response => response.json())
        .then(result => {
            if (!result.success) {
                throw new Error(result.message);
            }

            const students = result.data;
            tableStudents.innerHTML = "";

            if (students.length === 0) {
                tableStudents.innerHTML = "<tr><td colspan='6'>Không có sinh viên nào</td></tr>";
            } else {
                students.forEach((student, index) => {
                    let row = `
                        <tr>
                            <td style="text-align: center;">${index + 1}</td>
                            <td style="text-align: center;">${student.MaSV}</td>
                            <td>${student.HoTen}</td>
                            <td style="text-align: center;">${student.NgaySinh}</td>
                            <td style="text-align: center;">${student.Lop}</td>
                            <td style="text-align: center;">${student.Khoa}</td>
                        </tr>`;
                    tableStudents.innerHTML += row;
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            tableStudents.innerHTML = "<tr><td colspan='6'>Lỗi khi tải dữ liệu</td></tr>";
        });
}

// Tải danh sách sinh viên khi trang được load
window.onload = loadStudents;

function deleteStudent(event) {
    event.preventDefault();
    const studentId = document.getElementById('deleteStudentForm').querySelector('#code').value;
    closeDeletePopup();
    // Chờ người dùng xác nhận xóa
    Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa?',
        text: 'Bạn sẽ không thể hoàn tác hành động này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không',
    }).then((result) => {
        if (result.isConfirmed) {
            // Gửi yêu cầu xóa sinh viên nếu người dùng nhấn "Có"
            fetch("deleteStudent.php", {
                method: "POST",
                body: JSON.stringify({ studentId }),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    alert(result.message);
                    if (result.success) {
                        resetForm('deleteStudentForm'); // Reset form xóa
                        loadStudents(); // Tải lại danh sách sinh viên
                        window.location.href = 'Home.html'; // Quay về trang chủ
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    swal({
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

    if (!keyword) {
        loadStudents(); // Load lại danh sách khi ô tìm kiếm trống
        return;
    }

    fetch(`searchStudent.php?keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(students => {
            const tableBody = document.getElementById('student-list');
            tableBody.innerHTML = '';

            if (students.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Không tìm thấy sinh viên nào</td></tr>';
                return;
            }

            students.forEach((student, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="text-align: center;">${index + 1}</td>
                    <td style="text-align: center;">${student.MaSV}</td>
                    <td>${student.HoTen}</td>
                    <td style="text-align: center;">${student.NgaySinh}</td>
                    <td style="text-align: center;">${student.Lop}</td>
                    <td style="text-align: center;">${student.Khoa}</td>
                `;
                row.onclick = () => selectRow(row);
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            alert('Có lỗi xảy ra khi tìm kiếm!');
        });
}

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

    // Kiểm tra dữ liệu đầu vào
    if (!data.code || !data.name || !data.birthDay || !data.classs || !data.fos) {
        Swal.fire({
            title: 'Lỗi!',
            text: 'Vui lòng điền đầy đủ thông tin',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Gửi yêu cầu chỉnh sửa sinh viên
    fetch('editStudent.php', {
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
                text: res.message || 'Có lỗi xảy ra khi chỉnh sửa!',
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

// Thêm hàm xử lý hiển thị bảng đăng ký tín chỉ
function showCreditRegistration() {
    const findStudent = document.getElementById('Find');
    const tableRegistered = document.getElementById('registered-courses-table');
    // Ẩn bảng sinh viên nếu đang hiển thị
    const studentTable = document.getElementById('student-table');
    if (studentTable) {
        studentTable.style.display = 'none';
        tableRegistered.style.display = 'none';
        findStudent.style.display = "none";
    }
    document.getElementById('header2').textContent = 'Đăng ký tín chỉ';
    // Ẩn các button quản lý sinh viên
    const buttonContainer = document.querySelector('.button');
    if (buttonContainer) {
        buttonContainer.style.display = 'none';
    }

    // Tạo và hiển thị bảng đăng ký tín chỉ
    const mainContent = document.querySelector('.sidebar-main');


    // Kiểm tra nếu bảng đã tồn tại thì hiển thị, nếu chưa thì tạo mới
    let creditTable = document.getElementById('credit-registration-table');
    if (!creditTable) {
        creditTable = document.createElement('section');
        creditTable.id = 'credit-registration-table';
        creditTable.className = 'table';
        creditTable.innerHTML = `
            <h2>Đăng Ký Tín Chỉ</h2>
            <hr>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã môn học</th>
                        <th>Tên môn học</th>
                        <th>Số tín chỉ</th>
                        <th>Giảng viên</th>
                        <th>Đăng ký</th>
                    </tr>
                </thead>
                <tbody id="credit-list">
                    <!-- Dữ liệu môn học sẽ được thêm vào đây -->
                </tbody>
            </table>
        `;
        mainContent.appendChild(creditTable);
    } else {
        creditTable.style.display = 'block';
    }

    // Giả lập dữ liệu môn học (sau này sẽ lấy từ database)
    const subjects = [
        { id: 1, code: 'INT1234', name: 'Lập trình Web', credits: 3, lecturer: 'Nguyễn Văn A' },
        { id: 2, code: 'INT1235', name: 'Cơ sở dữ liệu', credits: 4, lecturer: 'Trần Thị B' },
        { id: 3, code: 'INT1236', name: 'Lập trình Java', credits: 3, lecturer: 'Lê Văn C' }
    ];

    // Hiển thị dữ liệu vào bảng
    const creditList = document.getElementById('credit-list');
    creditList.innerHTML = subjects.map((subject, index) => `
        <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td style="text-align: center;">${subject.code}</td>
            <td>${subject.name}</td>
            <td style="text-align: center;">${subject.credits}</td>
            <td style="text-align: center;">${subject.lecturer}</td>
            <td style="text-align: center;">
                <input type="checkbox" class="register-checkbox" data-subject-id="${subject.id}">
            </td>
        </tr>
    `).join('');
}

// Thêm event listener cho link đăng ký tín chỉ
document.addEventListener('DOMContentLoaded', function () {
    const creditRegistrationLink = document.querySelector('a[href="#"]');
    if (creditRegistrationLink && creditRegistrationLink.textContent === 'Đăng ký tín chỉ') {
        creditRegistrationLink.addEventListener('click', function (e) {
            e.preventDefault();
            showCreditRegistration();
        });
    }
});

// Thêm hàm xử lý đăng ký
function submitRegistration() {
    const selectedSubjects = document.querySelectorAll('.register-checkbox:checked:not([disabled])');
    if (selectedSubjects.length === 0) {
        Swal.fire({
            title: 'Thông báo',
            text: 'Vui lòng chọn ít nhất một môn học!',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }
}

// Thêm hàm hủy đăng ký
function cancelRegistration() {
    // Hiển thị lại bảng sinh viên
    const studentTable = document.getElementById('student-table');
    const creditTable = document.getElementById('credit-registration-table');
    const buttonContainer = document.querySelector('.button');

    if (studentTable) studentTable.style.display = 'block';
    if (creditTable) creditTable.style.display = 'none';
    if (buttonContainer) buttonContainer.style.display = 'flex';
    window.location.href = 'Home.html';
}

// Trong hàm showCreditRegistration()
function showRegisteredCourses() {
    // Ẩn các bảng khác
    document.getElementById('student-table').style.display = 'none';
    document.getElementById('credit-registration-table').style.display = 'none';
    document.querySelector('.button').style.display = 'none';
    document.getElementById('Find').style.display = 'none';

    // Hiển thị bảng môn học đã đăng ký
    const registeredTable = document.getElementById('registered-courses-table');
    registeredTable.style.display = 'block';

    // Thay đổi tiêu đề
    document.getElementById('header2').textContent = 'Danh sách tín chỉ đã đăng ký';


}


// Hàm format ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Hàm lấy text trạng thái
function getStatusText(status) {
    return status === 1 ?
        '<span class="status-active">Đã đăng ký</span>' :
        '<span class="status-inactive">Đã hủy</span>';
}

// Hàm hiển thị danh sách tín chỉ
function showCourseList() {
    // Thay đổi tiêu đề
    document.getElementById('header2').textContent = 'Danh Sách Tín Chỉ';

    // Ẩn tất cả các phần khác
    hideAllSections();

    // Hiển thị bảng danh sách tín chỉ
    document.getElementById('course-list-table').style.display = 'block';

    // Load danh sách tín chỉ
    loadCourseList();
}

// Hàm ẩn tất cả các section
function hideAllSections() {
    const sections = [
        'student-table',
        'credit-registration-table',
        'registered-courses-table',
        'course-list-table',
        'Find'
    ];

    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Ẩn nút
    const buttonContainer = document.querySelector('.button');
    if (buttonContainer) {
        buttonContainer.style.display = 'none';
    }
}

// Hàm load danh sách tín chỉ
function loadCourseList() {
    showLoadingSpinner();

    fetch('getCourseList.php')
        .then(response => response.json())
        .then(result => {
            hideLoadingSpinner();

            if (!result.success) {
                throw new Error(result.message);
            }

            const courseList = document.getElementById('course-list');
            if (!courseList) return;

            courseList.innerHTML = result.data.map((course, index) => `
                <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td style="text-align: center;">${course.MaMH}</td>
                    <td>${course.TenMH}</td>
                    <td style="text-align: center;">${course.SoTC}</td>
                    <td style="text-align: center;">${course.GiangVien}</td>
                    <td style="text-align: center;">${course.SoLuongDaDangKy}/${course.SoLuongMax}</td>
                </tr>
            `).join('');
        })
        .catch(error => {
            hideLoadingSpinner();
            Swal.fire({
                title: 'Lỗi!',
                text: error.message || 'Không thể tải danh sách môn học',
                icon: 'error'
            });
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
});