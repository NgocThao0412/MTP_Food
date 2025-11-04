// ==================== DANH SÁCH SẢN PHẨM ====================
const productList = [
    { id: "SP001", name: "Bột Chiên"},
    { id: "SP002", name: "Nước Ép Dâu Tây"},
    { id: "SP003", name: "Lẩu Thái"},
    { id: "SP004", name: "Gà Luộc"},
];

// ==================== LẤY / LƯU PHIẾU ====================
function getReceipts() {
    return JSON.parse(localStorage.getItem("receipts")) || [];
}
function saveReceipts(data) {
    localStorage.setItem("receipts", JSON.stringify(data));
}

// ==================== KHỞI TẠO PHIẾU CỨNG ====================
function initHardcodedReceipts() {
    const receipts = getReceipts();
    if(receipts.length === 0){
        const hardcoded = [
            {
                id: "NH001",
                date: "2025-11-01",
                supplier: "Cty Lương Thực A",
                products: [
                    {id:"SP001", name:"Bột Chiên", quantity:100},
                    {id:"SP002", name:"Nước Ép Dâu Tây", quantity:250},
                ],
                total: 350,
                notes: "",
                status: "paid"
            },
            {
                id: "NH002",
                date: "2025-10-30",
                supplier: "NCC Tỉnh",
                products: [
                    {id:"SP003", name:"Lẩu Thái", quantity:150},
                    {id:"SP004", name:"Gà Luộc", quantity:50},
                ],
                total: 200,
                notes: "",
                status: "pending"
            }
        ];
        saveReceipts(hardcoded);
    }
}

