function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng nhập đầy đủ thông tin',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const checkUsername = localStorage.getItem('username');
    const checkPassword = localStorage.getItem('password');

    if (username === checkUsername && password === checkPassword) {
        Swal.fire({
            title: 'Thành công',
            text: 'Đăng nhập thành công',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('input_acc').value = "";
                document.getElementById('input_pass').value = "";
                window.location.href = 'Home.html';
            }
        });
    } else {
        Swal.fire({
            title: 'Lỗi',
            text: 'Tài khoản hoặc mật khẩu không đúng',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});