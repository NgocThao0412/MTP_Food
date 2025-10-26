const PHIVANCHUYEN = 30000;
let priceFinal = document.getElementById("checkout-cart-price-final");
// Trang thanh toan
function thanhtoanpage(option,product) {
    // Xu ly ngay nhan hang
    let today = new Date();
    let ngaymai = new Date();
    let ngaykia = new Date();
    ngaymai.setDate(today.getDate() + 1);
    ngaykia.setDate(today.getDate() + 2);
    let dateorderhtml = `<a href="javascript:;" class="pick-date active" data-date="${today}">
        <span class="text">Hôm nay</span>
        <span class="date">${today.getDate()}/${today.getMonth() + 1}</span>
        </a>
        <a href="javascript:;" class="pick-date" data-date="${ngaymai}">
            <span class="text">Ngày mai</span>
            <span class="date">${ngaymai.getDate()}/${ngaymai.getMonth() + 1}</span>
        </a>

        <a href="javascript:;" class="pick-date" data-date="${ngaykia}">
            <span class="text">Ngày kia</span>
            <span class="date">${ngaykia.getDate()}/${ngaykia.getMonth() + 1}</span>
    </a>`
    document.querySelector('.date-order').innerHTML = dateorderhtml;
    let pickdate = document.getElementsByClassName('pick-date')
    for(let i = 0; i < pickdate.length; i++) {
        pickdate[i].onclick = function () {
            document.querySelector(".pick-date.active").classList.remove("active");
            this.classList.add('active');
        }
    }

    let totalBillOrder = document.querySelector('.total-bill-order');
    let totalBillOrderHtml;
    // Xu ly don hang
    switch (option) {
        case 1: // Truong hop thanh toan san pham trong gio
            // Hien thi don hang
            showProductCart();
            // Tinh tien
            totalBillOrderHtml = `<div class="priceFlx">
            <div class="text">
                Tiền hàng 
                <span class="count">${getAmountCart()} món</span>
            </div>
            <div class="price-detail">
                <span id="checkout-cart-total">${vnd(getCartTotal())}</span>
            </div>
        </div>
        <div class="priceFlx chk-ship">
            <div class="text">Phí vận chuyển</div>
            <div class="price-detail chk-free-ship">
                <span>${vnd(PHIVANCHUYEN)}</span>
            </div>
        </div>`;
            // Tong tien
            priceFinal.innerText = vnd(getCartTotal() + PHIVANCHUYEN);
            break;
        case 2: // Truong hop mua ngay
            // Hien thi san pham
            showProductBuyNow(product);
            // Tinh tien
            totalBillOrderHtml = `<div class="priceFlx">
                <div class="text">
                    Tiền hàng 
                    <span class="count">${product.soluong} món</span>
                </div>
                <div class="price-detail">
                    <span id="checkout-cart-total">${vnd(product.soluong * product.price)}</span>
                </div>
            </div>
            <div class="priceFlx chk-ship">
                <div class="text">Phí vận chuyển</div>
                <div class="price-detail chk-free-ship">
                    <span>${vnd(PHIVANCHUYEN)}</span>
                </div>
            </div>`
            // Tong tien
            priceFinal.innerText = vnd((product.soluong * product.price) + PHIVANCHUYEN);
            break;
    }

    // Tinh tien
    totalBillOrder.innerHTML = totalBillOrderHtml;

    // Xu ly hinh thuc giao hang
    let giaotannoi = document.querySelector('#giaotannoi');
    let tudenlay = document.querySelector('#tudenlay');
    let tudenlayGroup = document.querySelector('#tudenlay-group');
    let chkShip = document.querySelectorAll(".chk-ship");
    
    tudenlay.addEventListener('click', () => {
        giaotannoi.classList.remove("active");
        tudenlay.classList.add("active");
        chkShip.forEach(item => {
            item.style.display = "none";
        });
        tudenlayGroup.style.display = "block";
        switch (option) {
            case 1:
                priceFinal.innerText = vnd(getCartTotal());
                break;
            case 2:
                priceFinal.innerText = vnd((product.soluong * product.price));
                break;
        }
    })

    giaotannoi.addEventListener('click', () => {
        tudenlay.classList.remove("active");
        giaotannoi.classList.add("active");
        tudenlayGroup.style.display = "none";
        chkShip.forEach(item => {
            item.style.display = "flex";
        });
        switch (option) {
            case 1:
                priceFinal.innerText = vnd(getCartTotal() + PHIVANCHUYEN);
                break;
            case 2:
                priceFinal.innerText = vnd((product.soluong * product.price) + PHIVANCHUYEN);
                break;
        }
    })

    // ✅ BỔ SUNG: phần chọn hình thức thanh toán
    let paymentHTML = `
        <div class="payment-method">
            <h4>Hình thức thanh toán</h4>
            <label><input type="radio" name="payment-method" value="Tiền mặt" checked> Tiền mặt khi nhận hàng (mặc định)</label><br>
            <label><input type="radio" name="payment-method" value="Chuyển khoản"> Chuyển khoản ngân hàng</label><br>
            <label><input type="radio" name="payment-method" value="Trực tuyến"> Thanh toán trực tuyến</label>
        </div>
    `;
    document.querySelector('.payment-section').innerHTML = paymentHTML;

    // ✅ BỔ SUNG: phần chọn địa chỉ nhận hàng
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let addressSection = `
        <div class="address-section">
            <h4>Địa chỉ nhận hàng</h4>
            <label><input type="radio" name="address-option" value="saved" checked> Dùng địa chỉ đã lưu (${currentUser?.address || 'Chưa có'})</label><br>
            <label><input type="radio" name="address-option" value="new"> Nhập địa chỉ mới</label>
            <input type="text" id="new-address" placeholder="Nhập địa chỉ giao hàng mới" style="display:none; margin-top:5px; width:100%;">
        </div>
    `;
    document.querySelector('.address-choice').innerHTML = addressSection;

    let radioAddress = document.getElementsByName("address-option");
    radioAddress.forEach(r => {
        r.addEventListener('change', () => {
            let newAddr = document.getElementById("new-address");
            if (r.value === "new" && r.checked) {
                newAddr.style.display = "block";
            } else {
                newAddr.style.display = "none";
            }
        });
    });

    // Su kien khi nhan nut dat hang
    document.querySelector(".complete-checkout-btn").onclick = () => {
        switch (option) {
            case 1:
                xulyDathang();
                break;
            case 2:
                xulyDathang(product);
                break;
        }
    }
}

