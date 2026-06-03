const db = require('../config/db');
const Joi = require('joi');

// 1. Định nghĩa quy tắc validation cho đăng ký học phần
const registerSchema = Joi.object({
    student_id: Joi.string().alphanum().min(8).max(15).required(),
    class_id: Joi.string().alphanum().min(3).max(10).required()
});

exports.registerClass = async (req, res) => {
    // 2. Validate dữ liệu đầu vào
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { student_id, class_id } = req.body;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 3. Logic nghiệp vụ (Giữ lại tính Transaction)
        const [classes] = await connection.query(
            'SELECT max_slots FROM classes WHERE class_id = ? FOR UPDATE', 
            [class_id]
        );
        
        if (classes.length === 0) throw new Error("Lớp học không tồn tại.");
        
        const [exists] = await connection.query(
            'SELECT id FROM registrations WHERE student_id = ? AND class_id = ?',
            [student_id, class_id]
        );
        
        if (exists.length > 0) throw new Error("Sinh viên đã đăng ký lớp này rồi.");

        await connection.query(
            'INSERT INTO registrations (student_id, class_id) VALUES (?, ?)',
            [student_id, class_id]
        );

        await connection.commit();
        res.status(200).json({ message: "Đăng ký học phần thành công!" });

    } catch (err) {
        await connection.rollback();
        res.status(400).json({ message: err.message });
    } finally {
        connection.release();
    }
};