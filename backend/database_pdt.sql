-- -----------------------------------------------------------------------
-- PHẦN 1: DANH MỤC CƠ SỞ (ĐỊA LÝ & ƯU TIÊN)
-- -----------------------------------------------------------------------
-- 1. Bảng TINH
CREATE TABLE TINH (
    MaTinh VARCHAR(20) PRIMARY KEY,
    TenTinh VARCHAR(150) NOT NULL
);

-- 2. Bảng XA
CREATE TABLE XA (
    MaXa VARCHAR(20) PRIMARY KEY,
    MaTinh VARCHAR(20),
    TenXa VARCHAR(150) NOT NULL,
    VungSauVungXa BOOLEAN DEFAULT FALSE,
    GhiChu VARCHAR(255),
    FOREIGN KEY (MaTinh) REFERENCES TINH(MaTinh) ON DELETE CASCADE
);

-- 3. Bảng DOITUONGUUTIEN
CREATE TABLE DOITUONGUUTIEN (
    MaDoiTuong VARCHAR(20) PRIMARY KEY,
    TenDoiTuong VARCHAR(150) NOT NULL,
    TyLeMienGiam FLOAT NOT NULL,
    GhiChu VARCHAR(255)
);

-- -----------------------------------------------------------------------
-- PHẦN 2: DANH MỤC ĐÀO TẠO (KHOA, NGÀNH, MÔN HỌC)
-- -----------------------------------------------------------------------
-- 4. Bảng KHOA
CREATE TABLE KHOA (
    MaKhoa VARCHAR(20) PRIMARY KEY,
    TenKhoa VARCHAR(150) NOT NULL,
    VanPhong VARCHAR(150),
    GhiChu VARCHAR(255)
);

-- 5. Bảng NGANH
CREATE TABLE NGANH (
    MaNganh VARCHAR(20) PRIMARY KEY,
    TenNganh VARCHAR(150) NOT NULL,
    MaKhoa VARCHAR(20),
    GhiChu VARCHAR(255),
    FOREIGN KEY (MaKhoa) REFERENCES KHOA(MaKhoa) ON DELETE SET NULL
);

-- 8. Bảng LOAIMONHOC (Tạo trước MONHOC vì MONHOC tham chiếu tới nó)
CREATE TABLE LOAIMONHOC (
    MaLoaiMonHoc VARCHAR(20) PRIMARY KEY,
    TenLoaiMonHoc VARCHAR(150) NOT NULL,
    SoTietMotTinChi INT NOT NULL
);

-- 6. Bảng MONHOC
CREATE TABLE MONHOC (
    MaMonHoc VARCHAR(20) PRIMARY KEY,
    TenMonHoc VARCHAR(150) NOT NULL,
    MaKhoa VARCHAR(20),
    MaLoaiMonHoc VARCHAR(20),
    SoTiet INT NOT NULL,
    FOREIGN KEY (MaKhoa) REFERENCES KHOA(MaKhoa) ON DELETE SET NULL,
    FOREIGN KEY (MaLoaiMonHoc) REFERENCES LOAIMONHOC(MaLoaiMonHoc) ON DELETE SET NULL
);

-- 7. Bảng CT_MONHOCTRUOC (Xử lý nhiều môn tiên quyết)
CREATE TABLE CT_MONHOCTRUOC (
    MaMonHoc VARCHAR(20),
    MaMonHocTruoc VARCHAR(20),
    PRIMARY KEY (MaMonHoc, MaMonHocTruoc),
    FOREIGN KEY (MaMonHoc) REFERENCES MONHOC(MaMonHoc) ON DELETE CASCADE,
    FOREIGN KEY (MaMonHocTruoc) REFERENCES MONHOC(MaMonHoc) ON DELETE CASCADE
);

