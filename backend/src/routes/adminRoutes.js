const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');

// 1. API Lấy danh sách tài khoản
router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT username, display_name as name, role, status FROM accounts');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server" });
    }
});

// 2. API Đổi quyền tài khoản (Role Mutation)
router.put('/change-role', async (req, res) => {
    try {
        const { username, newRole } = req.body;
        
        // Không cho phép tự giáng quyền root
        if (username === 'admin' && newRole !== 'ADMIN') {
            return res.status(403).json({ success: false, message: "Không được phép giáng quyền Root!" });
        }

        await pool.query('UPDATE accounts SET role = ? WHERE username = ?', [newRole, username]);
        res.json({ success: true, message: "Đổi quyền thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
});

module.exports = router;
