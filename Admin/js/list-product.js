document.addEventListener("DOMContentLoaded", () => {
  // --- KHAI BÁO BIẾN TOÀN CỤC ---
  const PRODUCT_KEY = "MTP_PRODUCTS";
  const CATEGORY_KEY = "MTP_CATEGORIES";
  let currentPage = 1;
  let perPage = 5; // Số sản phẩm mỗi trang, bạn có thể thay đổi
  let editingProductId = null; // ID sản phẩm đang sửa

  // --- CÁC HÀM TIỆN ÍCH (Helpers) ---

  /**
   * Lấy đường dẫn ảnh, nếu không có thì trả về ảnh rỗng
   * @param {string} src Đường dẫn ảnh
   * @returns {string} Đường dẫn ảnh hợp lệ
   */
  function getPathImage(src) {
    return src || "../Img/blank-image.png";
  }

  /**
   * Chuyển số thành định dạng tiền tệ VND
   * @param {number} price Số tiền
   * @returns {string} Chuỗi tiền tệ (vd: 50.000 ₫)
   */
  function vnd(price) {
    return Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  /**
   * Tạo ID duy nhất dựa trên thời gian
   * @returns {number} ID
   */
  function createId() {
    return Date.now();
  }

  /**
   * Hiển thị thông báo (toast). Giả định bạn có hàm toast() ở file khác.
   * @param {object} options - { title, message, type, duration }
   */
  function showToast(options) {
    if (window.toast) {
      window.toast(options);
    } else {
      console.warn("Hàm toast() không tồn tại. Đang dùng alert().");
      alert(`${options.title}: ${options.message}`);
    }
  }

  // --- LOGIC LƯU TRỮ (LocalStorage) ---

  // (Sản phẩm)
  function getProducts() {
    return JSON.parse(localStorage.getItem(PRODUCT_KEY)) || [];
  }
  function setProducts(products) {
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
  }

  // (Thể loại)
  function getCategories() {
    return JSON.parse(localStorage.getItem(CATEGORY_KEY)) || [];
  }
  function setCategories(categories) {
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
  }

  // --- KHỞI TẠO DỮ LIỆU BAN ĐẦU ---

  /**
   * Tải dữ liệu từ HTML tĩnh vào LocalStorage (chỉ chạy 1 lần)
   */
  function initData() {
    // 1. Khởi tạo Thể loại
    if (getCategories().length === 0) {
      const categoryOptions = document.querySelectorAll(
        ".admin-control-left select option"
      );
      const initialCategories = [];
      categoryOptions.forEach((opt, idx) => {
        if (opt.value !== "Tất cả") {
          initialCategories.push({
            id: createId() + idx,
            name: opt.value,
            // desc: `Mô tả cho ${opt.value}`, // Đã bỏ desc
          });
        }
      });
      setCategories(initialCategories);
    }

    // 2. Khởi tạo Sản phẩm
    if (getProducts().length === 0) {
      const nodes = document.querySelectorAll(
        ".product-list-container .product-item"
      );
      const initialProducts = [];
      nodes.forEach((node, idx) => {
        const priceText =
          node.querySelector(".price")?.textContent?.trim() || "0";
        const priceNumber =
          Number(
            (priceText.match(/[\d.]+/g)?.join("") || "0").replace(/\./g, "")
          ) || 0;

        initialProducts.push({
          id: createId() + idx,
          img:
            node.querySelector(".product-img")?.getAttribute("src") ||
            "../Img/blank-image.png",
          ma_sp: `SP00${idx + 1}`,
          ten_mon:
            node.querySelector(".product-name")?.textContent?.trim() ||
            `Sản phẩm ${idx + 1}`,
          loai:
            node.querySelector(".product-category")?.textContent?.trim() ||
            "Món mặn",
          mo_ta: node.querySelector(".product-desc")?.textContent?.trim() || "",
          don_vi: "Phần",
          so_luong: 100,
          gia_ban: priceNumber,
          loi_nhuan: 20,
          nha_cung_cap: "NCC Mặc định",
          hien_trang: node.dataset.status || "dang-ban",
          isDeleted: false, // Dùng cho xóa mềm
        });
      });
      setProducts(initialProducts);
    }
  }

  // --- LOGIC SIDEBAR (Giữ nguyên code của bạn) ---
  const menuIconButton = document.querySelector(".menu-icon-btn");
  const sidebar = document.querySelector(".sidebar");
  if (menuIconButton && sidebar) {
    menuIconButton.addEventListener("click", () =>
      sidebar.classList.toggle("open")
    );
  }
  // (Phần code sidebar khác của bạn nếu có...)

  // --- LOGIC HIỂN THỊ (Render) ---

  /**
   * Hiển thị danh sách sản phẩm ra DOM
   * @param {array} products - Danh sách sản phẩm cần hiển thị
   * @param {number} per - Số lượng mỗi trang
   * @param {number} page - Trang hiện tại
   */
  function displayList(products, per, page) {
    const container = document.querySelector(".product-list-container");
    if (!container) return;
    container.innerHTML = "";
    const start = (page - 1) * per;
    const end = page * per;
    const paginatedItems = products.slice(start, end);

    if (paginatedItems.length === 0) {
      container.innerHTML =
        "<p style='text-align: center; padding: 20px;'>Không tìm thấy sản phẩm nào.</p>";
      return;
    }

    paginatedItems.forEach((p) => {
      let statusClass = "";
      let statusText = "";
      switch (p.hien_trang) {
        case "dang-ban":
          statusClass = "status-active";
          statusText = " Đang bán";
          break;
        case "tam-het":
          statusClass = "status-warning";
          statusText = " Tạm hết";
          break;
        case "ngung-ban":
          statusClass = "status-inactive";
          statusText = " Ngừng bán";
          break;
      }

      // Nếu bị xóa mềm, ưu tiên hiển thị trạng thái "Đã xóa"
      if (p.isDeleted) {
        statusClass = "status-inactive";
        statusText = " Đã xóa";
      }

      const itemHTML = `
        <div class="product-item" data-status="${p.hien_trang}">
            <img src="${getPathImage(p.img)}" alt="${
        p.ten_mon
      }" class="product-img" />
            <div class="product-info">
                <h3 class="product-name">${p.ten_mon} (Mã: ${p.ma_sp})</h3>
                <p class="product-desc">${p.mo_ta}</p>
                <span class="product-category">${p.loai}</span>
                <span class="product-status ${statusClass}">${statusText}</span>
            </div>
            <div class="product-actions">
                <span class="price">${vnd(p.gia_ban)}</span>
                <div class="buttons-group">
                    ${
                      p.isDeleted
                        ? `<button class="btn-action btn-edit" title="Khôi phục" onclick="restoreProduct(${p.id})">
                                <i class="fa-light fa-undo"></i>
                            </button>`
                        : `<button class="btn-action btn-edit" title="Chỉnh sửa" onclick="editProduct(${p.id})">
                                <i class="fa-light fa-pen"></i>
                            </button>`
                    }
                    <button class="btn-action btn-delete" title="Xóa" onclick="deleteProduct(${p.id})">
                        <i class="fa-light fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
      `;
      container.innerHTML += itemHTML;
    });
  }

  /**
   * Cài đặt thanh phân trang
   * @param {array} items - Danh sách TỔNG (trước khi phân trang)
   * @param {number} per - Số lượng mỗi trang
   * @param {number} page - Trang hiện tại
   */
  function setupPagination(items, per, page) {
    const nav = document.querySelector(".page-nav-list");
    if (!nav) return;
    nav.innerHTML = "";
    const total = Math.max(1, Math.ceil(items.length / per));
    for (let i = 1; i <= total; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === page ? "active" : ""}`;
      li.innerHTML = `<button class="page-btn" data-page="${i}">${i}</button>`;
      nav.appendChild(li);
    }
    nav.querySelectorAll(".page-btn").forEach((b) =>
      b.addEventListener("click", () => {
        currentPage = Number(b.dataset.page);
        showProduct();
      })
    );
  }

  /**
   * Cập nhật danh sách thể loại ở 3 nơi: Filter, Modal sản phẩm, Modal thể loại
   */
  function renderCategoryUI() {
    const categories = getCategories();
    const filterSelect = document.querySelector(".admin-control-left select");
    const productFormSelect = document.getElementById("chon-loai");
    const categoryListUL = document.getElementById("category-list");

    // Clear
    filterSelect.innerHTML = `<option value="Tất cả">Tất cả</option>`;
    productFormSelect.innerHTML = `<option value="">-- Chọn loại --</option>`;
    categoryListUL.innerHTML = "";

    // Populate
    categories.forEach((cat) => {
      filterSelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
      productFormSelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;

      // *** ĐÃ THAY ĐỔI: Bỏ hiển thị desc (thẻ <small>) ***
      categoryListUL.innerHTML += `
            <li style="padding: 5px 0;">
                ${cat.name}
            </li>
        `;
    });

    // Thêm tùy chọn "Đã xóa" vào filter
    filterSelect.innerHTML += `<option value="Đã xóa">Đã xóa</option>`;
  }

  // --- LOGIC LỌC VÀ TÌM KIẾM ---

  /**
   * Hàm chính: Lấy dữ liệu, lọc, tìm kiếm và gọi hàm displayList
   */
  function showProduct() {
    const selectEl = document.querySelector(".admin-control-left select");
    const selectOp = selectEl ? selectEl.value : "Tất cả";
    const searchEl = document.querySelector(".form-search-input");
    const valeSearchInput = searchEl ? searchEl.value || "" : "";

    let products = getProducts();
    let result = [];

    // 1. Lọc theo trạng thái (Đã xóa / Tất cả / Theo loại)
    if (selectOp === "Tất cả") {
      result = products.filter((p) => !p.isDeleted);
    } else if (selectOp === "Đã xóa") {
      result = products.filter((p) => p.isDeleted);
    } else {
      result = products.filter((p) => p.loai === selectOp && !p.isDeleted);
    }

    // 2. Lọc theo tìm kiếm
    if (valeSearchInput.trim() !== "") {
      result = result.filter((item) =>
        (item.ten_mon || "")
          .toString()
          .toUpperCase()
          .includes(valeSearchInput.toString().toUpperCase())
      );
    }

    // 3. Xử lý phân trang
    const totalPages = Math.max(1, Math.ceil(result.length / perPage));
    if (currentPage > totalPages) currentPage = totalPages;

    // 4. Hiển thị
    displayList(result, perPage, currentPage);
    setupPagination(result, perPage, currentPage);
  }

  // --- LOGIC QUẢN LÝ THỂ LOẠI (CHỈ THÊM) ---

  const categoryModal = document.getElementById("modal-category");
  const categoryForm = document.getElementById("form-category");

  // Mở modal
  document.getElementById("btn-add-category").addEventListener("click", () => {
    categoryForm.reset();
    document.getElementById("cat-code").value = "(Tự động)";
    categoryModal.classList.add("open");
  });

  // Đóng modal
  document
    .getElementById("close-category-modal")
    .addEventListener("click", () => categoryModal.classList.remove("open"));
  document
    .getElementById("cancel-category")
    .addEventListener("click", () => categoryModal.classList.remove("open"));

  // Xử lý Submit (Chỉ Thêm)
  categoryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const catName = document.getElementById("cat-name").value.trim();
    if (!catName) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng nhập tên loại",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    let categories = getCategories();
    categories.push({ id: createId(), name: catName });

    setCategories(categories);
    renderCategoryUI(); // Cập nhật lại tất cả UI
    categoryModal.classList.remove("open");
  });

  // --- LOGIC QUẢN LÝ SẢN PHẨM (CRUD) ---

  const productModal = document.querySelector(".modal.add-product");
  const productForm = document.querySelector(".add-product-form");

  /**
   * Xóa mềm sản phẩm (đặt isDeleted = true)
   * @param {number} id - ID sản phẩm
   */
  window.deleteProduct = (id) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      const products = getProducts();
      const idx = products.findIndex((p) => p.id === id);
      if (idx !== -1) {
        products[idx].isDeleted = true;
        setProducts(products);
        showProduct();
        showToast({
          title: "Success",
          message: "Xóa sản phẩm thành công !",
          type: "success",
          duration: 3000,
        });
      }
    }
  };

  /**
   * Khôi phục sản phẩm (đặt isDeleted = false)
   * @param {number} id - ID sản phẩm
   */
  window.restoreProduct = (id) => {
    if (confirm("Bạn có chắc chắn muốn khôi phục sản phẩm này?")) {
      const products = getProducts();
      const idx = products.findIndex((p) => p.id === id);
      if (idx !== -1) {
        products[idx].isDeleted = false;
        setProducts(products);
        showProduct();
        showToast({
          title: "Success",
          message: "Khôi phục sản phẩm thành công !",
          type: "success",
          duration: 3000,
        });
      }
    }
  };

  /**
   * Reset form sản phẩm về giá trị mặc định
   */
  function setDefaultValue() {
    productForm.reset(); // Reset tất cả field
    document.querySelector(".upload-image-preview").src =
      "../Img/blank-image.png";
    document.getElementById("ma-sp").value = "";
    document.getElementById("ma-sp").disabled = false;
    editingProductId = null;
  }

  /**
   * Xem trước ảnh được tải lên
   * @param {HTMLInputElement} input - Thẻ input[type=file]
   */
  window.uploadImage = (input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.querySelector(".upload-image-preview").src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  // Mở modal "Thêm mới"
  document.getElementById("btn-add-product").addEventListener("click", () => {
    setDefaultValue();
    document
      .querySelectorAll(".add-product-e")
      .forEach((it) => (it.style.display = "block"));
    document
      .querySelectorAll(".edit-product-e")
      .forEach((it) => (it.style.display = "none"));
    // Gợi ý mã SP mới
    document.getElementById("ma-sp").value = `SP${createId()
      .toString()
      .slice(-6)}`;
    productModal.classList.add("open");
  });

  // Mở modal "Chỉnh sửa"
  window.editProduct = (id) => {
    const products = getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) return;

    editingProductId = id;
    setDefaultValue(); // Xóa form

    // Hiển thị nút Sửa, ẩn nút Thêm
    document
      .querySelectorAll(".add-product-e")
      .forEach((it) => (it.style.display = "none"));
    document
      .querySelectorAll(".edit-product-e")
      .forEach((it) => (it.style.display = "block"));

    // Đổ dữ liệu vào form
    document.querySelector(".upload-image-preview").src = getPathImage(
      product.img
    );
    document.getElementById("ma-sp").value = product.ma_sp || product.id;
    document.getElementById("ma-sp").disabled = true; // Không cho sửa mã
    document.getElementById("ten-mon").value = product.ten_mon || "";
    document.getElementById("chon-loai").value = product.loai || "";
    document.getElementById("mo-ta").value = product.mo_ta || "";
    document.getElementById("don-vi").value = product.don_vi || "";
    document.getElementById("so-luong").value = product.so_luong || 0;
    document.getElementById("gia-ban").value = product.gia_ban || 0;
    document.getElementById("loi-nhuan").value = product.loi_nhuan || 0;
    document.getElementById("nha-cung-cap").value = product.nha_cung_cap || "";
    document.getElementById("hien-trang").value =
      product.hien_trang || "dang-ban";

    productModal.classList.add("open");
  };

  // Xử lý nút "THÊM MỚI"
  document
    .getElementById("add-product-button")
    .addEventListener("click", (e) => {
      e.preventDefault();
      // Đọc tất cả giá trị từ form
      const newProduct = {
        id: createId(), // ID chính
        isDeleted: false,
        img: document.querySelector(".upload-image-preview").src,
        ma_sp: document.getElementById("ma-sp").value || `SP${createId()}`,
        ten_mon: document.getElementById("ten-mon").value.trim(),
        loai: document.getElementById("chon-loai").value,
        mo_ta: document.getElementById("mo-ta").value.trim(),
        don_vi: document.getElementById("don-vi").value.trim(),
        so_luong: Number(document.getElementById("so-luong").value) || 0,
        gia_ban: Number(document.getElementById("gia-ban").value) || 0,
        loi_nhuan: Number(document.getElementById("loi-nhuan").value) || 0,
        nha_cung_cap: document.getElementById("nha-cung-cap").value.trim(),
        hien_trang: document.getElementById("hien-trang").value,
      };

      // Validate
      if (!newProduct.ten_mon || !newProduct.loai || !newProduct.gia_ban) {
        showToast({
          title: "Chú ý",
          message: "Vui lòng nhập Tên, Loại và Giá bán!",
          type: "warning",
          duration: 3000,
        });
        return;
      }

      const products = getProducts();
      products.unshift(newProduct);
      setProducts(products);
      showProduct();
      productModal.classList.remove("open");
      showToast({
        title: "Success",
        message: "Thêm sản phẩm thành công!",
        type: "success",
        duration: 3000,
      });
    });

  // Xử lý nút "LƯU THAY ĐỔI"
  document
    .getElementById("update-product-button")
    .addEventListener("click", (e) => {
      e.preventDefault();
      if (editingProductId === null) return;

      const products = getProducts();
      const index = products.findIndex((p) => p.id === editingProductId);
      if (index === -1) return;

      const updatedProduct = {
        ...products[index], // Giữ lại ID, isDeleted
        img: document.querySelector(".upload-image-preview").src,
        // ma_sp không đổi
        ten_mon: document.getElementById("ten-mon").value.trim(),
        loai: document.getElementById("chon-loai").value,
        mo_ta: document.getElementById("mo-ta").value.trim(),
        don_vi: document.getElementById("don-vi").value.trim(),
        so_luong: Number(document.getElementById("so-luong").value) || 0,
        gia_ban: Number(document.getElementById("gia-ban").value) || 0,
        loi_nhuan: Number(document.getElementById("loi-nhuan").value) || 0,
        nha_cung_cap: document.getElementById("nha-cung-cap").value.trim(),
        hien_trang: document.getElementById("hien-trang").value,
      };

      products[index] = updatedProduct;
      setProducts(products);
      showProduct();
      productModal.classList.remove("open");
      showToast({
        title: "Success",
        message: "Sửa sản phẩm thành công!",
        type: "success",
        duration: 3000,
      });
      editingProductId = null;
    });

  // Đóng modal sản phẩm
  document.querySelectorAll(".modal-close.product-form").forEach((btn) =>
    btn.addEventListener("click", () => {
      productModal.classList.remove("open");
      setDefaultValue();
    })
  );

  // --- GẮN CÁC SỰ KIỆN TÌM KIẾM/LỌC ---
  document
    .querySelector(".admin-control-left select")
    ?.addEventListener("change", () => {
      currentPage = 1;
      showProduct();
    });
  document
    .querySelector(".form-search")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      currentPage = 1;
      showProduct();
    });

  // --- CHẠY CÁC HÀM KHỞI TẠO ---
  initData(); // Tải data từ HTML (nếu cần)
  renderCategoryUI(); // Hiển thị các thể loại
  showProduct(); // Hiển thị sản phẩm
});