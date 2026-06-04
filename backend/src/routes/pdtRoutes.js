const express = require('express');
const router = express.Router();
const pdtController = require('../controllers/pdtController');
const protect = require('../middlewares/authMiddleware');

// Ở đây bạn có thể thêm middleware check quyền (chỉ PDT mới được gọi)
// const { authorizeRoles } = require('../middlewares/authMiddleware');
// router.use(protect, authorizeRoles('PDT')); 

// Middleware protect sẽ chạy cho tất cả các route bên dưới (bắt buộc đăng nhập)
router.use(protect);

// 1. Quản lý Dashboard
router.get('/dashboard', pdtController.getDashboardStats);

// 2. Quản lý Ngành học
router.get('/majors', pdtController.getAllMajors);
router.post('/majors', pdtController.createMajor);

// 3. Quản lý Môn học
router.get('/subjects', pdtController.getAllSubjects);
router.post('/subjects', pdtController.createSubject);

// 4. Quản lý Mở lớp học phần
router.get('/classes', pdtController.getAllClasses);
router.post('/classes', pdtController.createClass);

module.exports = router;
