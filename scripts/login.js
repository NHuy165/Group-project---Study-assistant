
function kiemTraDangNhap() {
    var ten = document.getElementById('ten-be').value;
    var matKhau = document.getElementById('mat-khau').value;
    var loiNhan = document.getElementById('thong-bao-loi');

    if (ten === "" || matKhau === "") {
        loiNhan.innerText = "Bé quên nhập thông tin rồi!";
        loiNhan.style.display = "block";
        loiNhan.style.color = "red";

    }
    // Giả sử mật khẩu đúng là 123 
    else if (matKhau !== "123") {
        loiNhan.innerText = "Mật khẩu không đúng!";
        loiNhan.style.display = "block";
        loiNhan.style.color = "red";
    }
    else {
        localStorage.setItem("tenBe", ten);
        loiNhan.style.display = "none";
        window.location.href = "hoc-tap.html";
    }

}