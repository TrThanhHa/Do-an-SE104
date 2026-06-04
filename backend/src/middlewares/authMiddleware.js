const jwt = require('jsonwebtoken');

// Middleware 1: Xác thực Token xem có hợp lệ không
const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) { // Thêm khoảng trắng 'Bearer ' để chuẩn hóa hơn
        try {
            token = token.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_MAC_DINH'); // Thêm fallback tránh crash nếu quên cài env
            req.user = decoded; 
            next();
        } catch (error) {
            return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }
    } else {
        return res.status(401).json({ message: "Không tìm thấy quyền truy cập (No Token)!" });
    }
};

// Middleware 2 (Bổ sung thêm): Phân quyền cụ thể theo Role
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user được gán từ middleware protect ở trên
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập vào chức năng này!" });
        }
        next();
    };
};

module.exports = { protect, authorize };
