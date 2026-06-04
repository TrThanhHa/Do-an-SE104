-- ======================================================================================
-- PHÂN HỆ 1: QUẢN TRỊ TỐI CAO (ADMIN.HTML) & TÀI KHOẢN HỆ THỐNG
-- ======================================================================================

-- 1. Bảng tài khoản người dùng
CREATE TABLE accounts (
    username VARCHAR(50) PRIMARY KEY,       -- Mã đăng nhập (MSSV, Mã NV, pdt, ptc, admin)
    display_name VARCHAR(100) NOT NULL,     -- Họ và Tên Nhân Viên / SV (Hiển thị lên admin.html)
    password_hash VARCHAR(255) NOT NULL,    -- Mật khẩu đã băm bằng Bcrypt
    role ENUM('ADMIN', 'PDT', 'PTC', 'GV', 'SV') NOT NULL, -- Vai trò hệ thống
    status ENUM('Hoạt động', 'Bị khóa') DEFAULT 'Hoạt động', -- Trạng thái tài khoản
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng lưu vết lịch sử hệ thống (Hiển thị lên SYSTEM AUDIT TRAIL STREAM của admin.html)
CREATE TABLE system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    action_message TEXT NOT NULL,           -- Hành động hành vi (Ví dụ: "Admin đã mở khóa tài khoản SV001")
    ip_address VARCHAR(45) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES accounts(username) ON DELETE SET NULL
);


-- ======================================================================================
-- PHÂN HỆ 2: PHÒNG ĐÀO TẠO (PDT) & THÔNG TIN ĐÀO TẠO GỐC
-- ======================================================================================

-- 3. Bảng chuyên ngành
CREATE TABLE majors (
    major_id VARCHAR(10) PRIMARY KEY,       
    major_name VARCHAR(100) NOT NULL,       
    department VARCHAR(100) NOT NULL,       
    min_credits INT NOT NULL,               
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng môn học
CREATE TABLE subjects (
    subject_id VARCHAR(10) PRIMARY KEY,     
    subject_name VARCHAR(100) NOT NULL,     
    credits INT NOT NULL,                   
    type ENUM('Lý thuyết', 'Thực hành', 'Đồ án') DEFAULT 'Lý thuyết', -- Phục vụ bảng tính giá học phí của PTC
    prerequisite_id VARCHAR(10),            
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prerequisite_id) REFERENCES subjects(subject_id) ON DELETE SET NULL
);

-- 5. Bảng thông tin sinh viên gốc
CREATE TABLE students (
    student_id VARCHAR(15) PRIMARY KEY,     -- Mã số SV
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    class_group VARCHAR(20) NOT NULL,       -- Lớp sinh hoạt (Ví dụ: D19CQCN01)
    major_id VARCHAR(10),                   -- Chuyên ngành học
    academic_year_join VARCHAR(10),         -- Khóa học
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES accounts(username) ON DELETE CASCADE,
    FOREIGN KEY (major_id) REFERENCES majors(major_id) ON DELETE SET NULL
);

-- 6. Bảng giảng viên
CREATE TABLE teachers (
    teacher_id VARCHAR(15) PRIMARY KEY,     
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,       
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES accounts(username) ON DELETE CASCADE
);

-- 7. Bảng lớp học phần
CREATE TABLE classes (
    class_id VARCHAR(20) PRIMARY KEY,       
    subject_id VARCHAR(10) NOT NULL,        
    teacher_id VARCHAR(15),                 
    academic_year VARCHAR(20) NOT NULL,     -- Năm học (Ví dụ: 2025-2026)
    semester INT NOT NULL,                  -- Học kỳ (1, 2, 3)
    room VARCHAR(20),                       
    schedule VARCHAR(50),                   
    max_students INT DEFAULT 50,            
    current_students INT DEFAULT 0,         
    status ENUM('Đang mở ĐK', 'Đã khóa ĐK', 'Đã hủy') DEFAULT 'Đang mở ĐK', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL
);

-- 8. Bảng giỏ đăng ký môn học của Sinh viên (Giao diện sv.html)
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(15) NOT NULL,
    class_id VARCHAR(20) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_class (student_id, class_id)
);


-- ======================================================================================
-- PHÂN HỆ 3: PHÒNG KẾ HOẠCH TÀI CHÍNH (PTC) & HỌC PHÍ SINH VIÊN
-- ======================================================================================

-- 9. Định mức học phí từng loại hình môn học (Giao diện ptc_hocphi.html)
CREATE TABLE tuition_rates (
    course_type ENUM('Lý thuyết', 'Thực hành', 'Đồ án') PRIMARY KEY, -- Loại hình môn học phần
    rate_per_credit DECIMAL(12,2) NOT NULL,                         -- Đơn giá hiện tại từng tín chỉ
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Cập nhật cuối
);

-- 10. Tổng hợp công nợ học phí theo học kỳ của từng sinh viên (Bảng master hiển thị tại ptc.html và sv_hocphi.html)
CREATE TABLE tuitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(15) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,     -- Năm học hạch toán
    semester INT NOT NULL,                  -- Học kỳ hạch toán
    total_raw_amount DECIMAL(12,2) DEFAULT 0.00,  -- Tổng học phí thô (Tính tổng số tín chỉ * đơn giá)
    exemption_discount DECIMAL(12,2) DEFAULT 0.00, -- Khấu trừ giảm giá (Do miễn giảm chính sách)
    paid_amount DECIMAL(12,2) DEFAULT 0.00,       -- Số tiền đã nộp
    debt_amount DECIMAL(12,2) DEFAULT 0.00,       -- Số tiền còn nợ
    fund_status ENUM('An toàn', 'Công nợ', 'Hoàn thành') DEFAULT 'Công nợ', -- Trạng thái quỹ học phí
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_semester (student_id, academic_year, semester)
);

-- 11. Quản lý diện chính sách miễn giảm học phí (Giao diện ptc_miengiam.html)
CREATE TABLE exemptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(15) NOT NULL,
    policy_name VARCHAR(255) NOT NULL,     -- Diện chính sách miễn giảm (Ví dụ: Thân nhân liệt sĩ, Hộ nghèo...)
    discount_percentage INT NOT NULL,       -- Mức khấu trừ phần trăm (Ví dụ: 50%, 70%, 100%)
    proof_file VARCHAR(255) DEFAULT NULL,   -- Tên file hồ sơ minh chứng đính kèm
    status ENUM('Chờ xác minh', 'Đã duyệt', 'Từ chối') DEFAULT 'Chờ xác minh', -- Trạng thái xét duyệt
    verified_by VARCHAR(50) DEFAULT NULL,   -- Cán bộ nào duyệt công nợ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES accounts(username) ON DELETE SET NULL
);

-- 12. Lịch sử giao dịch đóng tiền học phí (Giao diện sv_lsgd.html và in biên lai)
CREATE TABLE transactions (
    transaction_id VARCHAR(50) PRIMARY KEY, -- Mã giao dịch (Ví dụ: TXN12948124)
    student_id VARCHAR(15) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,          -- Số tiền nộp đợt này
    payment_method VARCHAR(50) DEFAULT 'VNPAY', -- Hình thức thanh toán điện tử
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian ghi nhận thành công
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);
