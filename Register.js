// Hiển thị hoặc ẩn mật khẩu
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
}

// Xử lý sự kiện khi nhấn nút Đăng ký
document.getElementById('registrationForm').addEventListener('submit', function () {
    const username = document.getElementById('input_acc').value.trim();
    const password = document.getElementById('input_pass').value.trim();
    const confirmPassword = document.getElementById('input_agPass').value.trim();

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
        alert("Mật khẩu không khớp. Vui lòng kiểm tra lại!");
        return;
    }

    // Lưu thông tin vào localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    alert("Đăng ký thành công!");

    // Chuyển hướng đến trang đăng nhập
    window.location.href = "Login.html";
});