-- 9. Bảng CHUONGTRINHHOC
CREATE TABLE CHUONGTRINHHOC (
    MaNganh VARCHAR(20),
    MaMonHoc VARCHAR(20),
    HocKy VARCHAR(50),
    GhiChu VARCHAR(255),
    KhoaApDung VARCHAR(50),
    PRIMARY KEY (MaNganh, MaMonHoc),
    FOREIGN KEY (MaNganh) REFERENCES NGANH(MaNganh) ON DELETE CASCADE,
    FOREIGN KEY (MaMonHoc) REFERENCES MONHOC(MaMonHoc) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------
-- PHẦN 3: QUẢN LÝ SINH VIÊN & HỌC KỲ
-- -----------------------------------------------------------------------
-- 10. Bảng SINHVIEN
CREATE TABLE SINHVIEN (
    MaSoSinhVien VARCHAR(20) PRIMARY KEY,
    HoTen VARCHAR(150) NOT NULL,
    NgaySinh DATETIME,
    GioiTinh VARCHAR(10),
    SoDienThoai VARCHAR(20),
    Email VARCHAR(100),
    MaXa VARCHAR(20),
    MaNganh VARCHAR(20),
    TinhTrang VARCHAR(50),
    MaDoiTuong VARCHAR(20),
    FOREIGN KEY (MaXa) REFERENCES XA(MaXa) ON DELETE SET NULL,
    FOREIGN KEY (MaNganh) REFERENCES NGANH(MaNganh) ON DELETE SET NULL,
    FOREIGN KEY (MaDoiTuong) REFERENCES DOITUONGUUTIEN(MaDoiTuong) ON DELETE SET NULL
);

-- 11. Bảng HOCKYNAMHOC
CREATE TABLE HOCKYNAMHOC (
    MaHKNH VARCHAR(20) PRIMARY KEY,
    HocKy VARCHAR(50) NOT NULL,
    NgayBatDau DATETIME,
    NgayKetThuc DATETIME,
    HanDongHocPhi DATETIME
);

-- 12. Bảng MONHOCMO
CREATE TABLE MONHOCMO (
    MaMonHocMo VARCHAR(20) PRIMARY KEY,
    MaHKNH VARCHAR(20),
    MaMonHoc VARCHAR(20),
    FOREIGN KEY (MaHKNH) REFERENCES HOCKYNAMHOC(MaHKNH) ON DELETE CASCADE,
    FOREIGN KEY (MaMonHoc) REFERENCES MONHOC(MaMonHoc) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------
-- PHẦN 4: ĐĂNG KÝ HỌC PHẦN & TÀI CHÍNH (SỬ DỤNG DECIMAL CHO TIỀN)
-- -----------------------------------------------------------------------
-- 13. Bảng PHIEUDANGKY
CREATE TABLE PHIEUDANGKY (
    MaPhieu VARCHAR(50) PRIMARY KEY,
    MaSoSinhVien VARCHAR(20),
    NgayLapPhieu DATETIME,
    MaHKNH VARCHAR(20),
    TongTienDK DECIMAL(15,2) DEFAULT 0,
    TienMienGiam DECIMAL(15,2) DEFAULT 0,
    TongTienPhaiDong DECIMAL(15,2) DEFAULT 0,
    SoTienDaDong DECIMAL(15,2) DEFAULT 0,
    SoTienConLai DECIMAL(15,2) DEFAULT 0,
    FOREIGN KEY (MaSoSinhVien) REFERENCES SINHVIEN(MaSoSinhVien) ON DELETE CASCADE,
    FOREIGN KEY (MaHKNH) REFERENCES HOCKYNAMHOC(MaHKNH) ON DELETE SET NULL
);

-- 14. Bảng CT_PHIEUDK
CREATE TABLE CT_PHIEUDK (
    MaPhieuDK VARCHAR(50),
    MaMonHoc VARCHAR(20),
    PRIMARY KEY (MaPhieuDK, MaMonHoc),
    FOREIGN KEY (MaPhieuDK) REFERENCES PHIEUDANGKY(MaPhieu) ON DELETE CASCADE,
    FOREIGN KEY (MaMonHoc) REFERENCES MONHOC(MaMonHoc) ON DELETE CASCADE
);

-- 15. Bảng PHIEUTHUHOCPHI
CREATE TABLE PHIEUTHUHOCPHI (
    MaPhieuThu VARCHAR(50) PRIMARY KEY,
    MaPhieuDK VARCHAR(50),
    NgayLapPhieu DATETIME,
    SoTienThu DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (MaPhieuDK) REFERENCES PHIEUDANGKY(MaPhieu) ON DELETE CASCADE
);

-- 16. Bảng BC_SVCHUAHOANTHANHHP (Đã được làm gọn lại)
CREATE TABLE BC_SVCHUAHOANTHANHHP (
    MaBC VARCHAR(50) PRIMARY KEY,
    MaHKNH VARCHAR(20),
    MaSoSinhVien VARCHAR(20),
    SoTienPhaiDong DECIMAL(15,2),
    SoTienConLai DECIMAL(15,2),
    FOREIGN KEY (MaHKNH) REFERENCES HOCKYNAMHOC(MaHKNH) ON DELETE CASCADE,
    FOREIGN KEY (MaSoSinhVien) REFERENCES SINHVIEN(MaSoSinhVien) ON DELETE CASCADE
);

-- 17. Bảng THAMSO
CREATE TABLE THAMSO (
    TenThamSo VARCHAR(100) PRIMARY KEY,
    GiaTri VARCHAR(255)
);

-- -----------------------------------------------------------------------
-- PHẦN 5: PHÂN QUYỀN HỆ THỐNG (RBAC)
-- -----------------------------------------------------------------------
-- 18. Bảng CHUCNANG
CREATE TABLE CHUCNANG (
    MaChucNang VARCHAR(50) PRIMARY KEY,
    TenChucNang VARCHAR(150),
    TenManHinhDuocLoad VARCHAR(150)
);

-- 19. Bảng NHOMNGUOIDUNG
CREATE TABLE NHOMNGUOIDUNG (
    MaNhom VARCHAR(20) PRIMARY KEY,
    TenNhom VARCHAR(150) NOT NULL
);

-- 20. Bảng BANGPHANQUYEN
CREATE TABLE BANGPHANQUYEN (
    MaNhom VARCHAR(20),
    MaChucNang VARCHAR(50),
    PRIMARY KEY (MaNhom, MaChucNang),
    FOREIGN KEY (MaNhom) REFERENCES NHOMNGUOIDUNG(MaNhom) ON DELETE CASCADE,
    FOREIGN KEY (MaChucNang) REFERENCES CHUCNANG(MaChucNang) ON DELETE CASCADE
);

-- 21. Bảng NGUOIDUNG (Tài khoản)
CREATE TABLE NGUOIDUNG (
    TenDangNhap VARCHAR(50) PRIMARY KEY,
    MatKhau VARCHAR(255) NOT NULL,
    MaNhom VARCHAR(20),
    FOREIGN KEY (MaNhom) REFERENCES NHOMNGUOIDUNG(MaNhom) ON DELETE SET NULL
);

-- =======================================================================
-- SCRIPT INSERT DỮ LIỆU MẪU ĐỒ ÁN EDUFEE (21 BẢNG MỚI)
-- Tên gọi phổ biến, thuần Việt, logic dữ liệu liên thông hoàn chỉnh
-- =======================================================================

-- 1. Bảng TINH
INSERT INTO TINH (MaTinh, TenTinh) VALUES
('T01', N'Thành phố Hồ Chí Minh'),
('T02', N'Thành phố Hà Nội'),
('T03', N'Thành phố Đà Nẵng'),
('T04', N'Tỉnh Đồng Nai'),
('T05', N'Tỉnh Đắk Lắk'),
('T06', N'Thành phố Hải Phòng');

-- 2. Bảng XA
INSERT INTO XA (MaXa, MaTinh, TenXa, VungSauVungXa, GhiChu) VALUES
('X01', 'T01', N'Phường Bến Nghé, Quận 1', FALSE, NULL),
('X02', 'T01', N'Phường Linh Trung, TP. Thủ Đức', FALSE, NULL),
('X03', 'T02', N'Phường Hàng Bạc, Quận Hoàn Kiếm', FALSE, NULL),
('X04', 'T04', N'Xã Phú Cường, Huyện Định Quán', TRUE, N'Thuộc vùng miền núi khó khăn'),
('X05', 'T05', N'Xã Ea H''đing, Huyện Cư M''gar', TRUE, N'Vùng sâu vùng xa Tây Nguyên');

-- 3. Bảng DOITUONGUUTIEN
INSERT INTO DOITUONGUUTIEN (MaDoiTuong, TenDoiTuong, TyLeMienGiam, GhiChu) VALUES
('DT00', N'Không ưu tiên (Bình thường)', 0.0, N'Sinh viên đóng 100% học phí'),
('DT01', N'Con thương binh, liệt sĩ', 1.0, N'Miễn giảm 100% học phí'),
('DT02', N'Sinh viên vùng sâu vùng xa (Hộ nghèo)', 0.5, N'Giảm 50% học phí'),
('DT03', N'Con cán bộ công chức ngành', 0.3, N'Giảm 30% học phí');

-- 4. Bảng KHOA
INSERT INTO KHOA (MaKhoa, TenKhoa, VanPhong, GhiChu) VALUES
('KTTT', N'Khoa Khoa học và kỹ thuật thông tin', N'Tòa nhà B, Phòng B804', NULL),
('CNPM', N'Khoa Công nghệ phần mềm', N'Tòa nhà E, Phòng E509', NULL),
('MMT&TT', N'Khoa Mạng máy tính và truyền thông', N'Tòa nhà E, Phòng E703', NULL),
('HTTT', N'Khoa Hệ thống thông tin', N'Tòa nhà B, Phòng B512', NULL),
('KHMT', N'Khoa Khoa học máy tính', N'Tòa nhà B, Phòng B708', NULL),
('KTMT', N'Khoa Kỹ thuật máy tính', N'Tòa nhà E, Phòng E605', NULL);

-- 5. Bảng NGANH
INSERT INTO NGANH (MaNganh, TenNganh, MaKhoa, GhiChu) VALUES
('N01', N'Khoa học dữ liệu', 'KTTT', NULL),
('N02', N'Công nghệ thông tin', 'KTTT', NULL),
('N03', N'Kỹ thuật phần mềm', 'CNPM', NULL),
('N04', N'Thương mại điện tử', 'HTTT', NULL),
('N05', N'Mạng máy tính và truyền thông dữ liệu', 'MTT&TT', NULL),
('N06', N'An toàn thông tin', 'MTT&TT', NULL),
('N07', N'Trí tuệ nhân tạo', 'KHMT', NULL);

-- 8. Bảng LOAIMONHOC
INSERT INTO LOAIMONHOC (MaLoaiMonHoc, TenLoaiMonHoc, SoTietMotTinChi) VALUES
('LT', N'Môn học Lý thuyết', 15),
('TH', N'Môn học Thực hành', 30);

-- 6. Bảng MONHOC
INSERT INTO MONHOC (MaMonHoc, TenMonHoc, MaKhoa, MaLoaiMonHoc, SoTiet) VALUES
('IT001', N'Nhập môn Lập trình', 'KHMT', 'LT', 45), -- 3 Tín chỉ
('IT001.TH', N'Thực hành Nhập môn Lập trình', 'KHMT', 'TH', 30), -- 1 Tín chỉ
('IT003', N'Cấu trúc dữ liệu và Giải thuật', 'KHMT', 'LT', 45), -- 3 Tín chỉ
('IT002', N'Lập trình hướng đối tượng', 'CNPM', 'LT', 45), -- 3 Tín chỉ
('IT002.TH', N'Thực hành lập trình hướng đối tượng', 'CNPM', 'TH', 30), -- 1 Tín chỉ
('IE104', N'Internet và công nghệ web', 'KTTT', 'LT', 45), -- 3 Tín chỉ
('SE104', N'Nhập môn công nghệ phần mềm', 'KHMT', 'LT', 45), -- 3 Tín chỉ
('IS212', N'Thực tập tốt nghiệp', 'HTTT', 'LT', 45); -- 3 Tín chỉ

-- 7. Bảng CT_MONHOCTRUOC
INSERT INTO CT_MONHOCTRUOC (MaMonHoc, MaMonHocTruoc) VALUES
('MH03', 'MH01'); -- Muốn học Cấu trúc dữ liệu (MH03) bắt buộc phải học Nhập môn lập trình (MH01) trước

-- 9. Bảng CHUONGTRINHHOC
INSERT INTO CHUONGTRINHHOC (MaNganh, MaMonHoc, HocKy, GhiChu, KhoaApDung) VALUES
('N01', 'MH01', 'HK1', N'Môn bắt buộc', 'Khóa 2024'),
('N01', 'MH02', 'HK1', N'Môn bắt buộc', 'Khóa 2024'),
('N01', 'MH03', 'HK2', N'Môn bắt buộc', 'Khóa 2024'),
('N03', 'MH04', 'HK1', N'Môn đại chúng', 'Khóa 2024');

-- 10. Bảng SINHVIEN
INSERT INTO SINHVIEN (MaSoSinhVien, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, MaXa, MaNganh, TinhTrang, MaDoiTuong) VALUES
('SV001', N'Nguyễn Văn An', '2005-05-15 00:00:00', N'Nam', '0901234567', 'vanan@gmail.com', 'X01', 'N01', N'Đang học', 'DT00'),
('SV002', N'Trần Thị Bình', '2005-10-20 00:00:00', N'Nữ', '0907654321', 'thibinh@gmail.com', 'X04', 'N01', N'Đang học', 'DT02'),
('SV003', N'Lê Hoàng Nam', '2005-02-28 00:00:00', N'Nam', '0912345678', 'hoangnam@gmail.com', 'X05', 'N03', N'Đang học', 'DT01'),
('SV004', N'Phạm Minh Thư', '2005-08-12 00:00:00', N'Nữ', '0988888888', 'minhthu@gmail.com', 'X02', 'N04', N'Đang học', 'DT03');

-- 11. Bảng HOCKYNAMHOC
INSERT INTO HOCKYNAMHOC (MaHKNH, HocKy, NgayBatDau, NgayKetThuc, HanDongHocPhi) VALUES
('HK1-2425', N'Học kỳ 1 - Năm học 2024-2025', '2024-09-05 00:00:00', '2025-01-15 00:00:00', '2024-10-31 00:00:00'),
('HK2-2425', N'Học kỳ 2 - Năm học 2024-2025', '2025-02-10 00:00:00', '2025-06-20 00:00:00', '2025-03-31 00:00:00');

-- 12. Bảng MONHOCMO
INSERT INTO MONHOCMO (MaMonHocMo, MaHKNH, MaMonHoc) VALUES
('MHM01', 'HK1-2425', 'MH01'),
('MHM02', 'HK1-2425', 'MH02'),
('MHM03', 'HK1-2425', 'MH04'),
('MHM04', 'HK2-2425', 'MH03');

-- 13. Bảng PHIEUDANGKY
-- Tạm tính đơn giá giả định: Lý thuyết 450.000đ/Tín chỉ, Thực hành 550.000đ/Tín chỉ
-- SV001 đăng ký MH01 (3 TC LT = 1.350.000) và MH02 (2 TC TH = 1.100.000) -> Tổng 2.450.000. Không giảm.
-- SV002 đăng ký MH01 (3 TC LT = 1.350.000) và MH02 (2 TC TH = 1.100.000) -> Tổng 2.450.000. Giảm 50% = 1.225.000.
-- SV003 đăng ký MH04 (3 TC LT = 1.350.000) -> Giảm 100% = 1.350.000. Phải đóng: 0đ.
INSERT INTO PHIEUDANGKY (MaPhieu, MaSoSinhVien, NgayLapPhieu, MaHKNH, TongTienDK, TienMienGiam, TongTienPhaiDong, SoTienDaDong, SoTienConLai) VALUES
('P001', 'SV001', '2024-09-10 08:30:00', 'HK1-2425', 2450000.00, 0.00, 2450000.00, 2450000.00, 0.00),
('P002', 'SV002', '2024-09-11 09:15:00', 'HK1-2425', 2450000.00, 1225000.00, 1225000.00, 500000.00, 725000.00),
('P003', 'SV003', '2024-09-12 14:00:00', 'HK1-2425', 1350000.00, 1350000.00, 0.00, 0.00, 0.00);

-- 14. Bảng CT_PHIEUDK
INSERT INTO CT_PHIEUDK (MaPhieuDK, MaMonHoc) VALUES
('P001', 'MH01'),
('P001', 'MH02'),
('P002', 'MH01'),
('P002', 'MH02'),
('P003', 'MH04');

-- 15. Bảng PHIEUTHUHOCPHI
INSERT INTO PHIEUTHUHOCPHI (MaPhieuThu, MaPhieuDK, NgayLapPhieu, SoTienThu) VALUES
('PT001', 'P001', '2024-09-20 10:00:00', 2450000.00), -- SV001 đóng đủ luôn
('PT002', 'P002', '2024-09-25 11:30:00', 500000.00);   -- SV002 mới đóng trước một phần

-- 16. Bảng BC_SVCHUAHOANTHANHHP
INSERT INTO BC_SVCHUAHOANTHANHHP (MaBC, MaHKNH, MaSoSinhVien, SoTienPhaiDong, SoTienConLai) VALUES
('BC01-HK1', 'HK1-2425', 'SV002', 1225000.00, 725000.00); -- Trần Thị Bình còn nợ lại 725.000đ

-- 17. Bảng THAMSO
INSERT INTO THAMSO (TenThamSo, GiaTri) VALUES
('DonGiaTinChi_LyThuyet', '450000'),
('DonGiaTinChi_ThucHanh', '550000'),
('SoTinChiToiDa_HocKy', '24'),
('SoTinChiToiThieu_HocKy', '12');

-- 18. Bảng CHUCNANG
INSERT INTO CHUCNANG (MaChucNang, TenChucNang, TenManHinhDuocLoad) VALUES
('CN_ADMIN', N'Quản trị hệ thống toàn quyền', 'admin.html'),
('CN_PDT', N'Quản lý Đào tạo và Mở môn', 'pdt.html'),
('CN_PTC', N'Quản lý Kế hoạch Học phí và Thu tiền', 'ptc.html'),
('CN_SV', N'Cổng Đăng ký học phần và Công nợ sinh viên', 'sv.html');

-- 19. Bảng NHOMNGUOIDUNG
INSERT INTO NHOMNGUOIDUNG (MaNhom, TenNhom) VALUES
('ADMIN', N'Ban Giám Hiệu / Quản trị tối cao'),
('PDT', N'Cán bộ Phòng Đào Tạo'),
('PTC', N'Cán bộ Phòng Tài Chính - Kế toán'),
('SV', N'Sinh viên nhà trường');

-- 20. Bảng BANGPHANQUYEN
INSERT INTO BANGPHANQUYEN (MaNhom, MaChucNang) VALUES
('ADMIN', 'CN_ADMIN'),
('PDT', 'CN_PDT'),
('PTC', 'CN_PTC'),
('SV', 'CN_SV');

-- 21. Bảng NGUOIDUNG (Tài khoản hệ thống)
-- Chú ý: Tên đăng nhập được đặt theo vai trò vô cùng tường minh để bạn dễ test gõ đăng nhập
INSERT INTO NGUOIDUNG (TenDangNhap, MatKhau, MaNhom) VALUES
('admin', 'admin123', 'ADMIN'),       -- Tài khoản Admin tối cao
('daotao', 'pdt123', 'PDT'),         -- Tài khoản Phòng Đào Tạo (ví dụ cán bộ tên Nguyễn Văn Tâm)
('taichinh', 'ptc123', 'PTC'),       -- Tài khoản Phòng Tài Chính (ví dụ cán bộ tên Lê Thị Hoa)
('SV001', 'sv123', 'SV'),            -- Tài khoản SV Nguyễn Văn An
('SV002', 'sv123', 'SV'),            -- Tài khoản SV Trần Thị Bình
('SV003', 'sv123', 'SV'),            -- Tài khoản SV Lê Hoàng Nam
('SV004', 'sv123', 'SV');            -- Tài khoản SV Phạm Minh Thư
