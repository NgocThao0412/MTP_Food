// Hàm bật/tắt menu cho giao diện mobile
function toggleMenu(hamburger) {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active'); // Bật/tắt hiển thị menu

    // Đổi trạng thái "active" cho cả hai biểu tượng hamburger
    document.querySelectorAll('.hamburger').forEach(icon => {
        icon.classList.toggle('active');
    });
}

// Hàm xử lý khi nhấn vào nút tìm kiếm (chưa thêm logic)
function myFunction() {
    const input = document.getElementById('search');
    // Nơi bạn thêm chức năng tìm kiếm
}

// Khi click vào logo → trở về trang chủ
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '../index.html';
    });
}



/* --- XỬ LÝ FORM ĐĂNG NHẬP / ĐĂNG KÝ --- */
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelectorAll('.btnLogin-popup');   // Nút mở form đăng nhập
const btnOutPopup = document.querySelectorAll('.btnLogout-popup'); // Nút mở form đăng ký
let isRegisterForm = false; // Biến theo dõi form đang hiển thị (login hay register)


// Mở form đăng nhập
btnPopup.forEach(btn => {
    btn.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
        wrapper.classList.remove('active');
        isRegisterForm = false;
    });
});

// Mở form đăng ký
btnOutPopup.forEach(btn => {
    btn.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
        wrapper.classList.add('active');
        isRegisterForm = true;
    });
});


/* --- DỮ LIỆU TRANG CHÍNH (HOME) --- */
document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const loginForm = document.querySelector(".form-box.login");
    const registerForm = document.querySelector(".form-box.register");
    let isRegisterForm = false;
    
    // Khi truy cập URL có "#register" → hiển thị form đăng ký
    if (window.location.hash === "#register") {
        wrapper.classList.add("active");
    }

    // Chuyển qua form đăng ký
    registerLink.addEventListener("click", (e) => {
        e.preventDefault();
        wrapper.classList.add("active");
    });

    // Chuyển lại form đăng nhập
    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        wrapper.classList.remove("active");
    });


    /* --- XỬ LÝ NGƯỜI DÙNG LOCAL STORAGE --- */

    // Lấy danh sách người dùng đã lưu trong localStorage
    function getStoredUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Lưu danh sách người dùng vào localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Lưu thông tin người dùng hiện tại sau khi đăng nhập
    function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}


    // Tạo sẵn 1 user mẫu “Client”
    function initializeUsers() {
        let users = getStoredUsers();

        if (!users.find(user => user.email === 'client@gmail.com')) {
            users.push({ 
                username: 'Client', 
                email: 'client@gmail.com', 
                password: '123', 
                phone: '0812345678', 
                address: '273 Đ. An Dương Vương, Phường 3, Quận 5, Hồ Chí Minh' ,
            });
        }

        saveUsers(users);
    }

    initializeUsers(); // Gọi hàm khởi tạo

       /* --- FORM ĐĂNG NHẬP --- */
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const userName = document.getElementById('loginUserName').value;
        const password = document.getElementById('loginPassword').value;

        const users = getStoredUsers();
        const user = users.find(user => user.username === userName && user.password === password );
        
        if (user) {
            alert('Đăng nhập thành công!');
            setCurrentUser(user);
            localStorage.setItem("loggedIn", "true");
            window.location.href = '../Client/user-index.html';
        } else {
            alert('Sai tên đăng nhập hoặc mật khẩu!');
        }
    });


const registerFormEl = document.getElementById('registerForm');
console.log('Register form:', registerFormEl); // <-- Thêm dòng này

    // ✅ FORM ĐĂNG KÝ — CHỈ CẦN NÀY LÀ ĐỦ
if (registerFormEl) {
  registerFormEl.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');
    const confirmPassword = confirmPasswordInput.value;
    const phone = document.getElementById('registerPhone').value.trim();
    const address = document.getElementById('registerAddress').value.trim();
    const termsCheckbox = document.getElementById('termsCheckbox');
    const checkboxError = document.querySelector('.form-message-checkbox');
    const passwordError = document.querySelector('.form-message-password');
    const regex = /[\s\u00C0-\u1EF9]/;
    const users = getStoredUsers();

    if (!termsCheckbox.checked) {
      checkboxError.innerHTML = 'Vui lòng đồng ý với điều khoản trước khi đăng ký!';
      return;
    } else {
      checkboxError.innerHTML = '';
    }

    if (users.find(u => u.email === email || u.username === username)) {
      alert('Email hoặc tên đăng nhập đã tồn tại!');
      return;
    }

    if (phone.length !== 10) {
      alert('Số điện thoại phải có 10 chữ số!');
      return;
    }

    if (regex.test(username)) {
      alert('Tên đăng nhập không được chứa ký tự có dấu hoặc khoảng trắng!');
      return;
    }

    if (password !== confirmPassword) {
      passwordError.innerHTML = 'Mật khẩu xác nhận không khớp!';
      confirmPasswordInput.classList.add('error');
      return;
    } else {
      passwordError.innerHTML = '';
      confirmPasswordInput.classList.remove('error');
    }

    // ✅ Lưu user mới
    users.push({ username, email, password, phone, address, role: 'client' });
    saveUsers(users);

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify({ username, email }));

    alert('Đăng ký thành công!');
    setTimeout(() => {
      window.location.href = '../Client/user-index.html';
    }, 200);
  });
}


    /* --- LẤY NGƯỜI DÙNG ĐANG ĐĂNG NHẬP --- */
    function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}
    // Kiểm tra trạng thái đăng nhập

    function isLoggedIn() {
        return !!getCurrentUser(); // Trả về true nếu đã đăng nhập
    }

    /* --- XỬ LÝ GIỎ HÀNG (nếu chưa login thì bật form đăng nhập) --- */
    const cartBtn = document.querySelectorAll('.sp-cart');
    if (cartBtn.length > 0) {
        cartBtn.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                
                if (!isLoggedIn()) {
                    // alert('Vui lòng đăng nhập để xem giỏ hàng!');
                } else {
                    console.log('Đang mở giỏ hàng...');
                }
            });
        });
    }


   
});
  