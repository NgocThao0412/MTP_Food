const ordersData = [
  {
    id: "DH001",
    customer: "Nguyễn Văn A",
    date: "2025-10-01",
    total: 158000,
    status: "pending",
    address: { phuong: "Phường 3", quan: "Quận 5", tp: "TP.HCM" },
    items: [
      { name: "Bột Chiên", quantity: 2, price: 89000 },
      { name: "Chè Thái", quantity: 1, price: 69000 }
    ]
  },
  {
    id: "DH002",
    customer: "Trần Thị B",
    date: "2025-10-05",
    total: 39000,
    status: "shipping",
    address: { phuong: "Phường 7", quan: "Quận 10", tp: "TP.HCM" },
    items: [
      { name: "Nước Ép Dâu", quantity: 1, price: 39000 }
    ]
  },
  {
    id: "DH003",
    customer: "Lê Minh C",
    date: "2025-10-06",
    total: 799000,
    status: "completed",
    address: { phuong: "Phường 1", quan: "Quận 3", tp: "TP.HCM" },
    items: [
      { name: "Set Mâm Cơm Việt", quantity: 1, price: 799000 }
    ]
  },
  {
    id: "DH004",
    customer: "Phạm Hồng D",
    date: "2025-09-10",
    total: 599000,
    status: "cancelled",
    address: { phuong: "Phường 5", quan: "Quận 4", tp: "TP.HCM" },
    items: [
      { name: "Set Tam Ca", quantity: 1, price: 599000 }
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("orderTableBody");
  const ordersSection = document.querySelector(".admin-control-bottom");
  const detailSection = document.getElementById("orderDetail");
  const btnBack = document.getElementById("btnBack");
  const btnConfirm = document.getElementById("btnConfirm");

  // Các phần tử lọc/sắp xếp
  const searchEl = document.getElementById("searchOrder");
  const statusEl = document.getElementById("filterStatus");
  const startEl = document.getElementById("startDate");
  const endEl = document.getElementById("endDate");
  const sortEl = document.getElementById("sortWard");
  const filterBtn = document.getElementById("filterBtn");

  // ---------------- HIỂN THỊ DANH SÁCH ----------------
  function renderOrders(list) {
    tableBody.innerHTML = "";

    if (!list || list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:18px;">Không có đơn hàng phù hợp</td></tr>`;
      return;
    }

    list.forEach(order => {
      const statusMap = {
        pending: { text: "Chờ xác nhận", color: "#6c757d" },
        shipping: { text: "Đang giao", color: "#17a2b8" },
        completed: { text: "Đã giao", color: "#28a745" },
        cancelled: { text: "Đã hủy", color: "#dc3545" }
      };
      const statusInfo = statusMap[order.status] || { text: order.status, color: "#333" };

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customer}</td>
        <td>${order.date}</td>
        <td style="text-align:right;">${order.total.toLocaleString("vi-VN")}₫</td>
        <td style="font-weight:600; color:${statusInfo.color};">${statusInfo.text}</td>
        <td>${order.address?.phuong || "-"}, ${order.address?.quan || "-"}, ${order.address?.tp || "-"}</td>
        <td style="text-align:center;">
          <button class="btn-view" data-id="${order.id}">Xem</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Gắn sự kiện nút xem
    document.querySelectorAll(".btn-view").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = e.target.dataset.id;
        showDetail(id);
      });
    });
  }

  // ---------------- HIỂN THỊ CHI TIẾT ----------------
  function showDetail(id) {
    const order = ordersData.find(o => o.id === id);
    if (!order) return;

    if (ordersSection && detailSection) {
      ordersSection.style.display = "none";
      detailSection.style.display = "block";
    }

    document.getElementById("detailId").textContent = order.id;
    document.getElementById("detailCustomer").textContent = order.customer;
    document.getElementById("detailDate").textContent = order.date;
    document.getElementById("detailTotal").textContent = order.total.toLocaleString("vi-VN") + "₫";
    document.getElementById("detailStatus").textContent = statusLabelText(order.status);
    document.getElementById("detailAddress").textContent = 
      `${order.address?.phuong || "-"}, ${order.address?.quan || "-"}, ${order.address?.tp || "-"}`;

    const productNames = order.items && order.items.length > 0 
      ? order.items.map(i => i.name).join(", ")
      : "Không có sản phẩm";
    document.getElementById("detailProducts").textContent = productNames;

    if (btnConfirm) {
      if (order.status === "pending") {
        btnConfirm.style.display = "inline-block";
        btnConfirm.onclick = function () {
          if (confirm(`Xác nhận đơn hàng ${order.id}?`)) {
            order.status = "shipping";
            localStorage.setItem("ordersData", JSON.stringify(ordersData));
            alert("Đã xác nhận đơn hàng " + order.id);
            renderOrders(ordersData);
            showDetail(order.id);
          }
        };
      } else {
        btnConfirm.style.display = "none";
      }
    }
  }

  // ---------------- NÚT QUAY LẠI ----------------