// Hien thi hang trong gio
function showProductCart() {
    let currentuser = JSON.parse(localStorage.getItem('currentuser'));
    let listOrder = document.getElementById("list-order-checkout");
    let listOrderHtml = '';
    currentuser.cart.forEach(item => {
        let product = getProduct(item);
        listOrderHtml += `<div class="food-total">
        <div class="count">${product.soluong}x</div>
        <div class="info-food">
            <div class="name-food">${product.title}</div>
        </div>
    </div>`
    })
    listOrder.innerHTML = listOrderHtml;
}

// Hien thi hang mua ngay
function showProductBuyNow(product) {
    let listOrder = document.getElementById("list-order-checkout");
    let listOrderHtml = `<div class="food-total">
        <div class="count">${product.soluong}x</div>
        <div class="info-food">
            <div class="name-food">${product.title}</div>
        </div>
    </div>`;
    listOrder.innerHTML = listOrderHtml;
}

//Open Page Checkout
let nutthanhtoan = document.querySelector('.thanh-toan')
let checkoutpage = document.querySelector('.checkout-page');
nutthanhtoan.addEventListener('click', () => {
    checkoutpage.classList.add('active');
    thanhtoanpage(1);
    closeCart();
    body.style.overflow = "hidden"
})

// Đặt hàng ngay
function dathangngay() {
    let productInfo = document.getElementById("product-detail-content");
    let datHangNgayBtn = productInfo.querySelector(".button-dathangngay");
    datHangNgayBtn.onclick = () => {
        if(localStorage.getItem('currentuser')) {
            let productId = datHangNgayBtn.getAttribute("data-product");
            let soluong = parseInt(productInfo.querySelector(".buttons_added .input-qty").value);
            let notevalue = productInfo.querySelector("#popup-detail-note").value;
            let ghichu = notevalue == "" ? "Không có ghi chú" : notevalue;
            let products = JSON.parse(localStorage.getItem('products'));
            let a = products.find(item => item.id == productId);
            a.soluong = parseInt(soluong);
            a.note = ghichu;
            checkoutpage.classList.add('active');
            thanhtoanpage(2,a);
            closeCart();
            body.style.overflow = "hidden"
        } else {
            toast({ title: 'Warning', message: 'Chưa đăng nhập tài khoản !', type: 'warning', duration: 3000 });
        }
    }
}

