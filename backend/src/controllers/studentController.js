const db = require('../config/db');

// Lấy danh sách toàn bộ sinh viên
exports.getAllStudents = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM students');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Lỗi truy vấn Database", error: err.message });
    }
};

// Thêm sinh viên mới
exports.createStudent = async (req, res) => {
    const { student_id, full_name, email, class_group } = req.body;
    try {
        const sql = 'INSERT INTO students (student_id, full_name, email, class_group) VALUES (?, ?, ?, ?)';
        await db.query(sql, [student_id, full_name, email, class_group]);
        res.status(201).json({ message: "Thêm sinh viên thành công!" });
    } catch (err) {
        res.status(400).json({ message: "Lỗi thêm sinh viên (có thể trùng ID hoặc Email)", error: err.message });
    }
};