if (btnBack) {
  btnBack.addEventListener("click", () => {
    // Ẩn phần chi tiết
    if (detailSection) detailSection.style.display = "none";
    // Hiện lại danh sách đơn hàng
    if (ordersSection) ordersSection.style.display = "block";
    // Hiển thị lại danh sách
    renderOrders(ordersData);
  });
}


  function applyFilters() {
  const search = (searchEl?.value || "").toLowerCase().trim();
  const status = (statusEl?.value ?? "").toString();
  const startVal = startEl?.value || "";
  const endVal = endEl?.value || "";
  const sortVal = (sortEl?.value || "").toString();

  // ✅ Hàm chuyển "YYYY-MM-DD" → Date chuẩn
  const parseDate = (str) => {
    if (!str) return null;
    const parts = str.split("-");
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d); // luôn UTC-0
  };

  const startDate = parseDate(startVal);
  const endDate = parseDate(endVal);

  let filtered = [...ordersData];

  // 🔍 Tìm kiếm
  if (search) {
    filtered = filtered.filter(o =>
      o.id.toLowerCase().includes(search) ||
      o.customer.toLowerCase().includes(search)
    );
  }

  // ⚙️ Lọc theo trạng thái
  if (status && status !== "all") {
    filtered = filtered.filter(o => o.status === status);
  }

  // 📅 Lọc theo ngày
  filtered = filtered.filter(o => {
    const orderDate = parseDate(o.date);
    if (startDate && orderDate < startDate) return false;
    if (endDate && orderDate > endDate) return false;
    return true;
  });

  // 🏘️ Sắp xếp theo phường
  if (sortVal === "asc") {
    filtered.sort((a,b) => (a.address?.phuong || "").localeCompare(b.address?.phuong || ""));
  } else if (sortVal === "desc") {
    filtered.sort((a,b) => (b.address?.phuong || "").localeCompare(a.address?.phuong || ""));
  }

  renderOrders(filtered);
}


// ---------------- NÚT RESET ----------------
function resetHandler() {
  if (searchEl) searchEl.value = "";
  if (statusEl) statusEl.value = "all";
  if (startEl) startEl.value = "";
  if (endEl) endEl.value = "";
  if (sortEl) sortEl.value = "";
  renderOrders(ordersData);
}

  // ---------------- GẮN SỰ KIỆN ----------------
  if (searchEl) searchEl.addEventListener("input", applyFilters);
  if (statusEl) statusEl.addEventListener("change", applyFilters);
  if (startEl) startEl.addEventListener("change", applyFilters);
  if (endEl) endEl.addEventListener("change", applyFilters);
  if (sortEl) sortEl.addEventListener("change", applyFilters);
  if (filterBtn) filterBtn.addEventListener("click", resetHandler);

  // Giới hạn chọn ngày
  if (startEl && endEl) {
    startEl.addEventListener("change", () => {
      if (startEl.value) endEl.min = startEl.value;
      else endEl.removeAttribute("min");
      applyFilters();
    });
    endEl.addEventListener("change", () => {
      if (endEl.value) startEl.max = endEl.value;
      else startEl.removeAttribute("max");
      applyFilters();
    });
  }

  // ---------------- TIỆN ÍCH ----------------
  function statusLabelText(status) {
    switch (status) {
      case "pending": return "Chờ xác nhận";
      case "shipping": return "Đang giao";
      case "completed": return "Đã giao";
      case "cancelled": return "Đã hủy";
      default: return status;
    }
  }

  // ---------------- KHỞI TẠO ----------------
  renderOrders(ordersData);
});
