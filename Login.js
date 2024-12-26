// Hien thi mat khau
document.getElementById("show-pass1").addEventListener("change", function () {
    const passwordInput = document.getElementById("password");
    passwordInput.type = this.checked ? "text" : "password";
});

// Tai khoan admin
const adminAccount = {
    username: "Admin", password: "1"
};

function login(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");
    if(username === adminAccount.username && password === adminAccount.password){
        alert("Welcome Admin");
        window.location.href = "Home.html";
    }
    else{
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        error.textContent = "Tài khoản hoặc mật khẩu của bạn không chính xác";
    }
}

