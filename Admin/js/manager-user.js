// --- CÁC HÀM CỦA SIDEBAR VÀ MENU ---
function toggleMenu(hamburger) {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("active");
  document.querySelectorAll(".hamburger").forEach((icon) => {
    icon.classList.toggle("active");
  });
}

function setupSidebarActiveState() {
  const currentPage = window.location.pathname.split("/").pop();
  if (!currentPage) return;

  document.querySelectorAll(".sidebar-list-item.tab-content").forEach((item) => {
    item.classList.remove("active");
  });

  const allLinks = document.querySelectorAll(".sidebar-link");

  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (!linkHref) return;
    
    const linkPage = linkHref.split("/").pop();

    if (linkPage === currentPage) {
      const submenu = link.closest(".submenu");
      if (submenu) {
        submenu.style.display = "block";
        const parentLi = submenu.closest(".sidebar-list-item.tab-content");
        if (parentLi) {
          parentLi.classList.add("active");
          const parentLink = parentLi.querySelector(".sidebar-link");
          if (parentLink) {
            parentLink.classList.add("active");
          }
        }
      } else {
        const parentLi = link.closest(".sidebar-list-item.tab-content");
        if (parentLi) {
          parentLi.classList.add("active");
        }
      }
    }
  });
}

window.toggleSubmenu = function (linkElement, submenuId) {
  const submenu = document.getElementById(submenuId);
  if (!submenu) return;
  linkElement.classList.toggle("active");
  if (submenu.style.display === "block") {
    submenu.style.display = "none";
  } else {
    submenu.style.display = "block";
  }
};

function toggleGrade(contentId, chevronId) {
  var chevron = document.querySelectorAll("#" + chevronId);
  var content = document.querySelectorAll("#" + contentId);

  chevron.forEach((btn) => {
    btn.classList.toggle("up");
    btn.classList.toggle("down");
  });

  content.forEach((btn) => {
    if (btn.style.display === "none") {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  });
}
// --- KẾT THÚC HÀM SIDEBAR ---




