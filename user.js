// Kiểm tra đăng nhập và khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUserInfo();
    loadDashboard();
    setupImageUpload();
    if (document.getElementById('courses').style.display !== 'none') {
        loadAvailableCourses();
    }
});

// Kiểm tra xác thực
async function checkAuth() {
    try {
        const response = await fetch('user.php?action=checkAuth');
        const data = await response.json();
        
        if (!data.success || data.role !== 'user') {
            window.location.href = 'Login.html';
        }
    } catch (error) {
        console.error('Auth error:', error);
        window.location.href = 'Login.html';
    }
}

// Hiển thị các section
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    // Cập nhật menu active
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');

    // Load dữ liệu tương ứng khi chuyển tab
    if (sectionId === 'profile') {
        loadUserInfo();
    } else if (sectionId === 'courses') {
        loadAvailableCourses();
    } else if (sectionId === 'registered') {
        loadRegisteredCourses();
    }
}

// Cập nhật thông tin cá nhân
async function updateProfile(event) {
    event.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        birthDate: document.getElementById('birthDate').value,
        studentId: document.getElementById('studentId').value,
        class: document.getElementById('class').value,
        faculty: document.getElementById('faculty').value
    };

    try {
        const response = await fetch('user.php?action=updateProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        if (data.success) {
            await Swal.fire({
                title: 'Thành công!',
                text: 'Cập nhật thông tin thành công',
                icon: 'success'
            });
            
            // Cập nhật hiển thị thông tin ngay lập tức
            loadUserInfo();

            // Disable tất cả các input fields
            const inputs = document.querySelectorAll('#profileForm input, #profileForm select');
            inputs.forEach(input => input.disabled = true);

            // Đổi nút "Cập nhật" thành "Sửa thông tin"
            const submitButton = document.querySelector('#profileForm button[type="submit"]');
            submitButton.textContent = 'Sửa thông tin';
            submitButton.onclick = enableEditMode;
            submitButton.type = 'button';

            // Hiển thị thông tin đã cập nhật
            const profileInfo = document.createElement('div');
            profileInfo.className = 'profile-info';
            profileInfo.innerHTML = `
                <h3>Thông tin đã cập nhật:</h3>
                <div class="info-item">
                    <label>Họ và tên:</label>
                    <span>${formData.fullName}</span>
                </div>
                <div class="info-item">
                    <label>Mã sinh viên:</label>
                    <span>${formData.studentId}</span>
                </div>
                <div class="info-item">
                    <label>Ngày sinh:</label>
                    <span>${new Date(formData.birthDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div class="info-item">
                    <label>Lớp:</label>
                    <span>${formData.class}</span>
                </div>
                <div class="info-item">
                    <label>Khoa:</label>
                    <span>${document.getElementById('faculty').options[document.getElementById('faculty').selectedIndex].text}</span>
                </div>
            `;

            // Chèn thông tin vào sau form
            const form = document.getElementById('profileForm');
            // Xóa thông tin cũ nếu có
            const oldInfo = form.nextElementSibling;
            if (oldInfo && oldInfo.className === 'profile-info') {
                oldInfo.remove();
            }
            form.parentNode.insertBefore(profileInfo, form.nextSibling);

            // Hiển thị trạng thái cập nhật
            const profileStatus = document.getElementById('profileStatus');
            profileStatus.style.display = 'flex';
            profileStatus.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Thông tin cá nhân đã được cập nhật thành công!</span>
            `;

        } else {
            throw new Error(data.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        }
    } catch (error) {
        console.error('Update error:', error);
        Swal.fire({
            title: 'Lỗi!',
            text: error.message,
            icon: 'error'
        });
    }
}

// Thêm hàm mới để bật chế độ chỉnh sửa
function enableEditMode() {
    // Enable tất cả các input fields
    const inputs = document.querySelectorAll('#profileForm input, #profileForm select');
    inputs.forEach(input => input.disabled = false);

    // Đổi nút "Sửa thông tin" thành "Cập nhật"
    const button = document.querySelector('#profileForm button');
    button.textContent = 'Cập nhật';
    button.onclick = null;
    button.type = 'submit';
}

// Load thông tin user
async function loadUserInfo() {
    try {
        await loadFaculties();
        
        const response = await fetch('user.php?action=getUserInfo');
        const data = await response.json();
        
        if (data.success) {
            // Cập nhật thông tin hiển thị trên sidebar
            document.getElementById('userName').textContent = data.data.fullName || 'Sinh viên';
            document.getElementById('userCode').textContent = data.data.studentId || '';
            
            // Điền thông tin vào form
            document.getElementById('fullName').value = data.data.fullName || '';
            document.getElementById('birthDate').value = data.data.birthDate || '';
            document.getElementById('studentId').value = data.data.studentId || '';
            document.getElementById('class').value = data.data.class || '';
            document.getElementById('faculty').value = data.data.faculty || '';

            // Luôn hiển thị thông tin dưới form
            const profileInfo = document.createElement('div');
            profileInfo.className = 'profile-info';
            profileInfo.innerHTML = `
                <h3>Thông tin sinh viên:</h3>
                <div class="info-item">
                    <label>Họ và tên:</label>
                    <span>${data.data.fullName || 'Chưa cập nhật'}</span>
                </div>
                <div class="info-item">
                    <label>Mã sinh viên:</label>
                    <span>${data.data.studentId || 'Chưa cập nhật'}</span>
                </div>
                <div class="info-item">
                    <label>Ngày sinh:</label>
                    <span>${data.data.birthDate ? new Date(data.data.birthDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
                </div>
                <div class="info-item">
                    <label>Lớp:</label>
                    <span>${data.data.class || 'Chưa cập nhật'}</span>
                </div>
                <div class="info-item">
                    <label>Khoa:</label>
                    <span>${data.data.facultyName || 'Chưa cập nhật'}</span>
                </div>
            `;

            // Chèn thông tin vào sau form
            const form = document.getElementById('profileForm');
            // Xóa thông tin cũ nếu có
            const oldInfo = form.nextElementSibling;
            if (oldInfo && oldInfo.className === 'profile-info') {
                oldInfo.remove();
            }
            form.parentNode.insertBefore(profileInfo, form.nextSibling);

            // Hiển thị trạng thái cập nhật nếu đã cập nhật
            const profileStatus = document.getElementById('profileStatus');
            if (data.data.is_profile_completed) {
                profileStatus.style.display = 'flex';
                profileStatus.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>Thông tin cá nhân đã được cập nhật</span>
                `;

                // Disable tất cả các input fields và đổi nút nếu đã có thông tin
                const inputs = document.querySelectorAll('#profileForm input, #profileForm select');
                inputs.forEach(input => input.disabled = true);

                const submitButton = document.querySelector('#profileForm button[type="submit"]');
                submitButton.textContent = 'Sửa thông tin';
                submitButton.onclick = enableEditMode;
                submitButton.type = 'button';
            } else {
                profileStatus.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error loading user info:', error);
        Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể tải thông tin người dùng',
            icon: 'error'
        });
    }
}

