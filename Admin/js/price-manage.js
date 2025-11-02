
const products = [
  { id: "SP01", name: "Gạo ST25", cost: 15000, profit: 20 },
  { id: "SP02", name: "Dầu ăn Tường An", cost: 35000, profit: 15 },
  { id: "SP03", name: "Đường cát trắng", cost: 18000, profit: 25 },
];

// Tính giá bán (hàm thuần túy, có thể để global)
function calcPrice(cost, profit) {
  return cost + (cost * profit) / 100;
}

// ===================================
// Logic cho Sidebar (Global)
// ===================================

/**
 * HÀM 1: Bấm sổ menu (cần 'window' vì gọi = onclick)
 */
window.toggleSubmenu = function (linkElement, submenuId) {
  const submenu = document.getElementById(submenuId);
  if (!submenu) return; // Thoát nếu không tìm thấy submenu

  // Thêm/xóa class 'active' trên <a> (để xoay mũi tên)
  linkElement.classList.toggle("active");

  // Ẩn/hiện submenu
  if (submenu.style.display === "block") {
    submenu.style.display = "none";
  } else {
    submenu.style.display = "block";
  }
};

/**
 * HÀM 2: Tự động active menu (sẽ được gọi khi DOM tải xong)
 * (Mình đã sửa lại lỗi vòng lặp bị lồng nhau sai ở code cũ của bạn)
 */
function setupSidebarActiveState() {
  const currentPage = window.location.pathname.split("/").pop();
  if (!currentPage) return;

  // Bước 1: Xóa 'active' khỏi TẤT CẢ các mục chính trước
  document.querySelectorAll(".sidebar-list-item.tab-content").forEach((item) => {
    item.classList.remove("active");
  });

  // Bước 2: Tìm link chính xác và thêm 'active'
  const allLinks = document.querySelectorAll(".sidebar-link");

  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (!linkHref) return; // Bỏ qua link không có href (như 'javascript:void(0)')

    const linkPage = linkHref.split("/").pop();

    // Nếu tìm thấy link của trang hiện tại
    if (linkPage === currentPage) {
      const submenu = link.closest(".submenu"); // Tìm xem link này có nằm trong submenu ko

      if (submenu) {
        // --- NẾU LÀ LINK CON (như 'Quản lý giá') ---
        submenu.style.display = "block"; // 1. Mở submenu cha
        const parentLi = submenu.closest(".sidebar-list-item.tab-content");
        if (parentLi) {
          parentLi.classList.add("active"); // 2. Thêm vạch đỏ cho <li> cha (Sản phẩm)
          const parentLink = parentLi.querySelector(".sidebar-link");
          if (parentLink) {
            parentLink.classList.add("active"); // 3. Xoay mũi tên cho <a> cha (Sản phẩm)
          }
        }
      } else {
        // --- NẾU LÀ LINK CHA (như 'Trang tổng quan') ---
        const parentLi = link.closest(".sidebar-list-item.tab-content");
        if (parentLi) {
          parentLi.classList.add("active"); // Thêm vạch đỏ cho chính nó
        }
      }
    }
  });
}

// ===================================
// Logic chính của Trang (Chạy sau khi DOM tải)
// ===================================

/**
 * Tất cả code tương tác với HTML của trang
 * phải nằm trong 'DOMContentLoaded'
 */
document.addEventListener("DOMContentLoaded", function () {
  
  // 1. Chạy hàm setup sidebar (cho vạch đỏ và menu sổ)
  setupSidebarActiveState();

  // 2. Lấy các element (bây giờ đã an toàn vì DOM đã tải xong)
  const tableBody = document.getElementById("price-table-body");
  const searchInput = document.getElementById("search-product");
  const profitForm = document.getElementById("profit-form");

  // 3. Định nghĩa hàm render (chỉ dùng trong file này)
  // (Mình đã xóa hàm renderTable bị trùng ở code cũ)
  function renderTable(data) {
    if (!tableBody) return; // Bảo vệ nếu không tìm thấy tableBody
    
    tableBody.innerHTML = "";
    data.forEach((p) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.cost.toLocaleString()}</td>
        <td>${p.profit}%</td>
        <td>${calcPrice(p.cost, p.profit).toLocaleString()}</td>
        <td>
          <button class="btn-edit" onclick="editProfit('${p.id}')">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="btn-delete" onclick="deleteProduct('${p.id}')">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // 4. Sửa lợi nhuận (cần 'window' vì gọi = onclick)
  window.editProfit = function (id) {
    const p = products.find((x) => x.id === id);
    if (p) {
      document.getElementById("product-id").value = p.id;
      document.getElementById("profit-rate").value = p.profit;
    }
  };

  // 5. THÊM HÀM XÓA BỊ THIẾU (cần 'window' vì gọi = onclick)
  window.deleteProduct = function (id) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    
    // Hỏi xác nhận trước khi xóa
    if (confirm(`Bạn có chắc muốn xóa sản phẩm ${p.name} (${p.id})?`)) {
      const index = products.findIndex((x) => x.id === id);
      if (index > -1) {
        products.splice(index, 1); // Xóa khỏi mảng data
        renderTable(products); // Vẽ lại bảng
        alert("Đã xóa sản phẩm " + p.name);
      }
    }
  };

  // 6. Gán listener cho Tìm kiếm
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.id.toLowerCase().includes(keyword)
      );
      renderTable(filtered);
    });
  }

  // 7. Gán listener cho Form
  if (profitForm) {
    profitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("product-id").value.trim();
      const profit = parseFloat(document.getElementById("profit-rate").value);
      const p = products.find((x) => x.id === id);
      if (p) {
        p.profit = profit;
        alert(`Đã cập nhật lợi nhuận cho ${p.name} (${profit}%)`);
      } else {
        alert("Không tìm thấy sản phẩm!");
      }
      renderTable(products); // Vẽ lại bảng
      profitForm.reset(); // Xóa chữ trong form
    });
  }

  // 8. Chạy render lần đầu (sau khi mọi thứ đã sẵn sàng)
  renderTable(products);
});