const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const protect = require('../middlewares/authMiddleware');

// Chỉ những ai đã đăng nhập mới xem được danh sách
router.get('/', protect, studentController.getAllStudents);

// Chỉ những ai có quyền mới được thêm sinh viên (Sau này có thể thêm middleware check role)
router.post('/', protect, studentController.createStudent);

module.exports = router;