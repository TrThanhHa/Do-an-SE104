document.addEventListener('DOMContentLoaded', () => {
    const sidebarAdminName = document.getElementById('sidebar-admin-name');
    if (sidebarAdminName) sidebarAdminName.textContent = 'Root_Master_2026';

    const adminUserTableBody = document.getElementById('adminUserTableBody');
    const logStreamContainer = document.getElementById('logStreamContainer');
    const lblTotalUsers = document.getElementById('lblTotalUsers');

    // 1. HÀM LẤY DỮ LIỆU TỪ BACKEND DATABASE (Thay vì LocalStorage)
    async function getSystemAccounts() {
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();
            return data;
        } catch (error) {
            pushAuditLog("Lỗi: Không thể kết nối đến Database!", "warning");
            return [];
        }
    }

    // 2. KẾT XUẤT MA TRẬN PHÂN QUYỀN (RBAC Data Grid Binder)
    async function renderUserMatrix() {
        if (!adminUserTableBody) return;
        adminUserTableBody.innerHTML = '';

        // Gọi API lấy dữ liệu
        const accounts = await getSystemAccounts();
        if (lblTotalUsers) lblTotalUsers.textContent = accounts.length;

        accounts.forEach(acc => {
            let roleBadgeStyle = '';
            if (acc.role === 'ADMIN') roleBadgeStyle = 'background: #fff5f5; color: #e53e3e; border: 1px solid #fed7d7;';
            else if (acc.role === 'PDT') roleBadgeStyle = 'background: #eef2ff; color: #4338ca; border: 1px solid #e0e7ff;';
            else if (acc.role === 'PTC') roleBadgeStyle = 'background: #f0fff4; color: #38a169; border: 1px solid #c6f6d5;';
            else roleBadgeStyle = 'background: #e6fffa; color: #0d9488; border: 1px solid #ccfbf1;';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong style="font-family: monospace; color: #4a5568;">${acc.username}</strong></td>
                <td><strong>${acc.name}</strong></td>
                <td>
                    <span class="role-selector-badge" style="${roleBadgeStyle}">
                        <i class="ti ti-id"></i> ${acc.role}
                    </span>
                </td>
                <td class="text-center">
                    <span style="background: #f0fff4; color: #38a169; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                        ● ${acc.status || 'Sẵn sàng'}
                    </span>
                </td>
                <td class="text-center">
                    <select class="form-select select-role-mutation" data-username="${acc.username}" style="padding: 2px 6px; font-size: 12px; height: 28px; width: 120px; display:inline-block;">
                        <option value="SV" ${acc.role === 'SV' ? 'selected' : ''}>Sinh Viên</option>
                        <option value="PDT" ${acc.role === 'PDT' ? 'selected' : ''}>Phòng ĐT</option>
                        <option value="PTC" ${acc.role === 'PTC' ? 'selected' : ''}>Phòng TC</option>
                        <option value="ADMIN" ${acc.role === 'ADMIN' ? 'selected' : ''}>Quản Trị</option>
                    </select>
                </td>
            `;
            adminUserTableBody.appendChild(tr);
        });

        bindRoleMutationEvents();
    }

    // 3. LUỒNG ĐỔI QUYỀN GỌI LÊN BACKEND
    function bindRoleMutationEvents() {
        document.querySelectorAll('.select-role-mutation').forEach(select => {
            select.addEventListener('change', async function() {
                const targetUsername = this.getAttribute('data-username');
                const newRole = this.value;

                try {
                    // Gửi lệnh Update lên Backend
                    const response = await fetch('/api/admin/change-role', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: targetUsername, newRole: newRole })
                    });
                    const result = await response.json();

                    if (result.success) {
                        pushAuditLog(`Tài khoản [${targetUsername}] được đổi quyền thành: ${newRole}`, 'warning');
                        alert(`ĐỔI VAI TRÒ THÀNH CÔNG!\n\nTài khoản: ${targetUsername}\nQuyền mới: ${newRole}`);
                        renderUserMatrix(); // Tải lại bảng
                    } else {
                        alert(result.message);
                        renderUserMatrix(); // Trả lại trạng thái cũ nếu lỗi
                    }
                } catch (error) {
                    alert("Lỗi kết nối máy chủ!");
                }
            });
        });
    }

    // 4. TRÌNH PHUN LOG (Giữ nguyên của bạn)
    function pushAuditLog(message, type = 'info') {
        if (!logStreamContainer) return;
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        let typeClass = 'log-info';
        if (type === 'success') typeClass = 'log-success';
        if (type === 'warning') typeClass = 'log-warning';
        const logDiv = document.createElement('div');
        logDiv.className = 'log-item';
        logDiv.innerHTML = `<span class="log-timestamp">[${timeStr}]</span> <span class="${typeClass}">${message}</span>`;
        logStreamContainer.appendChild(logDiv);
        logStreamContainer.scrollTop = logStreamContainer.scrollHeight;
    }

    // 5. GIẢ LẬP CÁC SỰ KIỆN HỆ THỐNG ĐANG DIỄN RA (Giữ nguyên của bạn)
    function startSystemTelemetrySimulation() {
        const fakeEvents = [
            { msg: "Hạ tầng kết nối Server MySQL thiết lập thành công.", type: "success" },
            { msg: "Quét trạng thái đăng ký học phần: Hệ thống ổn định.", type: "info" },
            { msg: "Cảnh báo: Kiểm tra cấu hình biểu giá học phí kỳ 1 năm 2026.", type: "warning" }
        ];
        pushAuditLog(fakeEvents[0].msg, fakeEvents[0].type);
        setTimeout(() => pushAuditLog(fakeEvents[1].msg, fakeEvents[1].type), 1000);
        setTimeout(() => pushAuditLog(fakeEvents[2].msg, fakeEvents[2].type), 2500);

        setInterval(() => {
            const randomEvent = fakeEvents[Math.floor(Math.random() * fakeEvents.length)];
            pushAuditLog(randomEvent.msg, randomEvent.type);
        }, 6000);
    }

    // BOOTSTRAP INITIALIZATION
    renderUserMatrix();
    startSystemTelemetrySimulation();
});
