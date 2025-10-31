function showToast(status, title, message) {
    // Lưu ý: Đảm bảo có một element với ID là 'successToast' trong HTML
    const toast = document.getElementById('successToast');

    if (!toast) {
        console.error("Lỗi: Không tìm thấy phần tử Toast Notification (ID: successToast).");
        alert(`${title}: ${message}`); // Dùng alert dự phòng nếu không tìm thấy Toast HTML
        return;
    }

    const toastTitle = toast.querySelector('.toast-title');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    // 1. Cập nhật nội dung và kiểu dáng
    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;

    // Reset các class và style
    toast.classList.remove('success-toast', 'error-toast', 'show');
    if (toastIcon) toastIcon.classList.remove('fa-check-circle', 'fa-times-circle');

    // Đặt kiểu dáng và icon theo status
    if (status === 'success') {
        toast.classList.add('success-toast');
        if (toastIcon) {
            toastIcon.classList.add('fa-check-circle');
            toastIcon.style.color = '#2ecc71';
            toast.style.borderLeftColor = '#2ecc71';
        }
    } else if (status === 'error') {
        toast.classList.add('error-toast');
        if (toastIcon) {
            toastIcon.classList.add('fa-times-circle');
            toastIcon.style.color = '#e74c3c';
            toast.style.borderLeftColor = '#e74c3c';
        }
    }

    // 2. Hiển thị Toast
    toast.style.display = 'flex';

    // 3. Kích hoạt animation trượt vào
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // 4. Tự động ẩn sau 4 giây
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300); // Đợi animation ẩn hoàn tất
    }, 4000);
}

// Hàm định dạng tiền tệ (Sử dụng chung)
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' đ';
}


