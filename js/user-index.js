document.addEventListener("DOMContentLoaded", () => {
  // ====== Biến chung ======
  const authContainer = document.querySelector(".auth-container");
  const userMenu = document.getElementById("userMenu");
  const trangChu = document.getElementById("trangchu");
  const accountSection = document.getElementById("accountSection");
  const ordersSection = document.getElementById("ordersSection");
  const menuNav = document.getElementById("menuNav");
  const onetwo = document.getElementById("onetwo");
  


  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // ====== Nếu người dùng đã đăng nhập ======
  if (loggedIn && currentUser) {
    authContainer.innerHTML = `
      <span class="text-tk">Xin chào,</span>
      <span class="text-tk">${currentUser.fullname || currentUser.username}
        <i class="fa-sharp fa-solid fa-caret-down"></i></span>
    `;

    userMenu.innerHTML = `
      <li class="user-info" id="myAccount">
        <i class="fa-solid fa-user"></i><span>Tài khoản của tôi</span>
      </li>
      <li class="user-info" id="myOrders">
        <i class="fa fa-shopping-bag"></i><span>Đơn hàng đã mua</span>
      </li>
      <li class="logoutBtn">
        <a href="javascript:;" id="logoutBtn">
          <i class="fa fa-sign-out-alt"></i><span>Đăng xuất</span>
        </a>
      </li>
    `;
  } else {
    // Nếu chưa đăng nhập → hiển thị nút đăng nhập / đăng ký
    const loginBtn = document.getElementById("login");
    const signupBtn = document.getElementById("signup");
    if (loginBtn) loginBtn.addEventListener("click", () => window.location.href = "../Home/login.html");
    if (signupBtn) signupBtn.addEventListener("click", () => window.location.href = "../Home/login.html");
  }

  // ====== Hàm ẩn tất cả phần ======
  function hideAllSections() {
    if (trangChu) trangChu.style.display = "none";
    if (accountSection) accountSection.style.display = "none";
    if (ordersSection) ordersSection.style.display = "none";
    if (menuNav) menuNav.style.display = "none"; 
     if (onetwo) onetwo.style.display = "none";
  }

  // ====== Xử lý Tài khoản của tôi ======
  const myAccount = document.getElementById("myAccount");
  if (myAccount) {
    myAccount.addEventListener("click", () => {
      hideAllSections();
      if (accountSection) accountSection.style.display = "block";

      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user) return;
      document.getElementById("infoname").value = user.fullname || user.username || "";
      document.getElementById("infophone").value = user.phone || "";
      document.getElementById("infoemail").value = user.email || "";
      document.getElementById("infoaddress").value = user.address || "";
    });
  }

  // ====== Xử lý Đơn hàng đã mua ======
  const myOrders = document.getElementById("myOrders");
  if (myOrders) {
    myOrders.addEventListener("click", showUserOrders);
  }

  // ====== Xử lý đăng xuất ======
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("currentUser");
      alert("Đã đăng xuất!");
      window.location.href = "../Home/login.html";
    });
  }

  // ====== Tự động điền thông tin người dùng ======
  if (currentUser) {
    document.getElementById("infoname").value = currentUser.fullname || currentUser.username || "";
    document.getElementById("infophone").value = currentUser.phone || "";
    document.getElementById("infoemail").value = currentUser.email || "";
    document.getElementById("infoaddress").value = currentUser.address || "";
  }
});

// CẬP NHẬT THÔNG TIN TÀI KHOẢN
function changeInformation() {
  let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return alert("Không tìm thấy người dùng!");

  const name = document.getElementById("infoname").value.trim();
  const phone = document.getElementById("infophone").value.trim();
  const email = document.getElementById("infoemail").value.trim();
  const address = document.getElementById("infoaddress").value.trim();

  if (!phone.match(/^\d{9,11}$/)) return alert("Số điện thoại không hợp lệ!");

  const oldPhone = currentUser.phone;
  currentUser.fullname = name;
  currentUser.phone = phone;
  currentUser.email = email;
  currentUser.address = address;

  const idx = accounts.findIndex(a => a.phone === oldPhone);
  if (idx !== -1) accounts[idx] = currentUser;

  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  alert("✅ Cập nhật thông tin thành công!");
}

// ĐỔI MẬT KHẨU
function changePassword() {
  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return alert("Không tìm thấy tài khoản!");

  const cur = document.getElementById("password-cur-info").value.trim();
  const newpw = document.getElementById("password-after-info").value.trim();
  const confirm = document.getElementById("password-comfirm-info").value.trim();

  if (!cur || !newpw || !confirm) return alert("Vui lòng nhập đầy đủ mật khẩu!");
  if (cur !== currentUser.password) return alert("❌ Mật khẩu hiện tại không đúng!");
  if (newpw.length < 6) return alert("Mật khẩu mới phải ít nhất 6 ký tự!");
  if (newpw !== confirm) return alert("Mật khẩu xác nhận không khớp!");

  currentUser.password = newpw;
  const idx = accounts.findIndex(a => a.phone === currentUser.phone);
  if (idx !== -1) accounts[idx] = currentUser;

  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("accounts", JSON.stringify(accounts));
  alert("✅ Đổi mật khẩu thành công!");

  document.getElementById("password-cur-info").value = "";
  document.getElementById("password-after-info").value = "";
  document.getElementById("password-comfirm-info").value = "";
}

// HIỂN THỊ ĐƠN HÀNG NGƯỜI DÙNG
function showUserOrders() {
  const ordersSection = document.getElementById("ordersSection");
  const trangChu = document.getElementById("trangchu");
  const accountSection = document.getElementById("accountSection");
  const orderList = document.getElementById("orderList");
  const menuNav = document.getElementById("menuNav");
  const onetwo = document.getElementById("onetwo");

  trangChu.style.display = "none";
  accountSection.style.display = "none";
  ordersSection.style.display = "block";
  menuNav.style.display= "none";
  onetwo.style.display="none"

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
}

