// ==============================
// CUSTOMERS.JS — QUẢN LÝ ĐƠN HÀNG CỨNG
// ==============================

// Dữ liệu đơn hàng mẫu
const ordersData = [
  {
    id: "DH001",
    customer: "Nguyễn Văn A",
    date: "2025-10-01",
    total: 250000,
    status: "pending", // 🕓 Chờ xác nhận
  },
  {
    id: "DH002",
    customer: "Trần Thị B",
    date: "2025-10-05",
    total: 480000,
    status: "shipping", // 🚚 Đang giao
  },
  {
    id: "DH003",
    customer: "Lê Minh C",
    date: "2025-10-06",
    total: 120000,
    status: "completed", // ✅ Đã giao
  },
  {
    id: "DH004",
    customer: "Phạm Hồng D",
    date: "2025-09-10",
    total: 360000,
    status: "cancelled", // ❌ Đã hủy
  },
  {
    id: "DH005",
    customer: "Hoàng Thị E",
    date: "2025-09-12",
    total: 900000,
    status: "pending", // 🕓 Chờ xác nhận
  },
];

// ==============================
// DOM ELEMENTS
// ==============================
const tableBody = document.getElementById("orderTableBody");
const searchInput = document.getElementById("searchOrder");
const statusFilter = document.getElementById("filterStatus");
const filterBtn = document.getElementById("filterBtn");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");

// ==============================
// HIỂN THỊ DỮ LIỆU RA BẢNG
// ==============================
function renderOrders(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:20px;">
          Không có dữ liệu phù hợp
        </td>
      </tr>`;
    return;
  }

  data.forEach((order) => {
    // Ánh xạ trạng thái
    const statusMap = {
      pending: { text: "Chờ xác nhận", color: "#ffc107" },
      shipping: { text: "Đang giao", color: "#17a2b8" },
      completed: { text: "Đã giao", color: "#28a745" },
      cancelled: { text: "Đã hủy", color: "#dc3545" },
    };

    const statusInfo = statusMap[order.status] || {
      text: "Không xác định",
      color: "#6c757d",
    };

    // Tạo hàng dữ liệu
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer}</td>
      <td>${order.date}</td>
      <td>${order.total.toLocaleString("vi-VN")}₫</td>
      <td style="font-weight:600; color:${statusInfo.color}">
        ${statusInfo.text}
      </td>
      <td>
        <button class="btn-view" data-id="${order.id}" title="Xem chi tiết">
          <i class="fa-light fa-eye"></i>
        </button>
        ${
          order.status !== "cancelled"
            ? `<button class="btn-cancel" data-id="${order.id}" title="Hủy đơn" style="color:#dc3545;">
                <i class="fa-light fa-ban"></i>
              </button>`
            : ""
        }
      </td>
    `;
    tableBody.appendChild(row);
  });

  attachActionEvents();
}


// ==============================
// LỌC & TÌM KIẾM
// ==============================
function applyFilters() {
  const searchValue = searchInput.value.toLowerCase().trim();
  const statusValue = statusFilter.value;
  const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
  const endDate = endDateInput.value ? new Date(endDateInput.value) : null;

  const filtered = ordersData.filter((order) => {
    const matchesSearch = order.customer.toLowerCase().includes(searchValue);
    const matchesStatus = statusValue === "all" || order.status === statusValue;

    const orderDate = new Date(order.date);
    const matchesDate =
      (!startDate || orderDate >= startDate) &&
      (!endDate || orderDate <= endDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  renderOrders(filtered);
}

// ==============================
// NÚT XEM & HỦY ĐƠN
// ==============================
function attachActionEvents() {
  // Nút xem chi tiết
  document.querySelectorAll(".btn-view").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const order = ordersData.find((o) => o.id === id);
      alert(
        `📦 THÔNG TIN ĐƠN HÀNG\n\n` +
          `Mã đơn: ${order.id}\n` +
          `Khách hàng: ${order.customer}\n` +
          `Ngày đặt: ${order.date}\n` +
          `Tổng tiền: ${order.total.toLocaleString("vi-VN")}₫\n` +
          `Trạng thái: ${order.status}`
      );
    });
  });

  // Nút hủy đơn
  document.querySelectorAll(".btn-cancel").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const order = ordersData.find((o) => o.id === id);
      if (!order) return;

      if (confirm(`Bạn có chắc muốn hủy đơn ${order.id}?`)) {
        order.status = "cancelled";
        renderOrders(ordersData);
      }
    });
  });
}

// ==============================
// NÚT RESET
// ==============================
filterBtn.addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "all";
  startDateInput.value = "";
  endDateInput.value = "";
  renderOrders(ordersData);
});

// ==============================
// GẮN SỰ KIỆN
// ==============================
searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);
startDateInput.addEventListener("change", applyFilters);
endDateInput.addEventListener("change", applyFilters);

// ==============================
// KHỞI TẠO
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  renderOrders(ordersData);
});

// Lấy phần tử
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const resetBtn = document.getElementById("resetDate");

// Khi chọn ngày bắt đầu => tự động set min cho ngày kết thúc
startDate.addEventListener("change", function() {
  endDate.min = startDate.value;
});

// Khi chọn ngày kết thúc => tự động set max cho ngày bắt đầu
endDate.addEventListener("change", function() {
  startDate.max = endDate.value;
});

// Khi nhấn nút reset => xóa 2 input
resetBtn.addEventListener("click", function() {
  startDate.value = "";
  endDate.value = "";
  startDate.removeAttribute("max");
  endDate.removeAttribute("min");
});

