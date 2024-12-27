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
}

function showStudentManagement() {
    // Hiển thị bảng và các nút quản lý
    const buttonContainer = document.querySelector('.button');
    const buttonFind = document.querySelector('.find');
    const studentTable = document.getElementById('student-table');

    buttonContainer.style.display = 'flex';
    buttonFind.style.display = 'none';
    studentTable.style.display = 'block';
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
document.addEventListener('DOMContentLoaded', function() {
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

    const studentCode = document.getElementById("code").value;
    const name = document.getElementById("name").value;
    const birthDay = document.getElementById("birthDay").value;
    const classs = document.getElementById("class").value;
    const fieldOfStudy = document.getElementById("fos").value;

    // Gửi yêu cầu chỉnh sửa sinh viên
    fetch('editStudent.php', {
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
            if (res.success) {
                setTimeout(() => {
                    resetForm('editStudentForm');
                    closeEditPopup();
                    loadStudents();
                    window.location.href = 'Home.html'; // Quay về trang chủ sau khi chỉnh sửa
                }, 1000);
            } else {
                showPopupAlert(res.message, 'error'); // Hiển thị thông báo lỗi nếu có
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showPopupAlert('Lỗi khi chỉnh sửa sinh viên!', 'error');
        });
}
