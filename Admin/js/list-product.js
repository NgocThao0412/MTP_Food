(function () {
  // helpers
  function safeParse(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function toast(opts) {
    if (typeof window.toast === "function" && window.toast !== toast) return window.toast(opts);
    const container = document.getElementById("toast") || (() => {
      const el = document.createElement("div"); el.id = "toast"; document.body.appendChild(el); return el;
    })();
    const node = document.createElement("div");
    node.className = `toast-item toast-${opts.type || "info"}`;
    node.textContent = opts.message || opts.title || "";
    container.appendChild(node);
    setTimeout(() => node.remove(), opts.duration || 3000);
  }
  function getPathImage(src) { return src || "../Img/blank-image.png"; }
  function vnd(price) { return Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" }); }

  // read DOM-hardcoded products when localStorage empty
  function loadProductsFromDOM() {
    const nodes = document.querySelectorAll(".product-list-container .product-item");
    const products = [];
    nodes.forEach((node, idx) => {
      const img = node.querySelector(".product-img")?.getAttribute("src") || "../Img/blank-image.png";
      const title = node.querySelector(".product-name")?.textContent?.trim() || `Sản phẩm ${idx+1}`;
      const desc = node.querySelector(".product-desc")?.textContent?.trim() || "";
      const category = node.querySelector(".product-category")?.textContent?.trim() || "Món chay";
      const priceText = node.querySelector(".price")?.textContent?.trim() || "0";
      const priceNumber = Number((priceText.match(/[\d.]+/g)?.join("") || "0").replace(/\./g, "")) || 0;
      products.push({ id: idx + 1, title, img, category, price: priceNumber, desc, status: 1 });
    });
    return products;
  }

  function getProducts() {
    const stored = safeParse("products");
    if (Array.isArray(stored) && stored.length) return stored;
    return loadProductsFromDOM();
  }
  function setProducts(products) { save("products", products); }

  // login
  function checkLogin() {
    const currentUser = safeParse("currentuser");
    const nameEl = document.getElementById("name-acc");
    if (!currentUser) { if (nameEl) nameEl.textContent = "Khách"; return false; }
    if (currentUser.userType === 0) {
      document.querySelector("body").innerHTML = `<div class="access-denied-section">
        <img class="access-denied-img" src="../Img/access-denied.webp" alt="">
      </div>`;
      return false;
    }
    if (nameEl) nameEl.textContent = currentUser.fullname || "Admin";
    return true;
  }

  // sidebar
  const menuIconButton = document.querySelector(".menu-icon-btn");
  const sidebar = document.querySelector(".sidebar");
  if (menuIconButton && sidebar) menuIconButton.addEventListener("click", () => sidebar.classList.toggle("open"));
  const sidebars = document.querySelectorAll(".sidebar-list-item.tab-content");
  const sections = document.querySelectorAll(".product-list-section, .section");
  sidebars.forEach((sb, idx) => sb.addEventListener("click", () => {
    const curSide = document.querySelector(".sidebar-list-item.active");
    const curSection = document.querySelector(".product-list-section.active, .section.active");
    if (curSide) curSide.classList.remove("active");
    if (curSection) curSection.classList.remove("active");
    sb.classList.add("active");
    if (sections[idx]) sections[idx].classList.add("active");
  }));
  document.querySelectorAll(".product-list-section, .section").forEach(el => el.addEventListener("click", () => sidebar && sidebar.classList.add("open")));

  // paging / render
  let perPage = 2;
  let currentPage = 1;

  function createId(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return 1;
    return arr.reduce((m, it) => (Number(it.id) > m ? Number(it.id) : m), 0) + 1;
  }

  function displayList(items, per, page) {
    const container = document.querySelector(".product-list-container");
    if (!container) return;
    container.innerHTML = "";
    const start = (page - 1) * per;
    const pageItems = items.slice(start, start + per);
    pageItems.forEach(item => {
      const productEl = document.createElement("div");
      productEl.className = "product-item";
      productEl.innerHTML = `
        <img src="${item.img || "../Img/blank-image.png"}" alt="${item.title || ""}" class="product-img" />
        <div class="product-info">
          <h3 class="product-name">${item.title || ""}</h3>
          <p class="product-desc">${item.desc || ""}</p>
          <span class="product-category">${item.category || ""}</span>
        </div>
        <div class="product-actions">
          <span class="price">${vnd(item.price || 0)}</span>
          <div class="buttons-group">
            <button class="btn-action btn-edit" title="Chỉnh sửa" data-id="${item.id}">
              <i class="fa-light fa-pen"></i>
            </button>
            ${item.status === 1
              ? `<button class="btn-action btn-delete" title="Xóa" data-id="${item.id}"><i class="fa-light fa-trash"></i></button>`
              : `<button class="btn-action btn-restore" title="Khôi phục" data-id="${item.id}"><i class="fa-light fa-arrow-rotate-left"></i></button>`}
          </div>
        </div>`;
      container.appendChild(productEl);
    });
    container.querySelectorAll(".btn-edit").forEach(b => b.addEventListener("click", () => editProduct(Number(b.dataset.id))));
    container.querySelectorAll(".btn-delete").forEach(b => b.addEventListener("click", () => deleteProduct(Number(b.dataset.id))));
    container.querySelectorAll(".btn-restore").forEach(b => b.addEventListener("click", () => changeStatusProduct(Number(b.dataset.id))));
  }

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
    nav.querySelectorAll(".page-btn").forEach(b => b.addEventListener("click", () => { currentPage = Number(b.dataset.page); showProduct(); }));
  }

  // search / filter
  function showProduct() {
    const selectEl = document.querySelector(".admin-control-left select");
    const selectOp = selectEl ? selectEl.value : "Tất cả";
    const searchEl = document.querySelector(".form-search-input");
    const valeSearchInput = searchEl ? (searchEl.value || "") : "";

    let products = getProducts();
    let result = [];
    if (selectOp === "Tất cả") result = products.filter(p => p.status === 1);
    else if (selectOp === "Đã xóa") result = products.filter(p => p.status === 0);
    else result = products.filter(p => p.category === selectOp);

    if (valeSearchInput.trim() !== "") {
      result = result.filter(item => (item.title || "").toString().toUpperCase().includes(valeSearchInput.toString().toUpperCase()));
    }

    const totalPages = Math.max(1, Math.ceil(result.length / perPage));
    if (currentPage > totalPages) currentPage = totalPages;

    displayList(result, perPage, currentPage);
    setupPagination(result, perPage, currentPage);
  }

  function cancelSearchProduct() {
    const selectEl = document.querySelector(".admin-control-left select");
    const searchEl = document.querySelector(".form-search-input");
    if (selectEl) selectEl.value = "Tất cả";
    if (searchEl) searchEl.value = "";
    currentPage = 1;
    const products = getProducts().filter(p => p.status === 1);
    displayList(products, perPage, currentPage);
    setupPagination(products, perPage, currentPage);
  }

  // CRUD
  function deleteProduct(id) {
    const products = getProducts();
    const idx = products.findIndex(p => Number(p.id) === Number(id));
    if (idx === -1) return;
    if (confirm("Bạn có chắc muốn xóa?")) {
      products[idx].status = 0;
      setProducts(products);
      toast({ title: "Success", message: "Xóa sản phẩm thành công !", type: "success", duration: 3000 });
      showProduct();
    }
  }

  function changeStatusProduct(id) {
    const products = getProducts();
    const idx = products.findIndex(p => Number(p.id) === Number(id));
    if (idx === -1) return;
    if (confirm("Bạn có chắc chắn muốn khôi phục?")) {
      products[idx].status = 1;
      setProducts(products);
      toast({ title: "Success", message: "Khôi phục sản phẩm thành công !", type: "success", duration: 3000 });
      showProduct();
    }
  }

  let indexCur = -1;
  function editProduct(id) {
    const products = getProducts();
    const idx = products.findIndex(p => Number(p.id) === Number(id));
    if (idx === -1) return;
    indexCur = idx;
    document.querySelectorAll(".add-product-e").forEach(it => (it.style.display = "none"));
    document.querySelectorAll(".edit-product-e").forEach(it => (it.style.display = "block"));
    document.querySelector(".add-product")?.classList.add("open");
    const p = products[idx];
    document.querySelector(".upload-image-preview").src = p.img || "../Img/blank-image.png";
    document.getElementById("ten-mon").value = p.title || "";
    document.getElementById("gia-moi").value = p.price || "";
    document.getElementById("mo-ta").value = p.desc || "";
    document.getElementById("chon-mon").value = p.category || "Món chay";
  }

  // update product
  const btnUpdateProductIn = document.getElementById("update-product-button");
  if (btnUpdateProductIn) btnUpdateProductIn.addEventListener("click", (e) => {
    e.preventDefault();
    const products = getProducts();
    if (indexCur < 0 || indexCur >= products.length) return;
    const cur = products[indexCur];
    const imgProductCur = getPathImage(document.querySelector(".upload-image-preview")?.src);
    const titleProductCur = document.getElementById("ten-mon")?.value || "";
    const curProductCur = document.getElementById("gia-moi")?.value || "";
    const descProductCur = document.getElementById("mo-ta")?.value || "";
    const categoryText = document.getElementById("chon-mon")?.value || "";
    if (imgProductCur !== cur.img || titleProductCur !== cur.title || String(curProductCur) !== String(cur.price) || descProductCur !== cur.desc || categoryText !== cur.category) {
      const product = { id: cur.id, title: titleProductCur, img: imgProductCur, category: categoryText, price: Number(curProductCur), desc: descProductCur, status: 1 };
      products.splice(indexCur, 1, product);
      setProducts(products);
      toast({ title: "Success", message: "Sửa sản phẩm thành công!", type: "success", duration: 3000 });
      setDefaultValue();
      document.querySelector(".add-product")?.classList.remove("open");
      showProduct();
    } else {
      toast({ title: "Warning", message: "Sản phẩm của bạn không thay đổi!", type: "warning", duration: 3000 });
    }
  });

  // add product
  const btnAddProductIn = document.getElementById("add-product-button");
  if (btnAddProductIn) btnAddProductIn.addEventListener("click", (e) => {
    e.preventDefault();
    const imgProduct = getPathImage(document.querySelector(".upload-image-preview")?.src);
    const tenMon = document.getElementById("ten-mon")?.value || "";
    const price = document.getElementById("gia-moi")?.value || "";
    const moTa = document.getElementById("mo-ta")?.value || "";
    const categoryText = document.getElementById("chon-mon")?.value || "";
    if (!tenMon || !price || !moTa) { toast({ title: "Chú ý", message: "Vui lòng nhập đầy đủ thông tin món!", type: "warning", duration: 3000 }); return; }
    if (isNaN(price)) { toast({ title: "Chú ý", message: "Giá phải ở dạng số!", type: "warning", duration: 3000 }); return; }
    const products = getProducts();
    const product = { id: createId(products), title: tenMon, img: imgProduct, category: categoryText, price: Number(price), desc: moTa, status: 1 };
    products.unshift(product);
    setProducts(products);
    showProduct();
    document.querySelector(".add-product")?.classList.remove("open");
    toast({ title: "Success", message: "Thêm sản phẩm thành công!", type: "success", duration: 3000 });
    setDefaultValue();
  });

  // modal controls
  document.querySelectorAll(".modal-close.product-form").forEach(btn => btn.addEventListener("click", () => setDefaultValue()));
  function setDefaultValue() {
    document.querySelector(".upload-image-preview").src = "../Img/blank-image.png";
    document.getElementById("ten-mon").value = "";
    document.getElementById("gia-moi").value = "";
    document.getElementById("mo-ta").value = "";
    document.getElementById("chon-mon").value = "Món chay";
    indexCur = -1;
  }
  const btnAddProduct = document.getElementById("btn-add-product");
  if (btnAddProduct) btnAddProduct.addEventListener("click", () => {
    document.querySelectorAll(".add-product-e").forEach(it => it.style.display = "block");
    document.querySelectorAll(".edit-product-e").forEach(it => it.style.display = "none");
    document.querySelector(".add-product")?.classList.add("open");
  });
  const closePopup = document.querySelectorAll(".modal-close");
  const modalPopup = document.querySelectorAll(".modal");
  for (let i = 0; i < closePopup.length; i++) (function (ii) { closePopup[ii].onclick = () => { if (modalPopup[ii]) modalPopup[ii].classList.remove("open"); }; })(i);

  // upload preview
  window.uploadImage = function (input) {
    if (!input || !input.files || !input.files[0]) return;
    const file = input.files[0];
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = function (e) { const img = document.querySelector(".upload-image-preview"); if (img) img.src = e.target.result; };
    reader.readAsDataURL(file);
  };

  // events: search / filter / cancel
  document.querySelector(".admin-control-left select")?.addEventListener("change", () => { currentPage = 1; showProduct(); });
  document.querySelector(".form-search")?.addEventListener("submit", (e) => { e.preventDefault(); currentPage = 1; showProduct(); });
  document.querySelector(".form-search-input")?.addEventListener("input", () => { currentPage = 1; });
  document.getElementById("btn-cancel-product")?.addEventListener("click", cancelSearchProduct);

  // expose some functions used inline in HTML
  window.deleteProduct = deleteProduct;
  window.editProduct = editProduct;
  window.changeStatusProduct = changeStatusProduct;
  window.cancelSearchProduct = cancelSearchProduct;
  window.getPathImage = getPathImage;

})();
