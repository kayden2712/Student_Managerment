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

function addStudent() {
    alert('Thêm sinh viên mới!');
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

