function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = passwordInput.nextElementSibling;

    if (toggleIcon && (toggleIcon.classList.contains('fa-eye') || toggleIcon.classList.contains('fa-eye-slash'))) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        }
    } else {
        console.error('Biểu tượng mắt không tồn tại hoặc cấu trúc HTML không đúng.');
    }
}

document.getElementById('regisForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const username = document.getElementById('input_acc').value.trim();
    const password = document.getElementById('input_pass').value.trim();
    const confirmPassword = document.getElementById('input_agPass').value.trim();

    // Kiểm tra xem các trường đã được nhập đầy đủ chưa
    if (!username || !password || !confirmPassword) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng điền đầy đủ thông tin',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Kiểm tra trùng tên đăng nhập
    const existingUsername = localStorage.getItem('username');
    if (username === existingUsername) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Tên đăng nhập đã tồn tại',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Mật khẩu không khớp',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    Swal.fire({
        title: 'Thành công',
        text: 'Đăng ký thành công',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('input_acc').value = "";
            document.getElementById('input_pass').value = "";
            document.getElementById('input_agPass').value = "";
            
            window.location.href = 'Login.html';
        }
    });
});
