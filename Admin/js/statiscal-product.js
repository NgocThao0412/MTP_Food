/*
 * =========================================
 * CHỈ BAO GỒM JAVASCRIPT CHO TRANG THỐNG KÊ
 * =========================================
 */

// ---------------------------------
// HÀM TIỆN ÍCH
// ---------------------------------

/**
 * Định dạng số sang tiền tệ VND.
 * @param {number} price - Số tiền cần định dạng.
 */
function vnd(price) {
    if (typeof price !== 'number') {
        price = 0;
    }
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

/**
 * Định dạng đối tượng Date sang chuỗi "dd/mm/yyyy".
 * @param {string | Date} date - Ngày cần định dạng.
 */
function formatDate(date) {
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return dd + "/" + mm + "/" + yyyy;
}

// ---------------------------------
// CÁC HÀM XỬ LÝ DỮ LIỆU THỐNG KÊ
// ---------------------------------

/**
 * Tạo một mảng đối tượng thô để thống kê từ localStorage.
 * Hợp nhất dữ liệu từ 'order', 'products', và 'orderDetails'.
 */
function createObj() {
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : [];
    let result = [];

    orderDetails.forEach(item => {
        // Lấy thông tin sản phẩm
        let prod = products.find(product => { return product.id == item.id; });
        
        // Chỉ thêm vào mảng nếu sản phẩm tồn tại
        if(prod) {
            let obj = new Object();
            obj.id = item.id;
            obj.madon = item.madon;
            obj.price = item.price;
            obj.quantity = item.soluong;
            obj.category = prod.category;
            obj.title = prod.title;
            obj.img = prod.img;
            // Lấy thời gian đặt hàng từ đơn hàng
            obj.time = (orders.find(order => order.id == item.madon)).thoigiandat;
            result.push(obj);
        }
    });
    return result;
}

/**
 * Gộp các đối tượng trùng lặp (theo ID sản phẩm) lại và tính tổng.
 * @param {Array} arr - Mảng dữ liệu thô từ createObj().
 */
function mergeObjThongKe(arr) {
    let result = [];
    arr.forEach(item => {
        let check = result.find(i => i.id == item.id) // Không tìm thấy gì trả về undefined

        if (check) {
            check.quantity = parseInt(check.quantity) + parseInt(item.quantity);
            check.doanhthu += parseInt(item.price) * parseInt(item.quantity);
        } else {
            // Dùng spread (...) để tạo bản sao, tránh tham chiếu
            const newItem = { ...item }; 
            newItem.doanhthu = newItem.price * newItem.quantity;
            result.push(newItem);
        }
    });
    return result;
}

// ---------------------------------
// CÁC HÀM HIỂN THỊ (RENDER)
// ---------------------------------

/**
 * Hiển thị 3 thẻ tổng quan (KPIs)
 * @param {Array} arr - Mảng đã được gộp (từ mergeObjThongKe).
 */
function showOverview(arr) {
    // Giả sử ID của các thẻ là:
    // quantity-product: Sản phẩm được bán ra
    // quantity-order: Số lượng bán ra
    // quantity-sale: Doanh thu
    document.getElementById("quantity-product").innerText = arr.length;
    document.getElementById("quantity-order").innerText = arr.reduce((sum, cur) => (sum + parseInt(cur.quantity)), 0);
    document.getElementById("quantity-sale").innerText = vnd(arr.reduce((sum, cur) => (sum + parseInt(cur.doanhthu)), 0));
}

/**
 * Hiển thị bảng chi tiết các đơn hàng cho một sản phẩm (khi click "Chi tiết").
 * @param {Array} arr - Mảng dữ liệu thô (từ createObj).
 * @param {string|number} id - ID của sản phẩm cần xem chi tiết.
 */
function detailOrderProduct(arr, id) {
    let orderHtml = "";
    arr.forEach(item => {
        if (item.id == id) {
            orderHtml += `<tr>
            <td>${item.madon}</td>
            <td>${item.quantity}</td>
            <td>${vnd(item.price)}</td>
            <td>${formatDate(item.time)}</td>
            </tr>`;
        }
    });
    // Giả sử bảng chi tiết nằm trong modal có ID 'show-product-order-detail'
    document.getElementById("show-product-order-detail").innerHTML = orderHtml
    // Giả sử modal có class '.modal.detail-order-product'
    document.querySelector(".modal.detail-order-product").classList.add("open")
}

/**
 * Hiển thị bảng thống kê chính.
 * @param {Array} arr - Mảng dữ liệu thô (từ createObj hoặc đã lọc).
 * @param {number} mode - Chế độ (0: default, 1: sort asc, 2: sort desc).
 */
function showThongKe(arr, mode) {
    let orderHtml = "";
    let mergeObj = mergeObjThongKe(arr);
    
    // Cập nhật 3 thẻ KPI
    showOverview(mergeObj);

    // Xử lý các chế độ (sắp xếp, reset)
    switch (mode) {
        case 0: // Reset bộ lọc
            mergeObj = mergeObjThongKe(createObj());
            showOverview(mergeObj);
            document.getElementById("the-loai-tk").value = "Tất cả";
            document.getElementById("form-search-tk").value = "";
            document.getElementById("time-start-tk").value = "";
            document.getElementById("time-end-tk").value = "";
            break;
        case 1: // Sắp xếp SL tăng dần
            mergeObj.sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity))
            break;
        case 2: // Sắp xếp SL giảm dần
            mergeObj.sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity))
            break;
    }

    // Render bảng
    if (mergeObj.length === 0) {
        orderHtml = `<tr><td colspan="5" style="text-align: center;">Không có dữ liệu</td></tr>`;
    } else {
        for (let i = 0; i < mergeObj.length; i++) {
            orderHtml += `
            <tr>
            <td>${i + 1}</td>
            <td><div class="prod-img-title"><img class="prd-img-tbl" src="${mergeObj[i].img}" alt=""><p>${mergeObj[i].title}</p></div></td>
            <td>${mergeObj[i].quantity}</td>
            <td>${vnd(mergeObj[i].doanhthu)}</td>
            <td><button class="btn-detail product-order-detail" data-id="${mergeObj[i].id}"><i class="fa-regular fa-eye"></i> Chi tiết</button></td>
            </tr>`;
        }
    }
    
    // Giả sử tbody của bảng thống kê có ID 'showTk'
    document.getElementById("showTk").innerHTML = orderHtml;

    // Gắn sự kiện click "Chi tiết" cho các nút vừa render
    document.querySelectorAll(".product-order-detail").forEach(item => {
        let idProduct = item.getAttribute("data-id");
        item.addEventListener("click", () => {
            // 'arr' ở đây là mảng gốc (chưa gộp) được truyền vào
            detailOrderProduct(arr, idProduct);
        })
    })
}

