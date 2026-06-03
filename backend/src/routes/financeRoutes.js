const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const protect = require('../middlewares/authMiddleware');

// Route xem công nợ (Sử dụng tham số trên URL)
router.get('/invoice/:student_id', protect, financeController.getTuitionInvoice);

module.exports = router;