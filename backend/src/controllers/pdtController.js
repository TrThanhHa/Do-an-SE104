const pool = require('../config/db.js');

const pdtController = {
    // ==========================================
    // 1. QUẢN LÝ NGÀNH HỌC (pdt_nganhhoc.html)
    // ==========================================
    getAllMajors: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM majors ORDER BY created_at DESC');
            res.json({ success: true, data: rows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách ngành học' });
        }
    },

    createMajor: async (req, res) => {
        // Lấy đúng các trường từ form pdt_nganhhoc.html
        const { majorId, majorName, majorDepartment, majorCredits } = req.body;
        try {
            await pool.query(
                'INSERT INTO majors (major_id, major_name, department, min_credits) VALUES (?, ?, ?, ?)',
                [majorId, majorName, majorDepartment, majorCredits]
            );
            res.status(201).json({ success: true, message: 'Thêm ngành học thành công!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi thêm ngành học (Có thể trùng mã ngành)' });
        }
    },

    // ==========================================
    // 2. QUẢN LÝ MÔN HỌC (pdt_monhoc.html)
    // ==========================================
    getAllSubjects: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM subjects ORDER BY created_at DESC');
            res.json({ success: true, data: rows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách môn học' });
        }
    },

    createSubject: async (req, res) => {
        // Lấy đúng các trường từ form pdt_monhoc.html
        const { subjectId, subjectName, subjectCredits, subjectType, subjectPrerequisite } = req.body;
        try {
            await pool.query(
                'INSERT INTO subjects (subject_id, subject_name, credits, type, prerequisite_id) VALUES (?, ?, ?, ?, ?)',
                [subjectId, subjectName, subjectCredits, subjectType, subjectPrerequisite === 'none' ? null : subjectPrerequisite]
            );
            res.status(201).json({ success: true, message: 'Thêm môn học thành công!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi thêm môn học' });
        }
    },

    // ==========================================
    // 3. MỞ LỚP HỌC PHẦN (pdt_dkhp.html)
    // ==========================================
    getAllClasses: async (req, res) => {
        try {
            // Join bảng classes với bảng subjects để lấy tên môn học
            const query = `
                SELECT c.*, s.subject_name, s.credits 
                FROM classes c 
                JOIN subjects s ON c.subject_id = s.subject_id
                ORDER BY c.academic_year DESC, c.semester DESC
            `;
            const [rows] = await pool.query(query);
            res.json({ success: true, data: rows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách lớp học phần' });
        }
    },

    createClass: async (req, res) => {
        // Lấy đúng các trường từ form pdt_dkhp.html
        const { classId, classYear, classSemester, classSubjectId, classMaxStudents } = req.body;
        try {
            await pool.query(
                'INSERT INTO classes (class_id, academic_year, semester, subject_id, max_students, current_students, status) VALUES (?, ?, ?, ?, ?, 0, "Đang mở ĐK")',
                [classId, classYear, classSemester, classSubjectId, classMaxStudents]
            );
            res.status(201).json({ success: true, message: 'Mở lớp học phần thành công!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi mở lớp học phần' });
        }
    },

    // ==========================================
    // 4. THỐNG KÊ DASHBOARD (pdt.html)
    // ==========================================
    getDashboardStats: async (req, res) => {
        try {
            // Đếm tổng số sinh viên (Giả định bạn có bảng students)
            const [[{ totalStudents }]] = await pool.query('SELECT COUNT(*) as totalStudents FROM students');
            
            // Đếm số lớp học phần đang mở
            const [[{ openClasses }]] = await pool.query('SELECT COUNT(*) as openClasses FROM classes WHERE status = "Đang mở ĐK"');

            res.json({
                success: true,
                data: {
                    totalStudents: totalStudents || 0,
                    openClasses: openClasses || 0,
                    registrationRate: "85%" // Tạm fix cứng theo UI của bạn, sau này tính toán thực tế
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy dữ liệu thống kê' });
        }
    }
};

module.exports = pdtController;