// ---------------------------------
// HÀM LỌC CHÍNH (GẮN VÀO SỰ KIỆN)
// ---------------------------------

/**
 * Hàm chính để lọc dữ liệu, được gọi bởi các input/button.
 * @param {number} mode - Chế độ (0: reset, 1: sort asc, 2: sort desc).
 */
function thongKe(mode) {
    // Lấy giá trị từ các bộ lọc
    let categoryTk = document.getElementById("the-loai-tk").value;
    let ct = document.getElementById("form-search-tk").value;
    let timeStart = document.getElementById("time-start-tk").value;
    let timeEnd = document.getElementById("time-end-tk").value;

    if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
        alert("Lựa chọn thời gian sai !");
        return;
    }

    let arrDetail = createObj(); // Lấy tất cả dữ liệu gốc
    let result = arrDetail;

    // Lọc theo danh mục
    result = categoryTk == "Tất cả" ? result : result.filter((item) => {
        return item.category == categoryTk;
    });

    // Lọc theo tên tìm kiếm
    result = ct == "" ? result : result.filter((item) => {
        return (item.title.toLowerCase().includes(ct.toLowerCase()));
    });

    // Lọc theo ngày
    if (timeStart != "" && timeEnd == "") {
        result = result.filter((item) => {
            return new Date(item.time) >= new Date(timeStart).setHours(0, 0, 0);
        });
    } else if (timeStart == "" && timeEnd != "") {
        result = result.filter((item) => {
            return new Date(item.time) <= new Date(timeEnd).setHours(23, 59, 59);
        });
    } else if (timeStart != "" && timeEnd != "") {
        result = result.filter((item) => {
            return (new Date(item.time) >= new Date(timeStart).setHours(0, 0, 0) && new Date(item.time) <= new Date(timeEnd).setHours(23, 59, 59)
            );
        });
    }
    
    // Hiển thị kết quả đã lọc
    showThongKe(result, mode);
}


// ---------------------------------
// KHỞI CHẠY LẦN ĐẦU
// ---------------------------------

// Hiển thị toàn bộ thống kê khi tải trang
showThongKe(createObj());