// Thêm hàm load danh sách khoa
async function loadFaculties() {
    try {
        const response = await fetch('user.php?action=getFaculties');
        const data = await response.json();
        
        if (data.success) {
            const facultySelect = document.getElementById('faculty');
            facultySelect.innerHTML = '<option value="">Chọn khoa</option>';
            
            data.faculties.forEach(faculty => {
                const option = document.createElement('option');
                option.value = faculty.MaKhoa;
                option.textContent = faculty.TenKhoa;
                facultySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading faculties:', error);
    }
}

// Đăng ký môn học
async function registerSelectedCourses() {
    const selectedCourses = Array.from(document.querySelectorAll('input[name="selectedCourses"]:checked:not([disabled])'))
        .map(checkbox => checkbox.value);

    if (selectedCourses.length === 0) {
        Swal.fire({
            title: 'Thông báo',
            text: 'Vui lòng chọn ít nhất một môn học',
            icon: 'warning'
        });
        return;
    }

    try {
        const response = await fetch('user.php?action=registerCourses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                courseIds: selectedCourses
            })
        });

        const data = await response.json();
        
        if (data.success) {
            await Swal.fire({
                title: 'Thành công!',
                text: 'Đăng ký môn học thành công',
                icon: 'success'
            });
            
            // Reload các thông tin cần thiết
            loadAvailableCourses();
            loadRegisteredCourses();
            loadDashboard();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Lỗi!',
            text: error.message,
            icon: 'error'
        });
    }
}