// Close Page Checkout
function closecheckout() {
    checkoutpage.classList.remove('active');
    body.style.overflow = "auto"
}

// Thong tin cac don hang da mua - Xu ly khi nhan nut dat hang
function xulyDathang(product) {
    let diachinhan = "";
    let hinhthucgiao = "";
    let thoigiangiao = "";
    let giaotannoi = document.querySelector("#giaotannoi");
    let tudenlay = document.querySelector("#tudenlay");
    let giaongay = document.querySelector("#giaongay");
    let giaovaogio = document.querySelector("#deliverytime");
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));

    // ✅ BỔ SUNG: lấy hình thức thanh toán
    let paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    // ✅ BỔ SUNG: lấy địa chỉ nhận hàng từ phần chọn
    let selectedAddressType = document.querySelector('input[name="address-option"]:checked').value;
    if (selectedAddressType === "saved") {
        diachinhan = currentUser.address || "";
    } else {
        diachinhan = document.getElementById("new-address").value;
    }

    // Hinh thuc giao & Dia chi nhan hang
    if(giaotannoi.classList.contains("active")) {
        if(diachinhan === "") diachinhan = document.querySelector("#diachinhan").value;
        hinhthucgiao = giaotannoi.innerText;
    }
    if(tudenlay.classList.contains("active")){
        let chinhanh1 = document.querySelector("#chinhanh-1");
        let chinhanh2 = document.querySelector("#chinhanh-2");
        if(chinhanh1.checked) {
            diachinhan = "273 An Dương Vương, Phường 3, Quận 5";
        }
        if(chinhanh2.checked) {
            diachinhan = "04 Tôn Đức Thắng, Phường Bến Nghé, Quận 1";
        }
        hinhthucgiao = tudenlay.innerText;
    }

    // Thoi gian nhan hang
    if(giaongay.checked) {
        thoigiangiao = "Giao ngay khi xong";
    }

    if(giaovaogio.checked) {
        thoigiangiao = document.querySelector(".choise-time").value;
    }

    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : [];
    let order = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let madon = createId(order);
    let tongtien = 0;
    if(product == undefined) {
        currentUser.cart.forEach(item => {
            item.madon = madon;
            item.price = getpriceProduct(item.id);
            tongtien += item.price * item.soluong;
            orderDetails.push(item);
        });
    } else {
        product.madon = madon;
        product.price = getpriceProduct(product.id);
        tongtien += product.price * product.soluong;
        orderDetails.push(product);
    }   
    
    let tennguoinhan = document.querySelector("#tennguoinhan").value;
    let sdtnhan = document.querySelector("#sdtnhan").value

    if(tennguoinhan == "" || sdtnhan == "" || diachinhan == "") {
        toast({ title: 'Chú ý', message: 'Vui lòng nhập đầy đủ thông tin !', type: 'warning', duration: 4000 });
    } else {
        let donhang = {
            id: madon,
            khachhang: currentUser.phone,
            hinhthucgiao: hinhthucgiao,
            ngaygiaohang: document.querySelector(".pick-date.active").getAttribute("data-date"),
            thoigiangiao: thoigiangiao,
            ghichu: document.querySelector(".note-order").value,
            tenguoinhan: tennguoinhan,
            sdtnhan: sdtnhan,
            diachinhan: diachinhan,
            thoigiandat: new Date(),
            tongtien:tongtien,
            trangthai: 0,
            payment: paymentMethod // ✅ BỔ SUNG: lưu hình thức thanh toán
        }
    
        order.unshift(donhang);
        if(product == null) {
            currentUser.cart.length = 0;
        }
    
        localStorage.setItem("order",JSON.stringify(order));
        localStorage.setItem("currentuser",JSON.stringify(currentUser));
        localStorage.setItem("orderDetails",JSON.stringify(orderDetails));
        toast({ title: 'Thành công', message: 'Đặt hàng thành công !', type: 'success', duration: 1000 });
        setTimeout((e)=>{
            window.location = "/";
        },2000);  
    }
}

function getpriceProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    let sp = products.find(item => {
        return item.id == id;
    })
    return sp.price;
}

// ✅ BỔ SUNG: xem lại đơn hàng đã mua
function xemDonHangDaMua() {
    let orders = JSON.parse(localStorage.getItem("order")) || [];
    let html = "<h3>Đơn hàng đã mua</h3>";
    if (orders.length === 0) {
        html += "<p>Chưa có đơn hàng nào.</p>";
    } else {
        orders.forEach(o => {
            html += `
                <div class="order-item">
                    <p><b>Mã đơn:</b> ${o.id}</p>
                    <p><b>Người nhận:</b> ${o.tenguoinhan}</p>
                    <p><b>Địa chỉ:</b> ${o.diachinhan}</p>
                    <p><b>Tổng tiền:</b> ${vnd(o.tongtien)}</p>
                    <p><b>Thanh toán:</b> ${o.payment}</p>
                    <hr>
                </div>`;
        });
    }
    document.querySelector(".order-history").innerHTML = html;
}
// === CÁC HÀM BỔ SUNG CHO CHECKOUT ===

// Định dạng tiền VNĐ
function vnd(price) {
    if (!price || isNaN(price)) price = 0;
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// Tính tổng tiền giỏ hàng
function getCartTotal() {
    let currentuser = JSON.parse(localStorage.getItem("currentuser"));
    if (!currentuser || !currentuser.cart) return 0;
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let total = 0;
    currentuser.cart.forEach(item => {
        let sp = products.find(p => p.id == item.id);
        if (sp) total += sp.price * item.soluong;
    });
    return total;
}

// Đếm số lượng sản phẩm trong giỏ
function getAmountCart() {
    let currentuser = JSON.parse(localStorage.getItem("currentuser"));
    if (!currentuser || !currentuser.cart) return 0;
    return currentuser.cart.reduce((sum, i) => sum + i.soluong, 0);
}

// Lấy thông tin sản phẩm từ giỏ hàng
function getProduct(cartItem) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let p = products.find(sp => sp.id == cartItem.id);
    return {
        ...p,
        soluong: cartItem.soluong,
        note: cartItem.note || "Không có ghi chú"
    };
}

// Tạo mã đơn hàng ngẫu nhiên
function createId(orderArr) {
    let id;
    do {
        id = "DH" + Math.floor(100000 + Math.random() * 900000);
    } while (orderArr.find(o => o.id === id));
    return id;
}

// Đóng giỏ hàng (nếu có phần giao diện giỏ hàng)
function closeCart() {
    let cart = document.querySelector(".cart");
    if (cart) cart.classList.remove("active");
}
