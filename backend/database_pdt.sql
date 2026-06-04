-- 1. QUẢN LÝ NGÀNH HỌC
CREATE TABLE majors (
    major_id VARCHAR(10) PRIMARY KEY,       
    major_name VARCHAR(100) NOT NULL,       
    department VARCHAR(100) NOT NULL,       
    min_credits INT NOT NULL,               
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. QUẢN LÝ MÔN HỌC 
CREATE TABLE subjects (
    subject_id VARCHAR(10) PRIMARY KEY,    
    subject_name VARCHAR(100) NOT NULL,    
    credits INT NOT NULL,                 
    type ENUM('Lý thuyết', 'Thực hành', 'Đồ án') DEFAULT 'Lý thuyết', 
    prerequisite_id VARCHAR(10),          
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prerequisite_id) REFERENCES subjects(subject_id) ON DELETE SET NULL
);

-- 3. BẢNG SINH VIÊN (Phục vụ đếm dữ liệu ở getDashboardStats)
CREATE TABLE students (
    student_id VARCHAR(15) PRIMARY KEY,     -- MSSV
    full_name VARCHAR(100) NOT NULL,        -- Họ tên
    email VARCHAR(100) UNIQUE,
    class_group VARCHAR(20),                -- Lớp sinh hoạt (VD: D19CQCN01)
    major_id VARCHAR(10),                   -- Chuyên ngành
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (major_id) REFERENCES majors(major_id) ON DELETE SET NULL
);

-- 4. MỞ LỚP HỌC PHẦN (Map chuẩn với createClass)
CREATE TABLE classes (
    class_id VARCHAR(20) PRIMARY KEY,       
    subject_id VARCHAR(10) NOT NULL,        
    academic_year VARCHAR(20) NOT NULL,    
    semester INT NOT NULL,                 
    room VARCHAR(20) DEFAULT NULL,
    schedule VARCHAR(50) DEFAULT NULL,
    max_students INT DEFAULT 50,           
    current_students INT DEFAULT 0,         -- Controller tự động gán = 0 khi mở lớp
    status ENUM('Đang mở ĐK', 'Đã khóa ĐK', 'Đã hủy') DEFAULT 'Đang mở ĐK', -- Controller tự động gán "Đang mở ĐK"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 5. BẢNG ĐĂNG KÝ HỌC PHẦN (Bảng trung gian dành cho Sinh viên)
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(15) NOT NULL,
    class_id VARCHAR(20) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_class (student_id, class_id) -- Chặn sinh viên đăng ký trùng lớp
);
