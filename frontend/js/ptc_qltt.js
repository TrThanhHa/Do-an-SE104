// ================= MẢNG DỮ LIỆU MOCK TRANSACTIONS =================
const databaseTransactions = [
    { id: "PT202603001", mssv: "23520001", payDate: "20/03/2026", amount: "8.000.000", method: "Chuyển khoản", txDate: "20/03/2026", status: "Thành công", color: "green", bank: "BIDV - Chi nhánh TP.HCM", account: "02352000199", content: "PAY202603001 Nguyen Van A dong hoc phi HK2", balance: "0" },
    { id: "PT202602004", mssv: "23520001", payDate: "15/02/2026", amount: "4.000.000", method: "VNPay", txDate: "15/02/2026", status: "Thành công", color: "green", bank: "VNPay Wallet", account: "N/A", content: "VNPAY-UIT-23520001-TUYEN", balance: "0" },
    { id: "PT202604012", mssv: "23520002", payDate: "10/04/2026", amount: "18.000.000", method: "Tiền mặt", txDate: "Ngày gd", status: "Chưa đóng", color: "red", bank: "N/A", account: "N/A", content: "Thu trực tiếp tại quầy", balance: "0" },
    { id: "PT202605100", mssv: "24520009", payDate: "02/05/2026", amount: "5.000.000", method: "Chuyển khoản", txDate: "02/05/2026", status: "Một phần", color: "orange", bank: "Vietcombank", account: "102948575", content: "Tran Thi C nop hoc phi", balance: "7.000.000" }
];

// Danh sách sinh viên giả định để phục vụ tính năng "Tạo phiếu thu" tự điền tên
const mockStudentsInfo = {
    "23520001": { name: "Nguyễn Văn A", khoa: "KH&KT Thông tin", lop: "CNNB2022" },
    "23520002": { name: "Nguyễn Văn B", khoa: "Hệ thống thông tin", lop: "CNTT2023" },
    "24520009": { name: "Trần Thị C", khoa: "Khoa học máy tính", lop: "CNNB2022" }
};

// Khởi tạo các phần tử DOM
const tBody = document.getElementById('invoice-table-body');
const viewList = document.getElementById('view-transaction-list');
const viewCreate = document.getElementById('view-create-invoice');
const modal = document.getElementById('detail-modal');

// 1. Hàm hiển thị danh sách phiếu thu ra bảng chính
function loadInvoiceTable(data) {
    tBody.innerHTML = "";
    data.forEach(tx => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${tx.id}</strong></td>
            <td>${tx.mssv}</td>
            <td>${tx.payDate}</td>
            <td>${tx.amount} VND</td>
            <td>${tx.method}</td>
            <td>${tx.txDate}</td>
            <td style="text-align: center;">
                <button class="view-detail-link" onclick="openDetailModal('${tx.id}')">Xem chi tiết</button>
            </td>
        `;
        tBody.appendChild(tr);
    });
}

// 2. Bộ lọc tìm kiếm theo MSSV
document.getElementById('search-invoice').addEventListener('input', function(e) {
    const text = e.target.value.trim().toLowerCase();
    const filtered = databaseTransactions.filter(tx => tx.mssv.toLowerCase().includes(text));
    loadInvoiceTable(filtered);
});

// 3. Hàm hiển thị Popup Chi tiết giao dịch (Modal)
function openDetailModal(id) {
    const tx = databaseTransactions.find(item => item.id === id);
    if (!tx) return;

    // Đổ dữ liệu vào Modal
    document.getElementById('pop-id').innerText = tx.id;
    document.getElementById('pop-invoice-date').innerText = tx.payDate;
    document.getElementById('pop-bank').innerText = tx.bank;
    document.getElementById('pop-account').innerText = tx.account;
    document.getElementById('pop-content').innerText = tx.content;
    document.getElementById('pop-mssv').innerText = tx.mssv;
    document.getElementById('pop-amount').innerText = tx.amount + " VND";
    document.getElementById('pop-balance').innerText = tx.balance + " VND";
    document.getElementById('pop-method').innerText = tx.method;
    
    const statusLabel = document.getElementById('pop-status');
    statusLabel.innerText = tx.status;
    statusLabel.className = `pop-badge badge-${tx.color}`;

    modal.classList.add('open');
}

// Bắt sự kiện đóng modal
document.getElementById('btn-pop-close').addEventListener('click', () => modal.classList.remove('open'));
document.getElementById('btn-pop-print').addEventListener('click', () => window.print());

// 4. Điều hướng chuyển đổi giữa màn hình Danh sách và màn hình Tạo phiếu
document.getElementById('btn-open-create').addEventListener('click', () => {
    viewList.style.display = 'none';
    viewCreate.style.display = 'block';
    // Đặt ngày lập phiếu mặc định là hôm nay
    document.getElementById('ins-date').valueAsDate = new Date();
});

function backToListView() {
    viewCreate.style.display = 'none';
    viewList.style.display = 'block';
    document.getElementById('invoice-form').reset();
}

document.getElementById('btn-back-to-list').addEventListener('click', backToListView);
document.getElementById('btn-cancel-form').addEventListener('click', backToListView);

// 5. Logic tự động truy xuất và điền tên Sinh viên khi gõ MSSV (Auto-fill)
document.getElementById('ins-mssv').addEventListener('input', function(e) {
    const mssv = e.target.value.trim();
    if (mockStudentsInfo[mssv]) {
        document.getElementById('ins-name').value = mockStudentsInfo[mssv].name;
        document.getElementById('ins-khoa').value = mockStudentsInfo[mssv].khoa;
        document.getElementById('ins-lop').value = mockStudentsInfo[mssv].lop;
    } else {
        document.getElementById('ins-name').value = "";
        document.getElementById('ins-khoa').value = "";
        document.getElementById('ins-lop').value = "";
    }
});

// 6. Xử lý sự kiện lưu Form khi tạo thành công phiếu thu mới
document.getElementById('invoice-form').addEventListener('submit', function(e) {
    const mssv = document.getElementById('ins-mssv').value.trim();
    const payAmount = document.getElementById('ins-actual-pay').value;
    const method = document.getElementById('ins-method').value;
    const dateInput = document.getElementById('ins-date').value;

    // Định dạng lại ngày hiển thị dạng dd/mm/yyyy
    const formattedDate = dateInput.split('-').reverse().join('/');

    const newInvoice = {
        id: "PT" + Math.floor(1000000 + Math.random() * 9000000), // Random ID mẫu
        mssv: mssv,
        payDate: formattedDate,
        amount: Number(payAmount).toLocaleString('vi-VN'),
        method: method,
        txDate: formattedDate,
        status: "Thành công",
        color: "green",
        bank: method === "Tiền mặt" ? "N/A" : "Ngân hàng liên kết",
        account: "N/A",
        content: document.getElementById('ins-content').value,
        balance: "0"
    };

    // Đẩy vào đầu mảng dữ liệu và nạp lại bảng
    databaseTransactions.unshift(newInvoice);
    loadInvoiceTable(databaseTransactions);
    
    alert("Tạo và lưu phiếu thu thành công!");
    backToListView();
});

// Chạy khởi tạo danh sách lần đầu tiên khi bật trang
loadInvoiceTable(databaseTransactions);