// ==================== HIỂN THỊ BẢNG PHIẾU ====================
function renderReceiptsTable() {
    const tbody = document.getElementById("receipt-table-body");
    tbody.innerHTML = "";

    const receipts = getReceipts();
    receipts.forEach(r => {
        const tr = document.createElement("tr");

        const isPaid = r.status === 'paid';

        tr.innerHTML = `
            <td>${r.id}</td>
            <td>${r.date}</td>
            <td>${r.products.map(p => `${p.name} (${p.quantity})`).join(", ")}</td>
            <td>${r.total}</td>
            <td>${r.supplier}</td>
            <td>
                <span class="note-status" data-id="${r.id}" style="cursor:pointer; color:${isPaid?'green':'red'}">
                    ${isPaid?'Đã Hoàn Thành':'Chưa Hoàn Thành'}
                </span>
            </td>
            <td>
                <button class="btn-view" data-id="${r.id}">Xem</button>
                <button class="btn-edit" data-id="${r.id}" ${isPaid?'disabled':''}>Sửa</button>
                <button class="btn-delete" data-id="${r.id}" ${isPaid?'disabled':''}>Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);

        // Xem phiếu
        tr.querySelector(".btn-view").onclick = () => {
            alert(`Phiếu ${r.id}\nNgày: ${r.date}\nNCC: ${r.supplier}\nSản phẩm: ${r.products.map(p => `${p.name} (${p.quantity})`).join(", ")}`);
        };

        // Sửa phiếu
        tr.querySelector(".btn-edit").onclick = () => {
            if(!isPaid) editReceipt(r.id);
        };

        // Xóa phiếu
        tr.querySelector(".btn-delete").onclick = () => {
            if(!isPaid && confirm(`Xóa phiếu ${r.id}?`)){
                const newReceipts = getReceipts().filter(x => x.id !== r.id);
                saveReceipts(newReceipts);
                renderReceiptsTable();
            }
        };

        // Đổi trạng thái
        tr.querySelector(".note-status").onclick = () => {
            const receipts = getReceipts();
            const receipt = receipts.find(x => x.id === r.id);
            if(!receipt) return;
            receipt.status = receipt.status === 'pending' ? 'paid' : 'pending';
            saveReceipts(receipts);
            renderReceiptsTable();
        };
    });
}

// ==================== THÊM SẢN PHẨM VÀO PHIẾU ====================
function addProductToForm(product) {
    const container = document.getElementById("productDetailsContainer");
    if(container.querySelector(`[data-id="${product.id}"]`)){
        alert("Sản phẩm đã có trong phiếu!");
        return;
    }

    const div = document.createElement("div");
    div.className = "product-item";
    div.dataset.id = product.id;

    div.innerHTML = `
        <input type="hidden" name="productId" value="${product.id}">
        <input type="text" value="${product.name}" readonly style="width:60%; margin-right:10px;">
        <input type="number" name="quantity" min="1" value="${product.quantity || 1}" class="quantity-input" style="width:20%; margin-right:10px;">
        <button type="button" class="remove-product-btn">Xóa</button>
    `;
    container.appendChild(div);

    div.querySelector(".remove-product-btn").onclick = () => {
        div.remove();
        updateTotalQuantity();
    };
    div.querySelector(".quantity-input").addEventListener("input", updateTotalQuantity);
    updateTotalQuantity();
}

// ==================== CẬP NHẬT TỔNG SỐ LƯỢNG ====================
function updateTotalQuantity() {
    const total = [...document.querySelectorAll("#productDetailsContainer .quantity-input")]
        .reduce((sum, el) => sum + Number(el.value), 0);
    document.getElementById("totalQuantityInput").value = total;
}

// ==================== TẠO / CẬP NHẬT PHIẾU ====================
function createOrUpdateReceipt(e){
    e.preventDefault();
    const form = e.target;
    const receipts = getReceipts();

    const idField = document.getElementById("receiptId");
    const isEdit = idField.value !== "[Tự động tạo]";
    const id = isEdit ? idField.value : "NH" + String(receipts.length + 1).padStart(3, "0");

    const supplier = document.getElementById("supplier").value;
    const date = document.getElementById("importDate").value;
    const notes = document.getElementById("notes").value;

    const products = [...document.querySelectorAll("#productDetailsContainer .product-item")].map(p => {
        return {
            id: p.querySelector("input[name='productId']").value,
            name: p.querySelector("input[type='text']").value,
            quantity: Number(p.querySelector(".quantity-input").value)
        };
    });

    const total = products.reduce((sum,p)=>sum+p.quantity,0);

    if(isEdit){
        const receipt = receipts.find(r=>r.id===id);
        if(receipt){
            receipt.supplier = supplier;
            receipt.date = date;
            receipt.notes = notes;
            receipt.products = products;
            receipt.total = total;
        }
    } else {
        receipts.push({ id, supplier, date, notes, products, total, status:"pending" });
    }

    saveReceipts(receipts);
    alert(isEdit ? "Cập nhật phiếu thành công!" : "Đã lưu phiếu mới!");

    // Reset form
    form.reset();
    document.getElementById("receiptId").value = "[Tự động tạo]";
    document.getElementById("productDetailsContainer").innerHTML = "";
    updateTotalQuantity();
    renderReceiptsTable();
}

// ==================== SỬA PHIẾU ====================
function editReceipt(id){
    const receipt = getReceipts().find(r=>r.id===id);
    if(!receipt) return;
    if(receipt.status==='paid'){ alert("Không thể sửa phiếu đã hoàn thành!"); return; }

    document.getElementById("receiptId").value = receipt.id;
    document.getElementById("supplier").value = receipt.supplier;
    document.getElementById("importDate").value = receipt.date;
    document.getElementById("notes").value = receipt.notes;

    const container = document.getElementById("productDetailsContainer");
    container.innerHTML = "";
    receipt.products.forEach(p => addProductToForm(p));
}

// ==================== TÌM KIẾM SẢN PHẨM ====================
function searchAndAddProduct(){
    const keyword = document.getElementById("productSearchInput").value.toLowerCase();
    const resultsContainer = document.getElementById("productSearchResults");
    resultsContainer.innerHTML = "";

    const filtered = productList.filter(p => p.name.toLowerCase().includes(keyword) || p.id.toLowerCase().includes(keyword));

    filtered.forEach(p=>{
        const div = document.createElement("div");
        div.className = "search-result-item";
        div.textContent = `${p.name} (${p.id})`;
        div.style.cursor = "pointer";
        div.onclick = () => {
            let qty = prompt(`Nhập số lượng cho sản phẩm "${p.name}":`, 1);
            if(qty === null) return;
            qty = Number(qty);
            if(isNaN(qty) || qty<=0){
                alert("Số lượng không hợp lệ!");
                return;
            }
            addProductToForm({id:p.id,name:p.name,quantity:qty});
            resultsContainer.innerHTML = "";
            document.getElementById("productSearchInput").value = "";
        };
        resultsContainer.appendChild(div);
    });

    if(filtered.length===0) resultsContainer.innerHTML="<div style='color:red;'>Không tìm thấy sản phẩm!</div>";
}

// ==================== KHỞI TẠO ====================
document.addEventListener("DOMContentLoaded", ()=>{
    initHardcodedReceipts();  // Thêm phiếu cứng nếu chưa có
    renderReceiptsTable();

    document.getElementById("receiptForm").addEventListener("submit", createOrUpdateReceipt);
    document.getElementById("generalSearchInput").addEventListener("input", function(){
        const keyword = this.value.toLowerCase();
        document.querySelectorAll("#receipt-table-body tr").forEach(row=>{
            row.style.display = row.innerText.toLowerCase().includes(keyword)?"":"none";
        });
    });

    document.getElementById("searchProductBtn").addEventListener("click", searchAndAddProduct);
});
