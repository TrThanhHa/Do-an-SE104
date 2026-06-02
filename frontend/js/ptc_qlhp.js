// ================= MẢNG DỮ LIỆU GIẢ LẬP (MOCK DATABASE) =================
const databaseStudents = [
    { 
        name: "Nguyễn Văn A", email: "anv@gm.uit.edu.vn", mssv: "23520001", class: "CNNB2022", year: "2025-2026", term: "HK2", cost: "15.000.000", status: "Đã đóng", color: "green", paid: "15.000.000", debt: "0", khoa: "KH&KT Thông tin", nganh: "An toàn thông tin", dob: "12/03/2005", 
        txs: [{date:"20/03/2026", method:"Tiền mặt", amount: "15.000.000"}] 
    },
    { 
        name: "Nguyễn Văn B", email: "bnv@gm.uit.edu.vn", mssv: "23520002", class: "CNTT2023", year: "2025-2026", term: "HK2", cost: "18.000.000", status: "Chưa đóng", color: "red", paid: "0", debt: "18.000.000", khoa: "Hệ thống thông tin", nganh: "Thương mại điện tử", dob: "05/11/2004", 
        txs: [] 
    },
    { 
        name: "Trần Thị C", email: "ctt@gm.uit.edu.vn", mssv: "24520009", class: "CNNB2022", year: "2025-2026", term: "HK2", cost: "12.000.000", status: "Một phần", color: "orange", paid: "5.000.000", debt: "7.000.000", khoa: "Khoa học máy tính", nganh: "Trí tuệ nhân tạo", dob: "22/08/2006", 
        txs: [{date:"15/02/2026", method:"Chuyển khoản", amount: "5.000.000"}] 
    }
];

// Khởi tạo DOM các phần tử cần tương tác
const tBody = document.getElementById('student-table-body');
const inpSearch = document.getElementById('search-input');
const selectClass = document.getElementById('filter-class');

// 1. Hàm hiển thị danh sách sinh viên ra bảng (Màn hình 1)
function loadTable(data) {
    tBody.innerHTML = "";
    if (data.length === 0) {
        tBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#9ca3af;">Không tìm thấy kết quả nào phù hợp</td></tr>`;
        return;
    }
    data.forEach(sv => {
        const tr = document.createElement('tr');
        tr.style.cursor = "pointer";
        tr.innerHTML = `
            <td><strong>${sv.name}</strong><br><small style="color:#64748b">${sv.email}</small></td>
            <td>${sv.mssv}</td>
            <td>${sv.class}</td>
            <td>${sv.term}, ${sv.year}</td>
            <td>${sv.cost} VND</td>
            <td><span class="badge badge-${sv.color}">${sv.status}</span></td>
        `;
        // Lắng nghe sự kiện click dòng để chuyển màn hình chi tiết
        tr.addEventListener('click', () => showDetailView(sv));
        tBody.appendChild(tr);
    });
}

// 2. Logic công cụ tìm kiếm thời gian thực (Live Search Engine)
function handleFilter() {
    const text = inpSearch.value.toLowerCase().trim();
    const selectedCls = selectClass.value;

    const res = databaseStudents.filter(sv => {
        const checkText = sv.name.toLowerCase().includes(text) || sv.mssv.includes(text);
        const checkClass = selectedCls === "" || sv.class === selectedCls;
        return checkText && checkClass;
    });
    loadTable(res);
}

// Đăng ký bắt sự kiện gõ chữ và chọn bộ lọc
inpSearch.addEventListener('input', handleFilter);
selectClass.addEventListener('change', handleFilter);

// 3. Hàm xử lý chuyển giao diện và điền dữ liệu sang Màn hình Chi tiết (Màn hình 2)
function showDetailView(sv) {
    document.getElementById('screen-student-list').style.display = 'none';
    document.getElementById('screen-student-detail').style.display = 'block';

    // Đổ dữ liệu hành chính
    document.getElementById('det-name').innerText = sv.name;
    document.getElementById('det-mssv').innerText = sv.mssv;
    document.getElementById('det-dob').innerText = sv.dob;
    document.getElementById('det-email').innerText = sv.email;
    document.getElementById('det-khoa').innerText = sv.khoa;
    document.getElementById('det-nganh').innerText = sv.nganh;
    document.getElementById('det-lop').innerText = sv.class + ".1";
    
    // Tạo kí tự Avatar viết tắt (ví dụ: Nguyễn Văn A -> NA)
    document.getElementById('det-avatar').innerText = sv.name.split(' ').pop().substring(0,2).toUpperCase();

    // Điền thông tin tiền tệ tổng quan
    document.getElementById('det-total-cost').innerText = sv.cost + " VND";
    document.getElementById('det-paid-cost').innerText = sv.paid + " VND";
    document.getElementById('det-debt-cost').innerText = sv.debt + " VND";

    // Điền khối chi tiết học kì học phí đăng ký môn học
    document.getElementById('det-semester-title').innerText = `${sv.term} — Năm học ${sv.year}`;
    document.getElementById('det-sub-total').innerText = sv.cost + " VND";
    document.getElementById('det-sub-must-paid').innerText = sv.cost + " VND";
    document.getElementById('det-sub-debt').innerText = sv.debt + " VND";

    // Cập nhật nhãn màu tình trạng
    const b = document.getElementById('det-badge-status');
    b.className = `badge badge-${sv.color}`;
    b.innerText = sv.status;

    // Đổ lịch sử danh sách giao dịch
    const txContainer = document.getElementById('transaction-list-container');
    txContainer.innerHTML = "";
    if (sv.txs.length === 0) {
        txContainer.innerHTML = `<p style="font-size:12px; color:#9ca3af; margin:0;">Chưa ghi nhận giao dịch nào cho kì học này.</p>`;
    } else {
        sv.txs.forEach(t => {
            txContainer.innerHTML += `
                <div class="transaction-item">
                    <div class="tx-left">
                        <span class="tx-dot" style="background-color:#16a34a"></span>
                        <div><strong>${t.date}</strong><p>${t.method}</p></div>
                    </div>
                    <div class="tx-amount text-green">+ ${t.amount} VND</div>
                </div>
            `;
        });
    }
}

// 4. Bắt sự kiện nút "Quay trở về" để quay lại danh sách chính
document.getElementById('btn-back-to-list').addEventListener('click', () => {
    document.getElementById('screen-student-detail').style.display = 'none';
    document.getElementById('screen-student-list').style.display = 'block';
});

// Chạy hàm nạp danh sách dữ liệu lần đầu tiên khi mở trang
loadTable(databaseStudents);