// Hủy đăng ký môn học
async function cancelRegistration(courseId) {
    try {
        const result = await Swal.fire({
            title: 'Xác nhận',
            text: 'Bạn có chắc chắn muốn hủy đăng ký môn học này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            const response = await fetch('user.php?action=cancelRegistration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    courseId: courseId
                })
            });

            const data = await response.json();
            
            if (data.success) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Hủy đăng ký thành công',
                    icon: 'success'
                }).then(() => {
                    loadAvailableCourses();
                    loadRegisteredCourses();
                    loadDashboard();
                });
            } else {
                throw new Error(data.message);
            }
        }
    } catch (error) {
        console.error('Cancellation error:', error);
        Swal.fire({
            title: 'Lỗi!',
            text: error.message || 'Có lỗi xảy ra khi hủy đăng ký',
            icon: 'error'
        });
    }
}

// Đăng xuất
function logout() {
    Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn đăng xuất?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('logout.php').then(() => {
                window.location.href = 'Login.html';
            });
        }
    });
}

// Load danh sách môn học có sẵn
async function loadAvailableCourses() {
    try {
        console.log('Loading available courses...'); // Debug log
        const response = await fetch('user.php?action=getAvailableCourses');
        const data = await response.json();
        console.log('Received data:', data); // Debug log
        
        if (data.success) {
            const tbody = document.querySelector('#availableCourses tbody');
            if (!tbody) {
                console.error('Table body not found!');
                return;
            }
            
            tbody.innerHTML = '';
            
            if (data.courses && data.courses.length > 0) {
                data.courses.forEach(course => {
                    const row = document.createElement('tr');
                    const isFull = parseInt(course.SoLuongDaDangKy) >= parseInt(course.SoLuongMax);
                    
                    row.innerHTML = `
                        <td>
                            <input type="checkbox" name="selectedCourses" value="${course.MaMH}"
                                ${course.DaDangKy ? 'checked disabled' : ''}
                                ${isFull && !course.DaDangKy ? 'disabled' : ''}>
                        </td>
                        <td>${course.MaMH}</td>
                        <td>${course.TenMH}</td>
                        <td>${course.SoTC}</td>
                        <td>${course.GiangVien}</td>
                        <td>
                            <span class="${isFull ? 'text-danger' : ''}">${course.SoLuongDaDangKy}/${course.SoLuongMax}</span>
                        </td>
                        <td>
                            ${course.DaDangKy ? '<span class="badge bg-success">Đã đăng ký</span>' : ''}
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">Không có môn học nào trong khoa của bạn</td></tr>';
            }
        } else {
            throw new Error(data.message || 'Không thể tải danh sách môn học');
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        Swal.fire({
            title: 'Lỗi!',
            text: error.message,
            icon: 'error'
        });
    }
}

// Load danh sách môn học đã đăng ký
async function loadRegisteredCourses() {
    try {
        const response = await fetch('user.php?action=getRegisteredCourses');
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.querySelector('#registeredCourses tbody');
            tbody.innerHTML = '';
            
            if (data.courses && data.courses.length > 0) {
                data.courses.forEach(course => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${course.MaMH}</td>
                        <td>${course.TenMH}</td>
                        <td>${course.SoTC}</td>
                        <td>${course.GiangVien}</td>
                        <td>${new Date(course.NgayDangKy).toLocaleDateString('vi-VN')}</td>
                        <td>
                            <button onclick="cancelRegistration('${course.MaMH}')" class="btn-danger">
                                <i class="fas fa-trash"></i> Hủy
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="6">Chưa đăng ký môn học nào</td></tr>';
            }
        } else {
            throw new Error(data.message || 'Không thể tải danh sách môn học đã đăng ký');
        }
    } catch (error) {
        console.error('Error loading registered courses:', error);
        Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể tải danh sách môn học đã đăng ký: ' + error.message,
            icon: 'error'
        });
    }
}

// Thêm hàm tìm kiếm môn học
function searchCourses() {
    const searchInput = document.getElementById('courseSearch');
    const searchText = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#availableCourses tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchText) ? '' : 'none';
    });
}

// Thêm event listener cho ô tìm kiếm
document.getElementById('courseSearch').addEventListener('input', searchCourses);

// Các hàm phụ trợ khác...
