const db = require('../config/db');

// Tính công nợ cho một sinh viên cụ thể
exports.getTuitionInvoice = async (req, res) => {
    const { student_id } = req.params;

    try {
        // 1. Lấy danh sách các lớp đã đăng ký và loại môn học
        const query = `
            SELECT c.credits, co.type 
            FROM registrations r
            JOIN classes cl ON r.class_id = cl.class_id
            JOIN courses co ON cl.course_id = co.course_id
            WHERE r.student_id = ?`;
        
        const [registrations] = await db.query(query, [student_id]);

        // 2. Lấy biểu giá học phí (Dynamic Rates)
        const [rates] = await db.query('SELECT * FROM tuition_rates');
        const rateMap = Object.fromEntries(rates.map(r => [r.class_type, r.unit_price]));

        // 3. Tính toán tổng tiền
        let totalAmount = 0;
        registrations.forEach(reg => {
            const unitPrice = rateMap[reg.type] || 0;
            totalAmount += reg.credits * unitPrice;
        });

        // 4. Kiểm tra miễn giảm từ bảng exemptions
        const [exemptions] = await db.query(
            'SELECT discount_rate FROM exemptions WHERE student_id = ? AND status = "APPROVED"', 
            [student_id]
        );

        if (exemptions.length > 0) {
            totalAmount *= (1 - exemptions[0].discount_rate);
        }

        res.status(200).json({ student_id, total_amount: totalAmount, currency: "VND" });

    } catch (err) {
        res.status(500).json({ message: "Lỗi tính toán công nợ", error: err.message });
    }
};

exports.processPayment = async (req, res) => {
    const { student_id, amount } = req.body;
    
    try {
        await db.query(
            'INSERT INTO payments (student_id, amount, status, paid_at) VALUES (?, ?, "PAID", NOW())',
            [student_id, amount]
        );
        res.status(200).json({ message: "Thanh toán thành công! Biên lai đã được ghi nhận." });
    } catch (err) {
        res.status(500).json({ message: "Lỗi ghi nhận thanh toán", error: err.message });
    }
};