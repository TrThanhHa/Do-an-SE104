const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
// Giả định bạn sẽ tạo file pdtController sau, hoặc viết trực tiếp logic vào đây để test nhanh
// const pdtController = require('../controllers/pdtController'); 

// 1. Lấy danh sách các môn học / học phần đang mở (Cả sinh viên và PDT đều xem được)
router.get('/courses', protect, (req, res) => {
    res.json({ message: "API lấy danh sách học phần thành công (PDT)" });
});

// 2. Tạo một học phần/môn học mới hoặc mở lớp mới (Chỉ dành cho cán bộ PDT)
router.post('/courses', protect, (req, res) => {
    // Sau này check role PDT ở đây
    res.json({ message: "API tạo học phần mới thành công" });
});

// 3. Thiết lập định mức học phí cho từng tín chỉ / ngành học
router.post('/tuition-config', protect, (req, res) => {
    res.json({ message: "API cấu hình định mức học phí thành công" });
});

module.exports = router;
