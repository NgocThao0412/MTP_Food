const ordersData = [
  {
    id: "DH001",
    customer: "Nguyễn Văn A",
    date: "2025-10-01",
    total: 250000,
    status: "pending",
    address: { phuong: "Phường 3", quan: "Quận 5" },
    items: []
  },
  {
    id: "DH002",
    customer: "Trần Thị B",
    date: "2025-10-05",
    total: 480000,
    status: "shipping",
    address: { phuong: "Phường 7", quan: "Quận 10" },
    items: []
  },
  {
    id: "DH003",
    customer: "Lê Minh C",
    date: "2025-10-06",
    total: 120000,
    status: "completed",
    address: { phuong: "Phường 1", quan: "Quận 3" },
    items: []
  },
  {
    id: "DH004",
    customer: "Phạm Hồng D",
    date: "2025-09-10",
    total: 360000,
    status: "cancelled",
    address: { phuong: "Phường 5", quan: "Quận 4" },
    items: []
  }

];



document.addEventListener("DOMContentLoaded", () => {

  const tableBody = document.getElementById("orderTableBody");
  const searchEl = document.getElementById("searchOrder");
  const statusEl = document.getElementById("filterStatus");
  const startEl = document.getElementById("startDate");
  const endEl = document.getElementById("endDate");
  const sortEl = document.getElementById("sortWard");
  const filterBtn = document.getElementById("filterBtn");

  const ordersSection = document.getElementById("ordersSection");
  const orderDetail = document.getElementById("orderDetail");
  const orderDetailContent = document.getElementById("orderDetailContent");
  const btnBack = document.getElementById("btnBack");

  if (!tableBody) {
    console.error("Không tìm thấy phần tử #orderTableBody. Kiểm tra customers.html");
    return;
  }

 function renderOrders(list) {
  const tableBody = document.getElementById("orderTableBody");
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
      <td>${order.address?.phuong || "-"}, ${order.address?.quan || "-"}</td>
      <td style="text-align:center;">
        <button class="btn-view" data-id="${order.id}" title="Xem chi tiết"> Xem</button>
      </td>
      
    `;
    tableBody.appendChild(tr);
  });

  document.querySelectorAll(".btn-view").forEach(btn => {
    btn.removeEventListener?.("click", showViewHandler);
    btn.addEventListener("click", showViewHandler);
  });
}

function showViewHandler(e) {
  const id = e.currentTarget.dataset.id;
  showDetail(id);
}

  function statusLabelText(status) {
    switch (status) {
      case "pending": return "Chờ xác nhận";
      case "shipping": return "Đang giao";
      case "completed": return "Đã giao";
      case "cancelled": return "Đã hủy";
      default: return status;
    }
  }

  function showDetail(id) {
    const order = ordersData.find(o => o.id === id);
    if (!order) return;

    if (ordersSection && orderDetail && orderDetailContent && btnBack) {
      ordersSection.style.display = "none";
      orderDetail.style.display = "block";

      const itemsHtml = (order.items || []).length
        ? (order.items || []).map(it => `
            <tr>
              <td>${it.name}</td>
              <td>${it.quantity}</td>
              <td>${it.price.toLocaleString("vi-VN")}₫</td>
              <td>${(it.price * it.quantity).toLocaleString("vi-VN")}₫</td>
            </tr>`).join("")
        : `<tr><td colspan="4" style="text-align:center;">Không có sản phẩm</td></tr>`;

      orderDetailContent.innerHTML = `
        <p><b>Mã đơn:</b> ${order.id}</p>
        <p><b>Khách hàng:</b> ${order.customer}</p>
        <p><b>Ngày đặt:</b> ${order.date}</p>
        <p><b>Địa chỉ:</b> ${order.address?.phuong || "-"}, ${order.address?.quan || "-"}</p>
        <p><b>Tổng tiền:</b> ${order.total.toLocaleString("vi-VN")}₫</p>
        <p><b>Trạng thái:</b> ${statusLabelText(order.status)}</p>
        <h4>Danh sách sản phẩm</h4>
        <table class="admin-table" style="margin-top:10px;">
          <thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      `;
    } else {document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("btn-view")) {
    const row = e.target.closest("tr");

    
    const orderId = row.cells[0].textContent;
    const customer = row.cells[1].textContent;
    const date = row.cells[2].textContent;
    const total = row.cells[3].textContent;
    const status = row.cells[4].textContent;
    const address = row.cells[5].textContent;

    
    const detailSection = document.getElementById("orderDetail");
    const detailContent = document.getElementById("orderDetailContent");

    detailContent.innerHTML = `
      <table class="admin-table">
        <tr><th>Mã đơn</th><td>${orderId}</td></tr>
        <tr><th>Khách hàng</th><td>${customer}</td></tr>
        <tr><th>Ngày đặt</th><td>${date}</td></tr>
        <tr><th>Tổng tiền</th><td>${total}</td></tr>
        <tr><th>Trạng thái</th><td>${status}</td></tr>
        <tr><th>Địa chỉ</th><td>${address}</td></tr>
      </table>
    `;

    
    document.querySelector(".admin-control-bottom").style.display = "none";
    detailSection.style.display = "block";
  }
  
const btnConfirm = document.getElementById("btnConfirm");
if (btnConfirm) {
  if (order.status === "pending") {
    btnConfirm.style.display = "inline-block"; 
    btnConfirm.onclick = function () {
      if (confirm("Bạn có chắc muốn xác nhận đơn hàng này không?")) {
        
        order.status = "shipping";

        
        localStorage.setItem("ordersData", JSON.stringify(ordersData));

        alert("Đã xác nhận đơn hàng " + order.id);

        
        renderOrders(ordersData);
        showDetail(order.id);
      }
    };
  } else {
    btnConfirm.style.display = "none"; 
  }} 
});

  document.getElementById("btnBack").addEventListener("click", function () {
  document.getElementById("orderDetail").style.display = "none";
  document.querySelector(".admin-control-bottom").style.display = "block";
  
});
}}

  if (btnBack && ordersSection && orderDetail) {
    btnBack.addEventListener("click", () => {
      orderDetail.style.display = "none";
      ordersSection.style.display = "block";
    });
  }

  function applyFilters() {
    const search = (searchEl?.value || "").toLowerCase().trim();
    const status = (statusEl?.value ?? "").toString(); // could be "" or "all"
    const startVal = startEl?.value || "";
    const endVal = endEl?.value || "";
    const sortVal = (sortEl?.value || "").toString();

    let startDate = startVal ? new Date(startVal) : null;
    let endDate = endVal ? new Date(endVal) : null;
    
    if (startDate && endDate && startDate > endDate) {
      const tmp = startDate; startDate = endDate; endDate = tmp;
    }
    let filtered = [...ordersData];

    if (search) {
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(search) || o.customer.toLowerCase().includes(search)
      );
    }
    
    if (status && status !== "all") {
      filtered = filtered.filter(o => o.status === status);
    }
    
    if (startDate) filtered = filtered.filter(o => new Date(o.date) >= startDate);
    if (endDate) filtered = filtered.filter(o => new Date(o.date) <= endDate);

    if (sortVal === "asc") {
      filtered.sort((a,b) => (a.address?.phuong || "").localeCompare(b.address?.phuong || ""));
    } else if (sortVal === "desc") {
      filtered.sort((a,b) => (b.address?.phuong || "").localeCompare(a.address?.phuong || ""));
    }

    renderOrders(filtered);
  }
  
  if (searchEl) searchEl.removeEventListener?.("input", applyFilters);
  if (searchEl) searchEl.addEventListener("input", applyFilters);

  if (statusEl) statusEl.removeEventListener?.("change", applyFilters);
  if (statusEl) statusEl.addEventListener("change", applyFilters);

  if (startEl) startEl.removeEventListener?.("change", applyFilters);
  if (startEl) startEl.addEventListener("change", applyFilters);

  if (endEl) endEl.removeEventListener?.("change", applyFilters);
  if (endEl) endEl.addEventListener("change", applyFilters);

  if (sortEl) sortEl.removeEventListener?.("change", applyFilters);
  if (sortEl) sortEl.addEventListener("change", applyFilters);
  
  if (filterBtn) {
    filterBtn.removeEventListener?.("click", resetHandler);
    filterBtn.addEventListener("click", resetHandler);
  }

  function resetHandler() {
    if (searchEl) searchEl.value = "";
    if (statusEl) {
      
      const idx = Array.from(statusEl.options).findIndex(opt => opt.value === "all");
      statusEl.selectedIndex = idx >= 0 ? idx : 0;
    }
    if (startEl) startEl.value = "";
    if (endEl) endEl.value = "";
    if (sortEl) {
      const idx2 = Array.from(sortEl.options).findIndex(opt => opt.value === "");
      sortEl.selectedIndex = idx2 >= 0 ? idx2 : 0;
    }

    if (startEl) startEl.removeAttribute("max");
    if (endEl) endEl.removeAttribute("min");

    renderOrders(ordersData);
  }

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

  renderOrders(ordersData);
}); 

document.addEventListener("DOMContentLoaded", function () {
  const btnBack = document.getElementById("btnBack");
  const orderDetail = document.getElementById("orderDetail");
  const adminCenter = document.querySelector(".admin-control-center");

  if (btnBack && orderDetail && adminCenter) {
    btnBack.addEventListener("click", () => {
      orderDetail.style.display = "none";
      adminCenter.style.display = "block";
    });
  }
});
