

/* HÀM 1: Bấm sổ menu (cần 'window' vì gọi = onclick) */
window.toggleSubmenu = function (linkElement, submenuId) {
  const submenu = document.getElementById(submenuId);
  if (!submenu) return; // Thoát nếu không tìm thấy submenu
  linkElement.classList.toggle("active");
  // Ẩn/hiện submenu
  if (submenu.style.display === "block") {
    submenu.style.display = "none";
  } else {
    submenu.style.display = "block";
  }
};

