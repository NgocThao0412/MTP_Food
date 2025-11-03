document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('.customer-table-section tbody');
    tableBody.addEventListener('click', function(event) {
        const target = event.target;

        if (target.classList.contains('action-btn')) {
            const row = target.closest('tr');
            const statusCell = row.cells[4];
            const customerName = row.cells[1].textContent;

            // Nếu bấm "Khoá"
            if (target.classList.contains('lock-btn')) {
                if (confirm(`Bạn có chắc chắn muốn KHÓA tài khoản của ${customerName} không?`)) {
                    statusCell.innerHTML = '<span class="status locked">Đã khoá</span>';
                    target.textContent = 'Mở khoá';
                    target.classList.remove('lock-btn');
                    target.classList.add('unlock-btn');
                    console.log(`Đã khóa tài khoản: ${customerName}`);
                }
            }

            // Nếu bấm "Mở khoá"
            else if (target.classList.contains('unlock-btn')) {
                if (confirm(`Bạn có chắc chắn muốn MỞ KHÓA tài khoản của ${customerName} không?`)) {
                    statusCell.innerHTML = '<span class="status active">Đang hoạt động</span>';
                    target.textContent = 'Khoá';
                    target.classList.remove('unlock-btn');
                    target.classList.add('lock-btn');
                    console.log(`Đã mở khóa tài khoản: ${customerName}`);
                }
            }
        }
    });
});