document.addEventListener('DOMContentLoaded', function () {
    // ======================================================
    // 💰 KHAI BÁO GIÁ TRỊ VÀ PHẦN TỬ CẦN THAO TÁC
    // ======================================================
    const SUB_TOTAL = 319000;   // Tiền hàng (Lẩu Thái)
    const SHIPPING_FEE = 30000; // Phí vận chuyển
    
    // Lấy các phần tử HTML cần dùng
    const deliveryOptions = document.querySelectorAll('input[name="delivery_option"]');
    const shippingFeeArea = document.getElementById('shipping_fee_area');
    const deliveryDateArea = document.getElementById('delivery_date_area');
    const deliveryDateInput = document.getElementById("delivery_date");
    const pickupLocationArea = document.getElementById('pickup_location_area');
    const totalPriceDisplay = document.querySelector('.total-price'); // Phần tử hiển thị Tổng tiền
    const btn = document.querySelector('.submit-btn');

    // ======================================================
    // 🚚 XỬ LÝ HÌNH THỨC GIAO HÀNG (QUAN TRỌNG: TÍNH LẠI TỔNG TIỀN)
    // ======================================================
    function handleDeliveryOptionChange() {
        const selectedOption = document.querySelector('input[name="delivery_option"]:checked').value;
        let newTotalPrice = SUB_TOTAL; // Giá trị ban đầu là tiền hàng

        if (selectedOption === 'pickup') {
            // TỰ ĐẾN LẤY
            shippingFeeArea.style.display = 'none'; // Ẩn phí vận chuyển
            deliveryDateArea.style.display = 'none'; // Ẩn ngày giao hàng (vì là lấy tại chi nhánh)
            deliveryDateInput.removeAttribute('required');
            pickupLocationArea.style.display = 'block';
            
            // Cập nhật tổng tiền: Tiền hàng + 0
            newTotalPrice = SUB_TOTAL; 
        } else if (selectedOption === 'ship') {
            // GIAO TẬN NƠI
            shippingFeeArea.style.display = 'flex'; // Hiển thị phí vận chuyển
            deliveryDateArea.style.display = 'block';
            deliveryDateInput.setAttribute('required', 'required');
            pickupLocationArea.style.display = 'none';
            
            // Cập nhật tổng tiền: Tiền hàng + Phí vận chuyển
            newTotalPrice = SUB_TOTAL + SHIPPING_FEE;
        }
        
        // CẬP NHẬT TỔNG TIỀN VÀO GIAO DIỆN
        if (totalPriceDisplay) {
            totalPriceDisplay.textContent = formatCurrency(newTotalPrice);
        }
    }
    
    // Gắn hàm ra global scope (cho onclick trong HTML gọi được)
    window.handleDeliveryOptionChange = handleDeliveryOptionChange;

    // ---------------------------
    // Khởi tạo và Sự kiện thay đổi hình thức giao hàng
    // ---------------------------
    deliveryOptions.forEach(radio => {
        radio.addEventListener('change', handleDeliveryOptionChange);
    });
    // Chạy lần đầu để thiết lập trạng thái và tổng tiền ban đầu (thường là 'ship')
    handleDeliveryOptionChange(); 

    // ======================================================
    // 📅 XỬ LÝ CHỌN NGÀY GIAO HÀNG
    // ======================================================
    const dateButtons = document.querySelectorAll('.date-buttons .toggle-btn');
    const deliveryDate = document.getElementById('delivery_date');

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    dateButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Bỏ class active ở tất cả nút
            dateButtons.forEach(btn => btn.classList.remove('active'));
            // Thêm class active vào nút được chọn
            button.classList.add('active');

            // Tính ngày tương ứng
            const today = new Date();
            today.setDate(today.getDate() + index); 

            // Gán vào input date (ẩn)
            deliveryDate.value = formatDate(today);
            console.log("Đã chọn ngày giao hàng:", deliveryDate.value);
        });
    });

    // Khi trang load lần đầu, tự set "Hôm nay"
    if (dateButtons.length > 0) {
        const today = new Date();
        deliveryDate.value = formatDate(today);
    }

    // ======================================================
    // 🔄 XỬ LÝ CẬP NHẬT TRẠNG THÁI NÚT (toggle-btn)
    // ======================================================
    function updateToggleButtons(selectedId) {
        const buttons = document.querySelectorAll('#delivery_option_buttons .toggle-btn');
        buttons.forEach(button => button.classList.remove('active'));

        if (selectedId === 'delivery_ship') {
            document.querySelector('#delivery_option_buttons button:first-child').classList.add('active');
        } else if (selectedId === 'delivery_pickup') {
            document.querySelector('#delivery_option_buttons button:last-child').classList.add('active');
        }
    }
    window.updateToggleButtons = updateToggleButtons; // Gắn ra global scope


    // ======================================================
    // 💳 XỬ LÝ PHƯƠNG THỨC THANH TOÁN
    // ======================================================
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    const creditCardDetails = document.getElementById('credit_card_info');

    function handlePaymentMethodChange() {
        if (creditCardDetails) creditCardDetails.style.display = 'none';

        const selectedValue = document.querySelector('input[name="payment_method"]:checked').value;

        if (selectedValue === 'card') {
            if (creditCardDetails) creditCardDetails.style.display = 'block';
        }
    }

    paymentRadios.forEach(function (radio) {
        radio.addEventListener('change', handlePaymentMethodChange);
    });

    handlePaymentMethodChange(); // Chạy hàm 1 lần khi tải trang

    // ======================================================
    // 👤 XỬ LÝ TỰ ĐỘNG ĐIỀN THÔNG TIN USER
    // ======================================================
    function getCurrentUser() {
        const userStr = localStorage.getItem('UserStr');
        return userStr ? JSON.parse(userStr) : null;
    }

    function autoFillForm() {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        if (currentUser.username) document.getElementById("full_name").value = currentUser.username;
        if (currentUser.phone) document.getElementById("phone").value = currentUser.phone;
        if (currentUser.address) document.getElementById("address").value = currentUser.address;
    }

    autoFillForm(); // chạy ngay khi mở trang
    
    // ======================================================
    // ✅ XỬ LÝ NÚT "ĐẶT HÀNG" (VALIDATION)
    // ======================================================
    btn.addEventListener('click', function (e) {
        e.preventDefault(); // ngăn reload

        const name = document.getElementById("full_name");
        const phone = document.getElementById("phone");
        const address = document.getElementById("address");
        const selectedDeliveryOption = document.querySelector('input[name="delivery_option"]:checked').value;
        const selectedPaymentMethod = document.querySelector('input[name="payment_method"]:checked').value;


        // 🅰️ VALIDATION CHO THÔNG TIN NGƯỜI NHẬN & GIAO HÀNG
        let fields = [
            { field: name, message: "Vui lòng nhập tên người nhận." },
            { field: phone, message: "Vui lòng nhập số điện thoại." },
        ];

        if (selectedDeliveryOption === 'ship') {
            const date = document.querySelector("#delivery_date");
            fields.push(
                { field: address, message: "Vui lòng nhập địa chỉ giao hàng." },
                { field: date, message: "Vui lòng chọn ngày giao hàng." }
            );
        }
        
        // 🅱️ VALIDATION CHO THÔNG TIN THANH TOÁN (NẾU CHỌN THANH TOÁN BẰNG THẺ)
        if (selectedPaymentMethod === 'card') {
            const bankName = document.getElementById("bank_name");
            const cardNumber = document.getElementById("card_number");
            const cardExpiry = document.getElementById("card_expiry");
            const cardCvv = document.getElementById("card_cvv");
            
            fields.push(
                { field: bankName, message: "Vui lòng chọn ngân hàng phát hành thẻ." },
                { field: cardNumber, message: "Vui lòng nhập số thẻ." },
                { field: cardExpiry, message: "Vui lòng nhập ngày hết hạn của thẻ." },
                { field: cardCvv, message: "Vui lòng nhập mã CVV của thẻ." }
            );
        }
        
        // Kiểm tra trường trống
        const emptyFields = fields.filter(({ field }) => field && field.value.trim() === "");

        // Hiển thị lỗi nếu có trường bị bỏ trống
        if (emptyFields.length > 0) {
            showToast('error', 'Lỗi nhập liệu', emptyFields[0].message);
            return;
        }

        // Nếu hợp lệ: 
        showToast('success', 'Thành công', "Đặt hàng thành công!");
    });
});