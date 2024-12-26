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

// Hiển thị popup
function showPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('addStudentPopup').style.display = 'block';
}

// Đóng popup
function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('addStudentPopup').style.display = 'none';
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

function editStudent() {
    alert('Chỉnh sửa thông tin sinh viên!');
}

function deleteStudent() {
    alert('Xóa sinh viên đã chọn!');
}

function searchStudent() {
    const searchValue = document.getElementById('textSearch').value;
    alert(`Tìm kiếm sinh viên với từ khóa: ${searchValue}`);
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

// Hàm hiển thị sinh viên
function loadStudents() {
    const tableStudents = document.getElementById("student-list");

    fetch("getStudents.php")
        .then(response => response.json())
        .then(students => {
            tableStudents.innerHTML = "";
            if (students.length === 0) {
                tableStudents.innerHTML = "<tr><td colspan='6'>Không có sinh viên nào</td></tr>"
            } else {
                for (let i = 0; i < students.length; i++) {
                    let row =
                        `<tr>
                            <td>${students[i].studentId}</td>
                            <td>${students[i].fullName}</td>
                            <td>${students[i].birthDate}</td>
                            <td>${students[i].className}</td>
                            <td>${students[i].major}</td>
                         </tr>`
                    tableStudents.innerHTML += row;
                }
            }
        })
        .catch(() => {
            Swal.fire({
                title: "Thông báo",
                text: "Error",
                icon: "error",
                confirmButtonText: "OK",
            });
        })
}

window.onload = loadStudents;

// Hàm thêm sinh viên
function addStudent(event) {
    event.preventDefault();

    const studentCode = document.getElementById("code").value;
    const name = document.getElementById("name").value;
    const birthDay = document.getElementById("birthDay").value;
    const classs = document.getElementById("classs").value;
    const fieldOfStudy = document.getElementById("fos").value;

    fetch('add.php', {
        method: "POST",
        body: JSON.stringify({
            code: studentCode,
            name: name,
            birthDay: birthDay,
            classs: classs,
            fos: fieldOfStudy
        }),
        headers: {'Content-Type': 'application/json'}
    })
        .then(respone => respone.json())
        .then(res => {
            alert(res.message);
            if (res.success) {
                document.getElementById("addStudentForm").reset();
                closePopup();
                loadStudents();
            }
        })
        .catch(() => {
            Swal.fire({
                title: "Thông báo",
                text: "Error",
                icon: "error",
                confirmButtonText: "OK",
            });
        })
}