document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  if (!form) return console.error('Không tìm thấy form đăng nhập!');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('loginUserName').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

  
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = '1234';

    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      alert('Đăng nhập admin thành công!');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminUser', JSON.stringify({ username }));
      // Chuyển sang trang quản lý admin
      window.location.href = './pages/manager-user.html';
    } else {
      alert('Sai tài khoản hoặc mật khẩu admin!');
    }
  });
});
