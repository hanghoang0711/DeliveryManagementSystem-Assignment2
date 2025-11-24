-- ======================================================================
-- 0. TẠO DATABASE
-- ======================================================================
USE master;
GO

-- Kiểm tra nếu database tồn tại thì xóa đi để tạo mới (tránh lỗi conflict dữ liệu cũ)
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'QuanLyGiaoHang_Nhom06')
BEGIN
    -- Đưa về chế độ Single User để kick hết kết nối cũ ra trước khi drop
    ALTER DATABASE QuanLyGiaoHang_Nhom06 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE QuanLyGiaoHang_Nhom06;
END
GO

-- Tạo lại database mới
CREATE DATABASE QuanLyGiaoHang_Nhom06;
GO

-- ======================================================================
-- 1. DROP LOGIN VÀ USER NẾU TỒN TẠI
-- ======================================================================
USE QuanLyGiaoHang_Nhom06;
GO

-- Xóa database user nếu tồn tại
IF EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'sManager')
BEGIN
    DROP USER [sManager];
    PRINT N'Database user sManager đã bị xóa.';
END
GO

USE master;
GO

-- Xóa login nếu tồn tại
IF EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'sManager')
BEGIN
    DROP LOGIN [sManager];
    PRINT N'Login sManager đã bị xóa.';
END
GO

-- ======================================================================
-- 2️. TẠO LẠI LOGIN VÀ DATABASE USER
-- ======================================================================
-- Tạo login mới
CREATE LOGIN [sManager] WITH PASSWORD = N'Nhom6251';
PRINT N'Login sManager đã được tạo.';
GO

-- Tạo database user
USE QuanLyGiaoHang_Nhom06;
GO

CREATE USER [sManager] FOR LOGIN [sManager];
PRINT N'Database user sManager đã được tạo.';
GO

-- Gán quyền db_owner
ALTER ROLE db_owner ADD MEMBER [sManager];
PRINT N'Đã gán quyền db_owner cho sManager.';
GO

-- =====================================================================
-- 3. XÓA BẢNG CŨ
-- =====================================================================
PRINT N'Đang xóa các bảng cũ (nếu có)...';
-- FIX: Xóa tất cả Foreign Key constraints trước để tránh lỗi dependency
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql += 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + 
               QUOTENAME(OBJECT_NAME(parent_object_id)) + 
               ' DROP CONSTRAINT ' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.foreign_keys;
EXEC sp_executesql @sql;
PRINT N'Đã xóa tất cả Foreign Key constraints.';
GO

-- Drop tất cả bảng (không cần quan tâm thứ tự nữa)
PRINT N'Đang xóa tất cả các bảng...';

-- Xóa các bảng tham chiếu đến DON_HANG trước
-- HOA_DON đã bị xóa khỏi ERD
IF OBJECT_ID('DON_HANG_DUOC_TIEP_NHAN', 'U') IS NOT NULL DROP TABLE DON_HANG_DUOC_TIEP_NHAN;
IF OBJECT_ID('DON_HANG_HUY', 'U') IS NOT NULL DROP TABLE DON_HANG_HUY;
IF OBJECT_ID('DON_HANG_HOAN_VE_KHO', 'U') IS NOT NULL DROP TABLE DON_HANG_HOAN_VE_KHO;
IF OBJECT_ID('THONG_TIN_XU_LI_DON_HANG', 'U') IS NOT NULL DROP TABLE THONG_TIN_XU_LI_DON_HANG;
IF OBJECT_ID('DON_HANG_DUOC_GIAO', 'U') IS NOT NULL DROP TABLE DON_HANG_DUOC_GIAO;
IF OBJECT_ID('DANH_GIA_CUA_KHACH_HANG', 'U') IS NOT NULL DROP TABLE DANH_GIA_CUA_KHACH_HANG; -- Tham chiếu DON_HANG

-- Xóa các bảng tham chiếu đến MA_GIAM_GIA và MA_KHUYEN_MAI
IF OBJECT_ID('DON_HANG', 'U') IS NOT NULL DROP TABLE DON_HANG; -- Bảng DON_HANG tham chiếu MA_KHUYEN_MAI, MA_GIAM_GIA
IF OBJECT_ID('MA_GIAM_GIA_THEO_HANG', 'U') IS NOT NULL DROP TABLE MA_GIAM_GIA_THEO_HANG; -- Tham chiếu MA_GIAM_GIA

-- Xóa các bảng MA_GIAM_GIA và MA_KHUYEN_MAI
IF OBJECT_ID('MA_GIAM_GIA', 'U') IS NOT NULL DROP TABLE MA_GIAM_GIA;
IF OBJECT_ID('MA_KHUYEN_MAI', 'U') IS NOT NULL DROP TABLE MA_KHUYEN_MAI; -- Tham chiếu CHUONG_TRINH_KHUYEN_MAI

-- Xóa bảng CHUONG_TRINH_KHUYEN_MAI
IF OBJECT_ID('CHUONG_TRINH_KHUYEN_MAI', 'U') IS NOT NULL DROP TABLE CHUONG_TRINH_KHUYEN_MAI;

-- Xóa các bảng còn lại theo thứ tự dependency (FIX: GIAO_DICH và THANH_TOAN trước KHACH_HANG)
IF OBJECT_ID('YEU_CAU_HO_TRO', 'U') IS NOT NULL DROP TABLE YEU_CAU_HO_TRO; -- Tham chiếu KHACH_HANG
IF OBJECT_ID('GIAO_DICH_DUOC_KIEM_SOAT', 'U') IS NOT NULL DROP TABLE GIAO_DICH_DUOC_KIEM_SOAT; -- Tham chiếu THANH_TOAN và NHANVIEN_TAI_CHINH
IF OBJECT_ID('THANH_TOAN', 'U') IS NOT NULL DROP TABLE THANH_TOAN; -- Tham chiếu KHACH_HANG
IF OBJECT_ID('DIA_CHI_CUA_KHACH_HANG', 'U') IS NOT NULL DROP TABLE DIA_CHI_CUA_KHACH_HANG;
IF OBJECT_ID('SO_DIEN_THOAI_CUA_KHACH_HANG', 'U') IS NOT NULL DROP TABLE SO_DIEN_THOAI_CUA_KHACH_HANG;
IF OBJECT_ID('KHACH_HANG_DOANH_NGHIEP', 'U') IS NOT NULL DROP TABLE KHACH_HANG_DOANH_NGHIEP;
IF OBJECT_ID('KHACH_HANG_CA_NHAN', 'U') IS NOT NULL DROP TABLE KHACH_HANG_CA_NHAN;
IF OBJECT_ID('KHOANG_CACH_VAN_CHUYEN', 'U') IS NOT NULL DROP TABLE KHOANG_CACH_VAN_CHUYEN;
IF OBJECT_ID('CHUYEN_GIAO_HANG', 'U') IS NOT NULL DROP TABLE CHUYEN_GIAO_HANG;
IF OBJECT_ID('SU_DUNG_XE_TAI', 'U') IS NOT NULL DROP TABLE SU_DUNG_XE_TAI;
IF OBJECT_ID('TAI_XE_XE_TAI', 'U') IS NOT NULL DROP TABLE TAI_XE_XE_TAI;
IF OBJECT_ID('SU_DUNG_XE_MAY', 'U') IS NOT NULL DROP TABLE SU_DUNG_XE_MAY;
IF OBJECT_ID('TAI_XE_XE_MAY', 'U') IS NOT NULL DROP TABLE TAI_XE_XE_MAY;
IF OBJECT_ID('TAI_XE_SDT', 'U') IS NOT NULL DROP TABLE TAI_XE_SDT;
IF OBJECT_ID('GHI_CHU_QUAN_LY_TAI_XE', 'U') IS NOT NULL DROP TABLE GHI_CHU_QUAN_LY_TAI_XE;
IF OBJECT_ID('MENTORSHIP', 'U') IS NOT NULL DROP TABLE MENTORSHIP;
IF OBJECT_ID('TAI_XE', 'U') IS NOT NULL DROP TABLE TAI_XE;
IF OBJECT_ID('NHAN_VIEN_DUOC_GIAM_SAT', 'U') IS NOT NULL DROP TABLE NHAN_VIEN_DUOC_GIAM_SAT;
IF OBJECT_ID('QUAN_TRI_VIEN', 'U') IS NOT NULL DROP TABLE QUAN_TRI_VIEN;
IF OBJECT_ID('NHAN_VIEN_QUAN_LY_TAI_XE', 'U') IS NOT NULL DROP TABLE NHAN_VIEN_QUAN_LY_TAI_XE;
IF OBJECT_ID('LINH_VUC_CHUYEN_MON_CUA_NHANVIEN_HO_TRO', 'U') IS NOT NULL DROP TABLE LINH_VUC_CHUYEN_MON_CUA_NHANVIEN_HO_TRO;
IF OBJECT_ID('NHANVIEN_HO_TRO', 'U') IS NOT NULL DROP TABLE NHANVIEN_HO_TRO;
IF OBJECT_ID('NHANVIEN_XU_LI_DON_HANG', 'U') IS NOT NULL DROP TABLE NHANVIEN_XU_LI_DON_HANG;
IF OBJECT_ID('CHUNG_CHI_BANG_CAP_CUA_NHANVIEN_TAI_CHINH', 'U') IS NOT NULL DROP TABLE CHUNG_CHI_BANG_CAP_CUA_NHANVIEN_TAI_CHINH;
IF OBJECT_ID('NHANVIEN_TAI_CHINH', 'U') IS NOT NULL DROP TABLE NHANVIEN_TAI_CHINH;
IF OBJECT_ID('CA_LAM_VIEC_CUA_NHAN_VIEN', 'U') IS NOT NULL DROP TABLE CA_LAM_VIEC_CUA_NHAN_VIEN;
IF OBJECT_ID('KHACH_HANG', 'U') IS NOT NULL DROP TABLE KHACH_HANG; -- Sau khi xóa THANH_TOAN và YEU_CAU_HO_TRO
IF OBJECT_ID('HANG_THANH_VIEN', 'U') IS NOT NULL DROP TABLE HANG_THANH_VIEN;
IF OBJECT_ID('XE', 'U') IS NOT NULL DROP TABLE XE;
IF OBJECT_ID('KHO', 'U') IS NOT NULL DROP TABLE KHO;
IF OBJECT_ID('NHANVIEN', 'U') IS NOT NULL DROP TABLE NHANVIEN;
PRINT N'Đã xóa xong các bảng cũ.';
GO

-- =====================================================================
-- 4. TẠO CÁC BẢNG THEO 43 BẢNG MAPPING
-- =====================================================================

-- Bảng 1: NHANVIEN
CREATE TABLE NHANVIEN (
    Ma_nhan_vien VARCHAR(10) PRIMARY KEY,
    Gioi_tinh NVARCHAR(10) CHECK (Gioi_tinh IN (N'Nam', N'Nữ', N'Khác')),
    Ho_va_ten_lot NVARCHAR(50) NOT NULL,
    Ten NVARCHAR(50) NOT NULL,
    Ngay_sinh DATE NOT NULL,
    Dia_chi NVARCHAR(255),
    SDT VARCHAR(10) UNIQUE,
    email VARCHAR(100) UNIQUE,
    CCCD VARCHAR(12) NOT NULL UNIQUE,
    Ngay_bat_dau_lam DATE NOT NULL,
    Vai_tro NVARCHAR(50) NOT NULL,
    CONSTRAINT CK_NHANVIEN_Tuoi CHECK (DATEDIFF(YEAR, Ngay_sinh, GETDATE()) >= 18),
    CONSTRAINT CK_NHANVIEN_NgayLam CHECK (Ngay_bat_dau_lam > Ngay_sinh)
);
GO

-- Bảng 2: CA_LAM_VIEC_CUA_NHAN_VIEN (Thuộc tính đa trị)
CREATE TABLE CA_LAM_VIEC_CUA_NHAN_VIEN (
    Ma_nhan_vien VARCHAR(10) NOT NULL,
    Ca_lam_viec NVARCHAR(50) NOT NULL,
    PRIMARY KEY (Ma_nhan_vien, Ca_lam_viec),
    CONSTRAINT FK_CLV_NHANVIEN FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN(Ma_nhan_vien) ON DELETE CASCADE
);
GO

-- Bảng 3: NHANVIEN_TAI_CHINH (Chuyên biệt hóa)
CREATE TABLE NHANVIEN_TAI_CHINH (
    Ma_nhan_vien VARCHAR(10) PRIMARY KEY,
    So_luong_giao_dich_da_xu_li INT DEFAULT 0,
    CONSTRAINT FK_NVTC_NHANVIEN FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN(Ma_nhan_vien) ON DELETE CASCADE
);
GO

-- Bảng 4: CHUNG_CHI_BANG_CAP_CUA_NHANVIEN_TAI_CHINH (Thuộc tính đa trị)
CREATE TABLE CHUNG_CHI_BANG_CAP_CUA_NHANVIEN_TAI_CHINH (
    Ma_nhan_vien VARCHAR(10) NOT NULL,
    Chung_chi_bang_cap NVARCHAR(100) NOT NULL,
    PRIMARY KEY (Ma_nhan_vien, Chung_chi_bang_cap),
    CONSTRAINT FK_CCBC_NVTC FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN_TAI_CHINH(Ma_nhan_vien) ON DELETE CASCADE
);
GO

-- Bảng 35: HANG_THANH_VIEN
CREATE TABLE HANG_THANH_VIEN (
    Ten_hang NVARCHAR(50) PRIMARY KEY,
    Diem_thanh_vien_toi_thieu INT NOT NULL CHECK (Diem_thanh_vien_toi_thieu >= 0),
    Mo_ta_quyen_loi NVARCHAR(255)
);
GO

-- Bảng 38: KHACH_HANG
CREATE TABLE KHACH_HANG (
    Ma_khach_hang VARCHAR(10) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    Diem_thanh_vien INT DEFAULT 0 CHECK (Diem_thanh_vien >= 0),
    Ten_hang NVARCHAR(50),
    Ngay_len_hang DATE,
    Ngay_het_han DATE,
    CONSTRAINT FK_KH_HANGTHANHVIEN FOREIGN KEY (Ten_hang) REFERENCES HANG_THANH_VIEN(Ten_hang),
    CONSTRAINT CK_KH_NgayHetHan CHECK (Ngay_het_han IS NULL OR Ngay_het_han >= Ngay_len_hang)
);
GO

-- Bảng 6: THANH_TOAN
CREATE TABLE THANH_TOAN (
    Ma_thanh_toan VARCHAR(10) PRIMARY KEY,
    Ma_khach_hang VARCHAR(10) NOT NULL,
    phuong_thuc NVARCHAR(50) NOT NULL,
    trang_thai_giao_dich NVARCHAR(50) NOT NULL DEFAULT N'Thành công',
    so_tien_thanh_toan MONEY NOT NULL CHECK (so_tien_thanh_toan > 0),
    thoi_gian_thanh_toan DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_TT_KHACHHANG FOREIGN KEY (Ma_khach_hang) REFERENCES KHACH_HANG(Ma_khach_hang)
);
GO

-- Bảng 5: GIAO_DICH_DUOC_KIEM_SOAT (Quan hệ 1-1)
CREATE TABLE GIAO_DICH_DUOC_KIEM_SOAT (
    Ma_thanh_toan VARCHAR(10) PRIMARY KEY,
    Ma_nhan_vien VARCHAR(10) NOT NULL,
    Thoi_diem_xac_minh DATETIME,
    Tinh_trang_xac_minh NVARCHAR(50),
    CONSTRAINT FK_GDKS_THANHTOAN FOREIGN KEY (Ma_thanh_toan) REFERENCES THANH_TOAN(Ma_thanh_toan),
    CONSTRAINT FK_GDKS_NVTC FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN_TAI_CHINH(Ma_nhan_vien)
);
GO

-- Bảng 33: CHUONG_TRINH_KHUYEN_MAI
CREATE TABLE CHUONG_TRINH_KHUYEN_MAI (
    Ma_chuong_trinh VARCHAR(10) PRIMARY KEY,
    Ten_chuong_trinh NVARCHAR(100) NOT NULL UNIQUE,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    mo_ta NVARCHAR(255),
    CONSTRAINT CK_CTKM_Ngay CHECK (ngay_ket_thuc >= ngay_bat_dau)
);
GO

-- Bảng 34: MA_KHUYEN_MAI (Thực thể yếu)
CREATE TABLE MA_KHUYEN_MAI (
    Ma_chuong_trinh VARCHAR(10) NOT NULL,
    Ma_khuyen_mai VARCHAR(10) NOT NULL,
    dieu_kien_ap_dung NVARCHAR(255) NOT NULL,
    muc_giam DECIMAL(10, 2) NOT NULL CHECK (muc_giam > 0),
    PRIMARY KEY (Ma_chuong_trinh, Ma_khuyen_mai),
    CONSTRAINT FK_MKM_CTKM FOREIGN KEY (Ma_chuong_trinh) REFERENCES CHUONG_TRINH_KHUYEN_MAI(Ma_chuong_trinh) ON DELETE CASCADE
);
GO

-- Bảng 37: MA_GIAM_GIA
CREATE TABLE MA_GIAM_GIA (
    Ma_giam_gia VARCHAR(10) PRIMARY KEY,
    Muc_giam DECIMAL(10, 2) NOT NULL CHECK (Muc_giam > 0),
    Dieu_kien_ap_dung NVARCHAR(255) NOT NULL
);
GO

-- Bảng 36: MA_GIAM_GIA_THEO_HANG (Quan hệ M-N)
CREATE TABLE MA_GIAM_GIA_THEO_HANG (
    Ten_hang NVARCHAR(50) NOT NULL,
    Ma_giam_gia VARCHAR(10) NOT NULL,
    PRIMARY KEY (Ten_hang, Ma_giam_gia),
    CONSTRAINT FK_MGGTH_HANGTHANHVIEN FOREIGN KEY (Ten_hang) REFERENCES HANG_THANH_VIEN(Ten_hang),
    CONSTRAINT FK_MGGTH_MAGIAMGIA FOREIGN KEY (Ma_giam_gia) REFERENCES MA_GIAM_GIA(Ma_giam_gia)
);
GO

-- ===========================
--           UPDATE          
-- ===========================
-- Bảng 20: DON_HANG (CẬP NHẬT: Thêm 4 trường mới, cập nhật trạng thái)
CREATE TABLE DON_HANG (
    Ma_don_hang VARCHAR(10) PRIMARY KEY,
    Trang_thai_don NVARCHAR(50) NOT NULL DEFAULT N'Đang xử lí', -- Cập nhật trạng thái mặc định
    Thoi_gian_lay_hang_du_kien DATETIME,
    Thoi_gian_giao_hang_du_kien DATETIME NOT NULL,
    Ma_khuyen_mai_CT VARCHAR(10), -- Tách ra để tham chiếu đúng FK
    Ma_khuyen_mai_KM VARCHAR(10), -- Tách ra để tham chiếu đúng FK
    Ma_giam_gia VARCHAR(10),
    thoi_gian_dat_don DATETIME NOT NULL DEFAULT GETDATE(),
    gia_tri_hang_hoa_phi_van_chuyen MONEY NOT NULL CHECK (gia_tri_hang_hoa_phi_van_chuyen >= 0),
    
    -- ===== THÊM 4 TRƯỜNG MỚI =====
    phi_van_chuyen_goc MONEY NOT NULL CHECK (phi_van_chuyen_goc >= 0),
    so_tien_duoc_giam MONEY DEFAULT 0 CHECK (so_tien_duoc_giam >= 0),
    phi_van_chuyen_sau_giam MONEY NOT NULL CHECK (phi_van_chuyen_sau_giam >= 0),
    quang_duong DECIMAL(10, 2) NOT NULL CHECK (quang_duong > 0), -- Đơn vị: km
    -- ===========================
    
    SDT_nguoi_nhan VARCHAR(15) NOT NULL,
    ten_nguoi_nhan NVARCHAR(100) NOT NULL,
    can_nang DECIMAL(5, 2) NOT NULL CHECK (can_nang > 0),
    dia_chi_giao_hang NVARCHAR(255) NOT NULL,
    dia_chi_lay_hang NVARCHAR(255) NOT NULL,
    diem_tich_luy INT DEFAULT 0,
    phuong_thuc_giao_hang NVARCHAR(50) NOT NULL,
    Ma_khach_hang VARCHAR(10) NOT NULL,
    CONSTRAINT FK_DH_KHACHHANG FOREIGN KEY (Ma_khach_hang) REFERENCES KHACH_HANG(Ma_khach_hang),
    CONSTRAINT FK_DH_MAKHUYENMAI FOREIGN KEY (Ma_khuyen_mai_CT, Ma_khuyen_mai_KM) REFERENCES MA_KHUYEN_MAI(Ma_chuong_trinh, Ma_khuyen_mai),
    CONSTRAINT FK_DH_MAGIAMGIA FOREIGN KEY (Ma_giam_gia) REFERENCES MA_GIAM_GIA(Ma_giam_gia),
    CONSTRAINT CK_DH_ThoiGianGiao CHECK (Thoi_gian_giao_hang_du_kien > thoi_gian_dat_don),
    CONSTRAINT CK_DH_ThoiGianLay CHECK (Thoi_gian_lay_hang_du_kien IS NULL OR (Thoi_gian_lay_hang_du_kien > thoi_gian_dat_don AND Thoi_gian_giao_hang_du_kien > Thoi_gian_lay_hang_du_kien)),
    CONSTRAINT CK_DH_PhiVanChuyen CHECK (phi_van_chuyen_sau_giam = phi_van_chuyen_goc - so_tien_duoc_giam),
    CONSTRAINT CK_DH_TrangThaiDon CHECK (Trang_thai_don IN (
        N'Đang xử lý',
        N'Đang tìm tài xế',
        N'Đã tìm được tài xế',
        N'Đang lấy hàng',
        N'Lấy hàng thành công',
        N'Lấy hàng thất bại',
        N'Đang giao hàng',
        N'Giao hàng thành công',
        N'Giao hàng thất bại',
        N'Đã hoàn về kho',
        N'Đã hoàn thành'
    ))
);
GO


-- Bảng 7: HOA_DON - ĐÃ BỊ XÓA KHỎI ERD (Thông tin thanh toán đã được tích hợp vào DON_HANG)

-- Bảng 8: NHANVIEN_XU_LI_DON_HANG (Chuyên biệt hóa)
CREATE TABLE NHANVIEN_XU_LI_DON_HANG (
    Ma_nhan_vien VARCHAR(10) PRIMARY KEY,
    So_luong_don_hang_da_xu_li INT DEFAULT 0,
    CONSTRAINT FK_NVXLDH_NHANVIEN FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN(Ma_nhan_vien) ON DELETE CASCADE
);
GO

-- Bảng 9: DON_HANG_DUOC_TIEP_NHAN (Quan hệ M-N)
CREATE TABLE DON_HANG_DUOC_TIEP_NHAN (
    Ma_don_hang VARCHAR(10) NOT NULL,
    Ma_nhan_vien VARCHAR(10) NOT NULL,
    PRIMARY KEY (Ma_don_hang, Ma_nhan_vien),
    CONSTRAINT FK_DHTN_DONHANG FOREIGN KEY (Ma_don_hang) REFERENCES DON_HANG(Ma_don_hang),
    CONSTRAINT FK_DHTN_NVXLDH FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN_XU_LI_DON_HANG(Ma_nhan_vien)
);
GO

-- Bảng 10: NHANVIEN_HO_TRO (Chuyên biệt hóa)
CREATE TABLE NHANVIEN_HO_TRO (
    Ma_nhan_vien VARCHAR(10) PRIMARY KEY,
    So_luong_ho_tro_da_xu_li INT DEFAULT 0,
    CONSTRAINT FK_NVHT_NHANVIEN FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN(Ma_nhan_vien) ON DELETE CASCADE
);
GO

-- Bảng 11: LINH_VUC_CHUYEN_MON_CUA_NHANVIEN_HO_TRO (Thuộc tính đa trị)
CREATE TABLE LINH_VUC_CHUYEN_MON_CUA_NHANVIEN_HO_TRO (
    Ma_nhan_vien VARCHAR(10) NOT NULL,
    Linh_vuc_ho_tro_chuyen_mon NVARCHAR(100) NOT NULL,
    PRIMARY KEY (Ma_nhan_vien, Linh_vuc_ho_tro_chuyen_mon),
    CONSTRAINT FK_LVCM_NVHT FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN_HO_TRO(Ma_nhan_vien) ON DELETE CASCADE
);
GO

-- Bảng 12: YEU_CAU_HO_TRO
CREATE TABLE YEU_CAU_HO_TRO (
    Ma_yeu_cau VARCHAR(10) PRIMARY KEY,
    Ma_khach_hang VARCHAR(10) NOT NULL,
    Thoi_diem_tao DATETIME NOT NULL DEFAULT GETDATE(),
    Loai_van_de NVARCHAR(50) NOT NULL,
    Noi_dung NVARCHAR(MAX) NOT NULL,
    Ma_nhan_vien VARCHAR(10),
    Thoi_diem_tiep_nhan DATETIME,
    Thoi_diem_phan_hoi DATETIME,
    Noi_dung_phan_hoi NVARCHAR(MAX),
    Trang_thai_xu_ly NVARCHAR(50) DEFAULT N'Chờ xử lý', -- Thêm cột trạng thái xử lý
    CONSTRAINT FK_YCHT_KHACHHANG FOREIGN KEY (Ma_khach_hang) REFERENCES KHACH_HANG(Ma_khach_hang),
    CONSTRAINT FK_YCHT_NVHT FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN_HO_TRO(Ma_nhan_vien),
    CONSTRAINT CK_YCHT_ThoiGianPhanHoi CHECK (Thoi_diem_phan_hoi IS NULL OR Thoi_diem_phan_hoi >= Thoi_diem_tiep_nhan),
    CONSTRAINT CK_YCHT_ThoiGianTiepNhan CHECK (Thoi_diem_tiep_nhan IS NULL OR Thoi_diem_tiep_nhan >= Thoi_diem_tao)
);
GO

-- Bảng 14: QUAN_TRI_VIEN (Chuyên biệt hóa)
CREATE TABLE QUAN_TRI_VIEN (
    Ma_nhan_vien VARCHAR(10) PRIMARY KEY,
    Cap_quan_tri NVARCHAR(50) NOT NULL,
    CONSTRAINT FK_QTV_NHANVIEN FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN(Ma_nhan_vien) ON DELETE CASCADE
);
GO

-- Bảng 13: NHAN_VIEN_DUOC_GIAM_SAT (Quan hệ 1-N)
CREATE TABLE NHAN_VIEN_DUOC_GIAM_SAT (
    Ma_nhan_vien VARCHAR(10) PRIMARY KEY, -- Một nhân viên chỉ bị giám sát bởi 1 quản trị?
    Ma_quan_tri_vien VARCHAR(10) NOT NULL,
    Ngay_bat_dau DATE NOT NULL,
    CONSTRAINT FK_NVDGS_NHANVIEN FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN(Ma_nhan_vien) ON DELETE CASCADE,
    CONSTRAINT FK_NVDGS_QTV FOREIGN KEY (Ma_quan_tri_vien) REFERENCES QUAN_TRI_VIEN(Ma_nhan_vien) -- Không CASCADE để tránh lỗi vòng lặp
);
GO

-- Bảng 15: NHAN_VIEN_QUAN_LY_TAI_XE (Chuyên biệt hóa)
CREATE TABLE NHAN_VIEN_QUAN_LY_TAI_XE (
    Ma_nhan_vien VARCHAR(10) PRIMARY KEY,
    So_luong_tai_xe_dang_phu_trach INT DEFAULT 0,
    CONSTRAINT FK_NVQLTX_NHANVIEN FOREIGN KEY (Ma_nhan_vien) REFERENCES NHANVIEN(Ma_nhan_vien) ON DELETE CASCADE
);
GO

-- Bảng 25: TAI_XE
CREATE TABLE TAI_XE (
    DriverID VARCHAR(10) PRIMARY KEY,
    Ho_ten NVARCHAR(100) NOT NULL, -- Gộp họ tên
    CCCD VARCHAR(12) NOT NULL UNIQUE,
    Gioi_Tinh NVARCHAR(10) CHECK (Gioi_Tinh IN (N'Nam', N'Nữ', N'Khác')),
    Ngay_Sinh DATE NOT NULL,
    Ngay_Bat_Dau_Lam_Viec DATE NOT NULL,
    Trang_Thai NVARCHAR(50) NOT NULL DEFAULT N'Sẵn sàng',
    Ma_Nhan_Vien_quan_li VARCHAR(10) NOT NULL,
    Ngay_Bat_Dau_Quan_Ly DATE NOT NULL, -- Thêm ngày bắt đầu quản lý
    Rating DECIMAL(2,1) DEFAULT 5.0, -- Thêm Rating
    CONSTRAINT FK_TX_NVQLTX FOREIGN KEY (Ma_Nhan_Vien_quan_li) REFERENCES NHAN_VIEN_QUAN_LY_TAI_XE(Ma_nhan_vien),
    CONSTRAINT CK_TX_Tuoi CHECK (DATEDIFF(YEAR, Ngay_Sinh, GETDATE()) >= 18),
    CONSTRAINT CK_TX_NgayLamViec CHECK (Ngay_Bat_Dau_Lam_Viec > Ngay_Sinh),
    CONSTRAINT CK_TX_NgayQuanLy CHECK (Ngay_Bat_Dau_Quan_Ly >= Ngay_Bat_Dau_Lam_Viec)
);
GO

-- Bảng 16: GHI_CHU_QUAN_LY_TAI_XE
CREATE TABLE GHI_CHU_QUAN_LY_TAI_XE (
    Ma_tai_xe VARCHAR(10) NOT NULL,
    Thoi_gian DATETIME NOT NULL,
    Noi_dung NVARCHAR(500) NOT NULL, -- Bỏ PK ở đây nếu nội dung có thể dài
    PRIMARY KEY (Ma_tai_xe, Thoi_gian),
    CONSTRAINT FK_GCQLTX_TAIXE FOREIGN KEY (Ma_tai_xe) REFERENCES TAI_XE(DriverID) ON DELETE CASCADE
);
GO

-- Bảng 17: KHO
CREATE TABLE KHO (
    Ma_kho INT PRIMARY KEY IDENTITY(1,1), -- Dùng INT IDENTITY cho dễ
    Vi_tri NVARCHAR(255) NOT NULL,
    Tinh_trang NVARCHAR(50) DEFAULT N'Hoạt động'
);
GO

-- Bảng 18: DON_HANG_HOAN_VE_KHO
CREATE TABLE DON_HANG_HOAN_VE_KHO (
    Ma_don_hang VARCHAR(10) PRIMARY KEY,
    Ma_kho INT NOT NULL,
    Thoi_gian_hoan DATETIME NOT NULL DEFAULT GETDATE(),
    Li_do_hoan NVARCHAR(255),
    CONSTRAINT FK_DHHVK_DONHANG FOREIGN KEY (Ma_don_hang) REFERENCES DON_HANG(Ma_don_hang),
    CONSTRAINT FK_DHHVK_KHO FOREIGN KEY (Ma_kho) REFERENCES KHO(Ma_kho)
);
GO

-- Bảng 19: DON_HANG_HUY
CREATE TABLE DON_HANG_HUY (
    Ma_don_hang VARCHAR(10) PRIMARY KEY,
    Ma_khach_hang VARCHAR(10) NOT NULL,
    Thoi_gian_huy DATETIME NOT NULL DEFAULT GETDATE(),
    Ly_do_huy NVARCHAR(255) NOT NULL,
    CONSTRAINT FK_DHHUY_DONHANG FOREIGN KEY (Ma_don_hang) REFERENCES DON_HANG(Ma_don_hang),
    CONSTRAINT FK_DHHUY_KHACHHANG FOREIGN KEY (Ma_khach_hang) REFERENCES KHACH_HANG(Ma_khach_hang)
);
GO

-- Bảng 32: XE
CREATE TABLE XE (
    VehicleID VARCHAR(10) PRIMARY KEY,
    Bien_so_xe VARCHAR(20) NOT NULL UNIQUE,
    Chu_so_huu NVARCHAR(100),
    Tinh_trang_xe NVARCHAR(50) NOT NULL DEFAULT N'Sẵn sàng',
    Nam_san_xuat CHAR(4),
    Xe_May_Flag BIT DEFAULT 0,
    Phan_khoi INT,
    Khoang_cho DECIMAL(5, 2), -- kg
    Xe_Tai_Flag BIT DEFAULT 0,
    Trong_Tai INT, -- kg
    Loai_thung NVARCHAR(50),
    CONSTRAINT CK_XE_TypeFlags CHECK ((Xe_May_Flag = 1 AND Xe_Tai_Flag = 0) OR (Xe_May_Flag = 0 AND Xe_Tai_Flag = 1)),
    CONSTRAINT CK_XE_XeMayInfo CHECK (Xe_May_Flag = 0 OR (Phan_khoi IS NOT NULL AND Khoang_cho IS NOT NULL)),
    CONSTRAINT CK_XE_XeTaiInfo CHECK (Xe_Tai_Flag = 0 OR (Trong_Tai IS NOT NULL AND Loai_thung IS NOT NULL))
);
GO

-- ===========================
--           UPDATE          
-- ===========================
-- Bảng 21: CHUYEN_GIAO_HANG (CẬP NHẬT: Bỏ Tong_quang_duong, Thu_tu_*, Thêm so_luong_don_gop)
CREATE TABLE CHUYEN_GIAO_HANG (
    DeliveryID VARCHAR(10) PRIMARY KEY,
    -- Tong_quang_duong_van_chuyen đã bị XÓA (có thể tính từ DON_HANG)
    -- Thu_tu_lay_hang, Thu_tu_giao_hang đã CHUYỂN sang DON_HANG_DUOC_GIAO
    
    so_luong_don_gop INT DEFAULT 0 CHECK (so_luong_don_gop >= 0), -- TRƯỜNG MỚI: Số đơn gộp trong chuyến (0 khi mới tạo)
    
    DriverID VARCHAR(10) ,
    --ThoiGianBatDau DATETIME NOT NULL DEFAULT GETDATE(),
    --ThoiGianKetThuc DATETIME,
    TrangThaiChuyen NVARCHAR(50) DEFAULT N'Đang thực hiện',
    CONSTRAINT FK_CGH_TAIXE FOREIGN KEY (DriverID) REFERENCES TAI_XE(DriverID) ON DELETE SET NULL ,
    --CONSTRAINT FK_CGH_XE FOREIGN KEY (VehicleID) REFERENCES XE(VehicleID),
    --CONSTRAINT CK_CGH_ThoiGian CHECK (ThoiGianKetThuc IS NULL OR ThoiGianKetThuc >= ThoiGianBatDau)
);
GO

-- Bảng 22: THONG_TIN_XU_LI_DON_HANG (Lịch sử trạng thái)
CREATE TABLE THONG_TIN_XU_LI_DON_HANG (
    Ma_don_hang VARCHAR(10) NOT NULL,
    Thoi_gian DATETIME NOT NULL DEFAULT GETDATE(),
    Tinh_trang NVARCHAR(50) NOT NULL,
    MaNVXuLy VARCHAR(10), -- Nhân viên nào cập nhật trạng thái
    PRIMARY KEY (Ma_don_hang, Thoi_gian, Tinh_trang),
    CONSTRAINT FK_TTXL_DONHANG FOREIGN KEY (Ma_don_hang) REFERENCES DON_HANG(Ma_don_hang),
    CONSTRAINT FK_TTXL_NHANVIEN FOREIGN KEY (MaNVXuLy) REFERENCES NHANVIEN(Ma_nhan_vien)
);
GO

-- ===========================
--           UPDATE          
-- ===========================
-- Bảng 23: DON_HANG_DUOC_GIAO (CẬP NHẬT: Thêm Thu_tu_lay_hang và Thu_tu_giao_hang)
CREATE TABLE DON_HANG_DUOC_GIAO (
    DeliveryID VARCHAR(10) NOT NULL,
    Ma_don_hang VARCHAR(10) NOT NULL,
    Thoi_gian_giao_hang_thuc_te DATETIME,
    Thoi_gian_lay_hang_thuc_te DATETIME,

    Thoi_diem_gop_don DATETIME NOT NULL DEFAULT GETDATE(), -- Thời điểm đơn hàng được gộp vào chuyến
    -- ===== THÊM 2 TRƯỜNG MỚI (Chuyển từ CHUYEN_GIAO_HANG) =====
    Thu_tu_lay_hang INT NOT NULL CHECK (Thu_tu_lay_hang >= 1), -- Thứ tự lấy hàng trong chuyến
    Thu_tu_giao_hang INT NOT NULL CHECK (Thu_tu_giao_hang >= 1), -- Thứ tự giao hàng trong chuyến
    -- =========================================================
    
    ThuTuGiao INT, -- Giữ lại để backward compatible (có thể xóa sau)
    PRIMARY KEY (DeliveryID, Ma_don_hang),
    CONSTRAINT FK_DHDG_CGH FOREIGN KEY (DeliveryID) REFERENCES CHUYEN_GIAO_HANG(DeliveryID),
    CONSTRAINT FK_DHDG_DONHANG FOREIGN KEY (Ma_don_hang) REFERENCES DON_HANG(Ma_don_hang),
    CONSTRAINT CK_DHDG_ThoiGianGiao CHECK (Thoi_gian_giao_hang_thuc_te IS NULL OR Thoi_gian_lay_hang_thuc_te IS NULL OR Thoi_gian_giao_hang_thuc_te >= Thoi_gian_lay_hang_thuc_te),
    CONSTRAINT CK_DHDG_GopDonSomHonLayHang CHECK (Thoi_diem_gop_don <= Thoi_gian_lay_hang_thuc_te)
);
GO

-- Bảng 24: KHOANG_CACH_VAN_CHUYEN (Có thể không cần thiết nếu tính toán được)
CREATE TABLE KHOANG_CACH_VAN_CHUYEN (
    DeliveryID VARCHAR(10) NOT NULL,
    Khoang_cach DECIMAL(10, 2) NOT NULL CHECK (Khoang_cach >= 0),
    PRIMARY KEY (DeliveryID, Khoang_cach),
    CONSTRAINT FK_KCVC_CGH FOREIGN KEY (DeliveryID) REFERENCES CHUYEN_GIAO_HANG(DeliveryID)
);
GO

-- Bảng 26: TAI_XE_SDT (Thuộc tính đa trị)
CREATE TABLE TAI_XE_SDT (
    DriverID VARCHAR(10) NOT NULL,
    SDT VARCHAR(10) NOT NULL,
    PRIMARY KEY (DriverID, SDT),
    CONSTRAINT FK_TXSDT_TAIXE FOREIGN KEY (DriverID) REFERENCES TAI_XE(DriverID) ON DELETE CASCADE
);
GO

-- Bảng 27: TAI_XE_XE_MAY (Chuyên biệt hóa)
CREATE TABLE TAI_XE_XE_MAY (
    DriverID VARCHAR(10) PRIMARY KEY,
    Bang_lai_A_A1 NVARCHAR(50) NOT NULL,
    Bien_ban_hoat_dong NVARCHAR(100),
    Loai_hang_chuyen_cho NVARCHAR(100),
    CONSTRAINT FK_TXXM_TAIXE FOREIGN KEY (DriverID) REFERENCES TAI_XE(DriverID) ON DELETE CASCADE
);
GO

-- Bảng 28: TAI_XE_XE_TAI (Chuyên biệt hóa)
CREATE TABLE TAI_XE_XE_TAI (
    DriverID VARCHAR(10) PRIMARY KEY,
    Bang_lai_B_B1_C NVARCHAR(50) NOT NULL,
    Suc_chua_toi_da DECIMAL(10, 2), -- Đơn vị? kg?
    Kinh_nghiem_van_chuyen NVARCHAR(255),
    CONSTRAINT FK_TXXT_TAIXE FOREIGN KEY (DriverID) REFERENCES TAI_XE(DriverID) ON DELETE CASCADE
);
GO

-- Bảng 29: MENTORSHIP (Quan hệ M-N)
CREATE TABLE MENTORSHIP (
    MentorID VARCHAR(10) NOT NULL,
    MenteeID VARCHAR(10) NOT NULL,
    Ngay_Bat_Dau DATE NOT NULL,
    Ngay_Ket_Thuc DATE,
    Muc_do_tien_bo NVARCHAR(100),
    Danh_Gia NVARCHAR(MAX),
    PRIMARY KEY (MentorID, MenteeID, Ngay_Bat_Dau), -- Thêm Ngay_Bat_Dau vào PK để cho phép mentorship lại
    CONSTRAINT FK_MS_MENTOR FOREIGN KEY (MentorID) REFERENCES TAI_XE(DriverID),
    CONSTRAINT FK_MS_MENTEE FOREIGN KEY (MenteeID) REFERENCES TAI_XE(DriverID),
    CONSTRAINT CK_MS_ThoiGian CHECK (Ngay_Ket_Thuc IS NULL OR Ngay_Ket_Thuc >= Ngay_Bat_Dau),
    CONSTRAINT CK_MS_KhongTuMentor CHECK (MentorID != MenteeID)
);
GO

-- Bảng 30: SU_DUNG_XE_MAY (Quan hệ M-N)
CREATE TABLE SU_DUNG_XE_MAY (
    DriverID VARCHAR(10) NOT NULL,
    VehicleID VARCHAR(10) NOT NULL,
    PRIMARY KEY (DriverID, VehicleID),
    CONSTRAINT FK_SDXM_TAIXEXEMAY FOREIGN KEY (DriverID) REFERENCES TAI_XE_XE_MAY(DriverID) ON DELETE CASCADE ,
    CONSTRAINT FK_SDXM_XE FOREIGN KEY (VehicleID) REFERENCES XE(VehicleID)
);
GO

-- Bảng 31: SU_DUNG_XE_TAI (Quan hệ M-N)
CREATE TABLE SU_DUNG_XE_TAI (
    DriverID VARCHAR(10) NOT NULL,
    VehicleID VARCHAR(10) NOT NULL,
    PRIMARY KEY (DriverID, VehicleID),
    CONSTRAINT FK_SDXT_TAIXEXETAI FOREIGN KEY (DriverID) REFERENCES TAI_XE_XE_TAI(DriverID)ON DELETE CASCADE ,
    CONSTRAINT FK_SDXT_XE FOREIGN KEY (VehicleID) REFERENCES XE(VehicleID)
);
GO

-- Bảng 39: KHACH_HANG_CA_NHAN (Chuyên biệt hóa)
CREATE TABLE KHACH_HANG_CA_NHAN (
    Ma_khach_hang VARCHAR(10) PRIMARY KEY,
    Ho_va_ten_lot NVARCHAR(50),
    Ten NVARCHAR(50),
	Gioi_tinh NVARCHAR(10) CHECK (Gioi_tinh IN (N'Nam', N'Nữ')),
    Ngay_sinh DATE,
    CONSTRAINT FK_KHCN_KHACHHANG FOREIGN KEY (Ma_khach_hang) REFERENCES KHACH_HANG(Ma_khach_hang) ON DELETE CASCADE
);
GO

-- Bảng 40: KHACH_HANG_DOANH_NGHIEP (Chuyên biệt hóa)
CREATE TABLE KHACH_HANG_DOANH_NGHIEP (
    Ma_khach_hang VARCHAR(10) PRIMARY KEY,
    Ten NVARCHAR(150) NOT NULL, -- Tên doanh nghiệp
    Ma_so_thue VARCHAR(15) UNIQUE NOT NULL,
    CONSTRAINT FK_KHDN_KHACHHANG FOREIGN KEY (Ma_khach_hang) REFERENCES KHACH_HANG(Ma_khach_hang) ON DELETE CASCADE
);
GO

-- Bảng 41: DANH_GIA_CUA_KHACH_HANG (Đánh giá đơn hàng và tài xế?)
CREATE TABLE DANH_GIA_CUA_KHACH_HANG (
    Review_ID VARCHAR(10) PRIMARY KEY, -- Tạo khóa chính riêng
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment NVARCHAR(255),
    Thoi_diem_DG DATETIME NOT NULL DEFAULT GETDATE(),
    Ma_khach_hang VARCHAR(10) NOT NULL,
    Ma_don_hang VARCHAR(10) NOT NULL,
    DriverID VARCHAR(10), -- Thêm DriverID nếu đánh giá cả tài xế
    CONSTRAINT FK_DGCKH_KHACHHANG FOREIGN KEY (Ma_khach_hang) REFERENCES KHACH_HANG(Ma_khach_hang),
    CONSTRAINT FK_DGCKH_DONHANG FOREIGN KEY (Ma_don_hang) REFERENCES DON_HANG(Ma_don_hang),
    CONSTRAINT FK_DGCKH_TAIXE FOREIGN KEY (DriverID) REFERENCES TAI_XE(DriverID) ON DELETE CASCADE 
    -- Nên có ràng buộc UNIQUE(Ma_khach_hang, Ma_don_hang) để mỗi đơn hàng chỉ được đánh giá 1 lần?
);
GO

-- Bảng 42: SO_DIEN_THOAI_CUA_KHACH_HANG (Thuộc tính đa trị)
CREATE TABLE SO_DIEN_THOAI_CUA_KHACH_HANG (
    Ma_khach_hang VARCHAR(10) NOT NULL,
    So_dien_thoai VARCHAR(15) NOT NULL,
    PRIMARY KEY (Ma_khach_hang, So_dien_thoai),
    CONSTRAINT FK_SDTCKH_KHACHHANG FOREIGN KEY (Ma_khach_hang) REFERENCES KHACH_HANG(Ma_khach_hang) ON DELETE CASCADE
);
GO

-- Bảng 43: DIA_CHI_CUA_KHACH_HANG (Thuộc tính đa trị)
CREATE TABLE DIA_CHI_CUA_KHACH_HANG (
    Ma_khach_hang VARCHAR(10) NOT NULL,
    Dia_chi NVARCHAR(255) NOT NULL,
    PRIMARY KEY (Ma_khach_hang, Dia_chi),
    CONSTRAINT FK_DCCKH_KHACHHANG FOREIGN KEY (Ma_khach_hang) REFERENCES KHACH_HANG(Ma_khach_hang) ON DELETE CASCADE
);
GO

-- =====================================================================
-- HOÀN TẤT TẠO BẢNG
-- =====================================================================

PRINT N'Đã tạo xong tất cả các bảng!';
GO

-- =====================================================================
-- 4. INSERT DỮ LIỆU
-- =====================================================================
PRINT N'';
PRINT N'=====================================================================';
PRINT N'4. INSERT DỮ LIỆU ';
PRINT N'=====================================================================';
GO

-- Chèn dữ liệu theo thứ tự dependency
PRINT N'--- Chèn dữ liệu HANG_THANH_VIEN ---';
INSERT INTO HANG_THANH_VIEN (Ten_hang, Diem_thanh_vien_toi_thieu, Mo_ta_quyen_loi) VALUES
(N'Đồng', 0, N'Ưu đãi cơ bản'),
(N'Bạc', 500, N'Giảm giá 5% một số dịch vụ'),
(N'Vàng', 2000, N'Giảm giá 10%, ưu tiên hỗ trợ'),
(N'Kim Cương', 5000, N'Giảm giá 15%, quà tặng sinh nhật');
GO

PRINT N'--- Chèn dữ liệu KHACH_HANG ---';
INSERT INTO KHACH_HANG (Ma_khach_hang, email, Diem_thanh_vien, Ten_hang, Ngay_len_hang, Ngay_het_han) VALUES
('KH1', 'nguyenvanhien@email.com', 150, N'Đồng', '2025-01-15', '2026-01-14'),
('KH2', 'tranvanbanh@email.com', 600, N'Bạc', '2025-03-20', '2026-03-19'),
('KH3', 'cty_tnhh_sendo@email.com', 2500, N'Vàng', '2024-11-01', '2025-10-31'),
('KH4', 'lethidung@email.com', 5500, N'Kim Cương', '2025-05-10', '2026-05-09'),
('KH5', 'phamthanhdat@email.com', 850, N'Bạc', '2024-12-20', '2025-12-19'),
('KH6', 'nguyendoha@email.com', 1250, N'Vàng', '2025-03-01', '2026-02-28'),
('KH7', 'nguyenvanson@email.com', 2700, N'Đồng', '2024-11-05', '2025-11-04'),
('KH8', 'cty_Metan@email.com', 5000, N'Kim Cương', '2024-10-01', '2025-09-30'),
('KH9', 'gdNgoiSao@email.com', 5000, N'Kim Cương', '2024-10-01', '2025-09-30');
GO

PRINT N'--- Chèn dữ liệu KHACH_HANG_CA_NHAN & KHACH_HANG_DOANH_NGHIEP ---';
INSERT INTO KHACH_HANG_CA_NHAN (Ma_khach_hang, Gioi_tinh, Ho_va_ten_lot, Ten, Ngay_sinh) VALUES
('KH1', N'Nam', N'Nguyễn Văn', N'Hiền', '1995-08-21'),
('KH2', N'Nam', N'Trần Văn', N'Bảnh', '2000-04-12'),
('KH4', N'Nữ', N'Lê Thị', N'Dung', '1998-12-05'),
('KH5', N'Nam', N'Phạm Thành', N'Đạt', '2005-04-13'),
('KH6', N'Nữ', N'Nguyễn Đỗ', N'Hà', '1996-05-25'),
('KH7', N'Nam', N'Nguyễn Văn', N'Sơn', '1999-10-12');

INSERT INTO KHACH_HANG_DOANH_NGHIEP (Ma_khach_hang, Ten, Ma_so_thue) VALUES
('KH3', N'Công ty TNHH Sen Đỏ', '0312345678'),
('KH8', N'Công ty TNHH Metan', '0327777777'),
('KH9', N'Công ty Cổ Phần Giáo dục Kỹ Năng Ngôi Sao', '0817888999');
GO

PRINT N'--- Chèn dữ liệu SO_DIEN_THOAI_CUA_KHACH_HANG & DIA_CHI_CUA_KHACH_HANG ---';
INSERT INTO SO_DIEN_THOAI_CUA_KHACH_HANG (Ma_khach_hang, So_dien_thoai) VALUES
('KH1', '0901234567'), ('KH1', '0901110001'),
('KH2', '0912345678'),
('KH3', '0987654321'), ('KH3', '0283123456'),
('KH4', '0977112233'), ('KH4', '0325432101'), ('KH4', '0329632587'),
('KH5', '0327333277'),
('KH6', '0327333222'),
('KH7', '0321654321');

INSERT INTO DIA_CHI_CUA_KHACH_HANG (Ma_khach_hang, Dia_chi) VALUES
('KH1', N'123 Đường Nguyễn Trãi, Quận 1, TP. HCM'), ('KH1', N'KTX Khu A, ĐHQG'),
('KH2', N'456 Đường Võ Văn Ngân, Quận Thủ Đức, TP. HCM'),
('KH3', N'789 Đường Tân Cảng, Quận Bình Thạnh, TP. HCM'), ('KH3', N'VP Cty C, Quận 3'),
('KH4', N'101 Đường Nguyễn Văn Linh, Quận 7, TP. HCM'), ('KH4', N'Số 1, Đường Nguyễn Công Trứ, phường Đông Hoà, Dĩ An, Bình Dương'),
('KH5', N'25 Đường Phan Xích Long, Quận Phú Nhuận, TP. HCM'),
('KH6', N'12A Đường Lê Duẩn, Quận 1, TP. HCM'),
('KH7', N'89 Đường Nguyễn Văn Cừ, Quận 5, TP. HCM');
GO

PRINT N'--- Chèn dữ liệu NHANVIEN ---';
INSERT INTO NHANVIEN (Ma_nhan_vien, Gioi_tinh, Ho_va_ten_lot, Ten, Ngay_sinh, Dia_chi, SDT, email, CCCD, Ngay_bat_dau_lam, Vai_tro) VALUES
('NV0001', N'Nữ', N'Hoàng Thị', N'Hằng', '2001-05-10', N'KTX Khu A, ĐHQG', '0911111111', 'hang.hoang@email.com', '123456789011', '2025-09-01', N'Quản trị viên'),
('NV0002', N'Nam', N'Nguyễn Thành', N'Công', '2000-02-15', N'KTX Khu B, ĐHQG', '0922222222', 'cong.nguyen@email.com', '123456789012', '2025-09-01', N'Quản lý tài xế'),
('NV0003', N'Nữ', N'Lê Thúy', N'Hiền', '2002-07-20', N'Dĩ An, Bình Dương', '0933333333', 'hien.le@email.com', '123456789013', '2025-10-01', N'Xử lý đơn hàng'),
('NV0004', N'Nam', N'Đậu Minh', N'Khôi', '1999-11-25', N'Thủ Đức, TP. HCM', '0944444444', 'khoi.dau@email.com', '123456789014', '2025-10-01', N'Hỗ trợ khách hàng'),
('NV0005', N'Nữ', N'Bùi Thị Ngọc', N'Huyền', '2003-01-30', N'Biên Hòa, Đồng Nai', '0955555555', 'huyen.bui@email.com', '123456789015', '2025-11-01', N'Tài chính'),
('NV0006', N'Nữ', N'Nguyễn Hải', N'Đường', '2000-01-2', N'Nguyễn Văn Nghi, Gò Vấp', '0966666666','duong.nguyen@email.com', '123456789016', '2022-10-01', N'Hỗ trợ khách hàng');
GO

PRINT N'--- Chèn dữ liệu CA_LAM_VIEC_CUA_NHAN_VIEN ---';
INSERT INTO CA_LAM_VIEC_CUA_NHAN_VIEN (Ma_nhan_vien, Ca_lam_viec) VALUES
('NV0001', N'Hành chính'),
('NV0002', N'Hành chính'),
('NV0003', N'Ca sáng'), ('NV0003', N'Ca chiều'),
('NV0004', N'Ca sáng'), ('NV0004', N'Ca tối'),
('NV0005', N'Hành chính');
GO

PRINT N'--- Chèn dữ liệu QUAN_TRI_VIEN, NHAN_VIEN_QUAN_LY_TAI_XE,... ---';
INSERT INTO QUAN_TRI_VIEN(Ma_nhan_vien, Cap_quan_tri) VALUES ('NV0001', N'Admin hệ thống');
INSERT INTO NHAN_VIEN_QUAN_LY_TAI_XE(Ma_nhan_vien, So_luong_tai_xe_dang_phu_trach) VALUES ('NV0002', 10);
INSERT INTO NHANVIEN_XU_LI_DON_HANG(Ma_nhan_vien, So_luong_don_hang_da_xu_li) VALUES ('NV0003', 10);
INSERT INTO NHANVIEN_HO_TRO(Ma_nhan_vien, So_luong_ho_tro_da_xu_li) VALUES ('NV0004', 70), ('NV0006', 15);
INSERT INTO NHANVIEN_TAI_CHINH(Ma_nhan_vien, So_luong_giao_dich_da_xu_li) VALUES ('NV0005', 100);
GO

PRINT N'--- Chèn dữ liệu NHAN_VIEN_DUOC_GIAM_SAT ---';
INSERT INTO NHAN_VIEN_DUOC_GIAM_SAT(Ma_nhan_vien, Ma_quan_tri_vien, Ngay_bat_dau) VALUES
('NV0002', 'NV0001', '2025-09-01'),
('NV0003', 'NV0001', '2025-10-01'),
('NV0004', 'NV0001', '2025-10-01'),
('NV0005', 'NV0001', '2025-11-01');
GO

PRINT N'--- Chèn dữ liệu LINH_VUC_CHUYEN_MON_CUA_NHANVIEN_HO_TRO ---';
INSERT INTO LINH_VUC_CHUYEN_MON_CUA_NHANVIEN_HO_TRO(Ma_nhan_vien, Linh_vuc_ho_tro_chuyen_mon) VALUES
('NV0004', N'Xử lý khiếu nại và phản hồi khách hàng'),
('NV0004', N'Tư vấn và chăm sóc khách hàng'),
('NV0006', N'Hỗ trợ kỹ thuật và hướng dẫn sử dụng'),
('NV0006', N'Quản lý dữ liệu và phản hồi khách hàng');
GO

PRINT N'--- Chèn dữ liệu CHUNG_CHI_BANG_CAP_CUA_NHANVIEN_TAI_CHINH ---';
INSERT INTO CHUNG_CHI_BANG_CAP_CUA_NHANVIEN_TAI_CHINH(Ma_nhan_vien, Chung_chi_bang_cap) VALUES
('NV0005', N'Chứng chỉ Kế toán viên'), ('NV0005', N'Cử nhân Tài chính');
GO

PRINT N'--- Chèn dữ liệu XE ---';
INSERT INTO XE (VehicleID, Bien_so_xe, Chu_so_huu, Tinh_trang_xe, Nam_san_xuat, Xe_May_Flag, Phan_khoi, Khoang_cho, Xe_Tai_Flag, Trong_Tai, Loai_thung) VALUES
('VHC001', '59-A1 12345', N'Nguyễn Văn Rê', N'Sẵn sàng', '2022', 1, 150, 50, 0, NULL, NULL),
('VHC002', '60-B2 67890', N'Trần Thị Phương', N'Sẵn sàng', '2023', 1, 125, 40, 0, NULL, NULL),
('VHC003', '51-C3 11223', N'Đỗ Giang Thần', N'Đang bảo trì', '2021', 0, NULL, NULL, 1, 1500, N'Kín'),
('VHC004', '72-D4 44556', N'Lê Văn Hậu', N'Sẵn sàng', '2024', 1, 110, 30, 0, NULL, NULL),
('VHC005', N'61-E5 77889', N'Phạm Thị Yến Nhi', N'Sẵn sàng', '2020', 0, NULL, NULL, 1, 1000, N'Mui bạt'),
('VHC006', '70-A1 55678', N'Ngô Văn Tùng', N'Sẵn sàng', '2023', 1, 155, 40, 0, NULL, NULL),
('VHC007', '71-B2 66789', N'Đinh Thị Trang', N'Sẵn sàng', '2024', 1, 125, 45, 0, NULL, NULL),
('VHC008', '72-C3 77890', N'Hoàng Văn Toàn', N'Đang bảo trì', '2021', 0, NULL, NULL, 1, 1200, N'Mui bạt'),
('VHC009', '73-D4 88901', N'Lý Thị Hương', N'Sẵn sàng', '2022', 1, 150, 55, 0, NULL, NULL),
('VHC010', '74-E5 99012', N'Phan Văn Hòa', N'Sẵn sàng', '2023', 0, NULL, NULL, 1, 1800, N'Kín');
GO

PRINT N'--- Chèn dữ liệu TAI_XE ---';
INSERT INTO TAI_XE (DriverID, Ho_ten, CCCD, Gioi_Tinh, Ngay_Sinh, Ngay_Bat_Dau_Lam_Viec, Trang_Thai, Ma_Nhan_Vien_quan_li, Ngay_Bat_Dau_Quan_Ly, Rating) VALUES
('DRV001', N'Nguyễn Văn Rê', '079123456781', N'Nam', '1998-03-11', '2023-11-10', N'Sẵn sàng', 'NV0002', '2025-11-10', 5.0),
('DRV002', N'Trần Thị Phương', '079123456782', N'Nữ', '2002-09-05', '2025-11-15', N'Sẵn sàng', 'NV0002', '2025-11-15', 4.5),
('DRV003', N'Đỗ Giang Thần', '0790123456', N'Nam', '1988-09-09', '2024-12-15', N'Sẵn sàng', 'NV0002', '2025-11-15', 5.0),
('DRV004', N'Lê Văn Hậu', '079123456783', N'Nam', '1995-12-20', '2025-11-20', N'Đang giao hàng', 'NV0002', '2025-11-20', 5.0),
('DRV005', N'Phạm Thị Yến Nhi', '079123456784', N'Nữ', '2004-06-25', '2025-11-25', N'Sẵn sàng', 'NV0002', '2025-11-25', 5.0), 
('DRV006', N'Ngô Văn Tùng', '079123456785', N'Nam', '1997-07-11', '2025-11-10', N'Sẵn sàng', 'NV0002', '2025-11-10', 5.0),
('DRV007', N'Đinh Thị Trang', '079123456786', N'Nữ', '1999-08-09', '2025-11-12', N'Sẵn sàng', 'NV0002', '2025-11-12', 5.0),
('DRV008', N'Hoàng Văn Toàn', '079123456787', N'Nam', '1990-10-10', '2025-11-15', N'Sẵn sàng', 'NV0002', '2025-11-15', 4.7),
('DRV009', N'Lý Thị Hương', '079123456788', N'Nữ', '1998-02-14', '2025-11-18', N'Sẵn sàng', 'NV0002', '2025-11-18', 5.0),
('DRV010', N'Phan Văn Hòa', '079123456789', N'Nam', '1985-05-05', '2025-11-20', N'Sẵn sàng', 'NV0002', '2025-11-20', 5.0);
GO

PRINT N'--- Chèn dữ liệu TAI_XE_SDT ---';
INSERT INTO TAI_XE_SDT(DriverID, SDT) VALUES
('DRV001', '0905111222'), ('DRV001', '0905333444'),
('DRV002', '0905555666'),
('DRV003', '0905777888'),
('DRV004', '0905999000'),
('DRV005', '0905999111'),
('DRV006', '0906000001'),
('DRV007', '0906000002'),
('DRV008', '0906000003'),
('DRV009', '0906000004'),
('DRV010', '0906000005');
GO

PRINT N'--- Chèn dữ liệu TAI_XE_XE_MAY & TAI_XE_XE_TAI ---';
INSERT INTO TAI_XE_XE_MAY (DriverID, Bang_lai_A_A1, Loai_hang_chuyen_cho) VALUES
('DRV001', 'A1', N'Hàng hóa nhẹ'),
('DRV002', 'A2', N'Hàng hóa nhẹ'), -- Giả sử có bằng A2
('DRV003', 'A1', N'Hàng hóa nhẹ'),
('DRV006', 'A1', N'Đồ ăn'),
('DRV007', 'A2', N'Đồ ăn, hàng nhẹ'),
('DRV009', 'A1', N'Đồ ăn, hàng nhẹ');
INSERT INTO TAI_XE_XE_TAI (DriverID, Bang_lai_B_B1_C, Suc_chua_toi_da, Kinh_nghiem_van_chuyen) VALUES
('DRV004', 'B2', 1000, N'1 năm kinh nghiệm giao hàng nội thất'),
('DRV008', 'B2', 1200, N'2 năm giao hàng vật liệu xây dựng'),
('DRV010', 'C', 1800, N'3 năm giao hàng nông sản');
GO

PRINT N'--- Chèn dữ liệu SU_DUNG_XE_MAY & SU_DUNG_XE_TAI ---';
-- Lưu ý: Khóa chính mới là (DriverID, VehicleID)
INSERT INTO SU_DUNG_XE_MAY (DriverID, VehicleID) VALUES
('DRV001', 'VHC001'),
('DRV002', 'VHC002'),
('DRV003', 'VHC004'),
('DRV006', 'VHC006'),
('DRV007', 'VHC007'),
('DRV009', 'VHC009');
-- Thử insert trùng PK sẽ lỗi: INSERT INTO SU_DUNG_XE_MAY (DriverID, VehicleID) VALUES ('DRV001', 'VHC001');

INSERT INTO SU_DUNG_XE_TAI (DriverID, VehicleID) VALUES
('DRV004', 'VHC005'),
('DRV008', 'VHC008'),
('DRV010', 'VHC010');
GO

PRINT N'--- Chèn dữ liệu MENTORSHIP ---';
INSERT INTO MENTORSHIP(MentorID, MenteeID, Ngay_Bat_Dau, Ngay_Ket_Thuc, Muc_do_tien_bo, Danh_Gia) VALUES
('DRV001', 'DRV002', '2025-11-15', NULL, N'Tốt', N'Nhanh nhẹn, cẩn thận'),
('DRV001', 'DRV003', '2025-11-20', '2025-12-20', N'Khá', N'Cần cải thiện tốc độ'),
('DRV001', 'DRV005', '2025-11-25', NULL, N'Tốt', N'Học nhanh, biết lắng nghe'),
('DRV002', 'DRV006', '2025-11-28', NULL, N'Khá', N'Tích cực, cần cải thiện kỹ năng định vị'),
('DRV003', 'DRV007', '2025-11-30', '2025-12-30', N'Rất tốt', N'Có tiến bộ rõ rệt, đúng giờ và nhiệt tình');
GO

PRINT N'--- Chèn dữ liệu GHI_CHU_QUAN_LY_TAI_XE ---';
INSERT INTO GHI_CHU_QUAN_LY_TAI_XE(Ma_tai_xe, Thoi_gian, Noi_dung) VALUES
('DRV001', GETDATE()-2, N'Hoàn thành tốt chuyến giao đầu tiên'),
('DRV002', GETDATE()-1, N'Được khách hàng khen ngợi thái độ phục vụ'),
('DRV003', GETDATE()-0.5, N'Đi trễ 15 phút do kẹt xe'),
('DRV004', GETDATE()-0.1, N'Cần bổ sung giấy tờ xe tải'),
('DRV005', GETDATE()-0.3, N'Hoàn thành đơn hàng sớm hơn dự kiến'),
('DRV006', GETDATE()-1.2, N'Giao hàng sai địa chỉ, đã khắc phục kịp thời'),
('DRV007', GETDATE()-0.8, N'Được khách hàng đánh giá 5 sao về thái độ phục vụ');
GO

PRINT N'--- Chèn dữ liệu MA_GIAM_GIA ---';
INSERT INTO MA_GIAM_GIA (Ma_giam_gia, Muc_giam, Dieu_kien_ap_dung) VALUES
('VCFREE15', 15000, N'Đơn hàng từ 100k'),
('AHA5', 5, N'Giảm 5% tối đa 20k'),
('NEWUSER', 50000, N'Khách hàng mới'),
('FREESHIP', 20000, N'Đơn hàng giao nội thành'),
('LOYAL15', 10, N'Khách hàng thân thiết giảm 15%'),
('LOYAL10', 10, N'Khách hàng thân thiết giảm 10%');
GO

PRINT N'--- Chèn dữ liệu MA_GIAM_GIA_THEO_HANG ---';
INSERT INTO MA_GIAM_GIA_THEO_HANG (Ten_hang, Ma_giam_gia) VALUES
(N'Vàng', 'VCFREE15'),
(N'Vàng', 'LOYAL10'),
(N'Vàng', 'AHA5'),
(N'Vàng', 'FREESHIP'),
(N'Kim Cương', 'LOYAL15'),
(N'Kim Cương', 'VCFREE15'),
(N'Kim Cương', 'AHA5'),
(N'Kim Cương', 'FREESHIP'),
(N'Bạc', 'AHA5'),
(N'Đồng', 'NEWUSER');
GO

PRINT N'--- Chèn dữ liệu CHUONG_TRINH_KHUYEN_MAI ---';
INSERT INTO CHUONG_TRINH_KHUYEN_MAI (Ma_chuong_trinh, Ten_chuong_trinh, ngay_bat_dau, ngay_ket_thuc, mo_ta) VALUES
('KMHE2025', N'Khuyến mãi hè', '2025-06-01', '2025-08-31', N'Giảm giá các dịch vụ giao hàng'),
('BF2025', N'Black Friday Sale', '2025-11-28', '2025-11-30', N'Giảm giá sốc'),
('TET2026', N'Tết Nguyên Đán 2026', '2026-01-20', '2026-02-10', N'Giảm giá đầu năm, tri ân khách hàng'),
('WEEKEND20', N'Cuối tuần rộn ràng', '2025-11-01', '2025-12-31', N'Giảm 20% phí giao hàng vào thứ 7 và chủ nhật');
GO

PRINT N'--- Chèn dữ liệu MA_KHUYEN_MAI ---';
INSERT INTO MA_KHUYEN_MAI(Ma_chuong_trinh, Ma_khuyen_mai, dieu_kien_ap_dung, muc_giam) VALUES
('KMHE2025', 'SUMMER10', N'Áp dụng cho đơn hàng nội thành', 10), -- Giảm 10%
('KMHE2025', 'SUMMERFREE', N'Miễn phí vận chuyển đơn từ 200k', 100), -- Giảm 100% (Free ship)
('BF2025', 'BF50', N'Giảm 50% tối đa 50k', 50),
('TET2026', 'TETLIXI', N'Khách hàng nhận lì xì 30k cho đơn hàng trên 100k', 30000),
('WEEKEND20', 'WKND20', N'Giảm 20% phí giao hàng vào thứ 7, CN', 20);
GO

PRINT N'--- Chèn dữ liệu THANH_TOAN ---';
INSERT INTO THANH_TOAN (Ma_thanh_toan, Ma_khach_hang, phuong_thuc, trang_thai_giao_dich, so_tien_thanh_toan, thoi_gian_thanh_toan) VALUES
('TT001', 'KH1', N'MoMo', N'Thành công', 85000, '2025-10-25 09:30'),
('TT002', 'KH2', N'Thẻ tín dụng', N'Thành công', 155000, '2025-10-26 14:00'),
('TT003', 'KH3', N'Thanh toán chuyển khoản', N'Thành công', 120000, '2025-10-27 11:00'),
('TT004', 'KH4', N'Tiền mặt', N'Thành công', 200000, '2025-10-28 08:15'),
('TT005', 'KH5', N'MoMo', N'Thành công', 95000, '2025-10-29 16:20'),
('TT006', 'KH6', N'ZaloPay', N'Thành công', 130000, '2025-10-29 17:15'),
('TT007', 'KH2', N'Thẻ tín dụng', N'Thành công', 230000, '2025-10-30 09:50'),
('TT008', 'KH3', N'Ví điện tử VNPay', N'Thành công', 180000, '2025-10-30 11:00'),
('TT009', 'KH1', N'MoMo', N'Thành công', 175000, '2025-10-30 14:10'),
('TT010', 'KH4', N'Thanh toán chuyển khoản', N'Thành công', 240000, '2025-10-31 10:30');
GO

PRINT N'--- Chèn dữ liệu GIAO_DICH_DUOC_KIEM_SOAT ---';
INSERT INTO GIAO_DICH_DUOC_KIEM_SOAT (Ma_thanh_toan, Ma_nhan_vien, Thoi_diem_xac_minh, Tinh_trang_xac_minh) VALUES
('TT001', 'NV0005', '2025-10-25 10:00', N'Đã xác minh'),
('TT002', 'NV0005', '2025-10-26 15:00', N'Đã xác minh'),
('TT003', 'NV0005', '2025-10-27 11:30', N'Đã xác minh'),
('TT004', 'NV0005', '2025-10-28 09:00', N'Đã xác minh'),
('TT005', 'NV0005', '2025-10-29 17:00', N'Đã xác minh');
GO

-- ===========================
--           UPDATE          
-- ===========================
PRINT N'--- Chèn dữ liệu DON_HANG (CẬP NHẬT: Thêm 4 trường mới) ---';
INSERT INTO DON_HANG (Ma_don_hang, Trang_thai_don, Thoi_gian_lay_hang_du_kien, Thoi_gian_giao_hang_du_kien,
    Ma_khuyen_mai_CT, Ma_khuyen_mai_KM, Ma_giam_gia, thoi_gian_dat_don, gia_tri_hang_hoa_phi_van_chuyen,
    phi_van_chuyen_goc, so_tien_duoc_giam, phi_van_chuyen_sau_giam, quang_duong,
    SDT_nguoi_nhan, ten_nguoi_nhan, can_nang, dia_chi_giao_hang, dia_chi_lay_hang, diem_tich_luy, phuong_thuc_giao_hang, Ma_khach_hang)
VALUES
('DH001', N'Đang giao hàng', '2025-10-26 08:00', '2025-10-26 11:00', 'KMHE2025', 'SUMMER10', 'VCFREE15', '2025-10-25 09:00', 85000, 50000, 7500, 42500, 12.5, '0901110001', N'Nguyễn Minh', 2.5, N'Quận 3, TP.HCM', N'Quận 1, TP.HCM', 10, N'Giao nhanh', 'KH1'),
('DH002', N'Giao hàng thành công', '2025-10-27 09:00', '2025-10-27 12:30', 'BF2025', 'BF50', 'AHA5', '2025-10-26 15:00', 155000, 60000, 9000, 51000, 15.2, '0912345678', N'Trần Bá', 3.0, N'Thủ Đức, TP.HCM', N'Bình Thạnh, TP.HCM', 15, N'Tiêu chuẩn', 'KH2'),
('DH003', N'Giao hàng thành công', '2025-10-27 08:30', '2025-10-27 13:30', 'WEEKEND20', 'WKND20', 'LOYAL15', '2025-10-27 07:30', 120000, 70000, 10500, 59500, 18.0, '0987654321', N'Lê Quang', 4.0, N'Quận 5, TP.HCM', N'Quận 1, TP.HCM', 25, N'Giao nhanh', 'KH3'),
('DH004', N'Giao hàng thất bại', '2025-10-28 10:00', '2025-10-28 14:00', 'TET2026', 'TETLIXI', 'NEWUSER', '2025-10-28 09:00', 200000, 80000, 12000, 68000, 25.0, '0977112233', N'Lê Hoa', 5.5, N'Quận 7, TP.HCM', N'Bình Dương', 0, N'Tiêu chuẩn', 'KH4'),
('DH005', N'Đang giao hàng', '2025-10-29 07:45', '2025-10-29 12:00', 'KMHE2025', 'SUMMER10', 'AHA5', '2025-10-29 07:00', 95000, 45000, 6750, 38250, 8.7, '0327333277', N'Phạm Hòa', 2.0, N'Phú Nhuận, TP.HCM', N'Quận 3, TP.HCM', 12, N'Giao nhanh', 'KH5'),
('DH006', N'Giao hàng thành công', '2025-10-29 10:00', '2025-10-29 14:00', NULL, NULL, 'LOYAL10', '2025-10-29 09:00', 130000, 55000, 5500, 49500, 10.5, '0327333222', N'Nguyễn Hải', 4.5, N'Quận 1, TP.HCM', N'Gò Vấp, TP.HCM', 18, N'Tiêu chuẩn', 'KH6'),
('DH007', N'Đang tìm tài xế', NULL, '2025-10-30 13:00', NULL, NULL, 'FREESHIP', '2025-10-30 09:00', 230000, 65000, 0, 65000, 20.0, '0912345678', N'Trần Đăng', 3.2, N'Thủ Đức, TP.HCM', N'Bình Thạnh, TP.HCM', 10, N'Tiêu chuẩn', 'KH2'),
('DH008', N'Giao hàng thành công', '2025-10-30 11:00', '2025-10-30 16:00', 'WEEKEND20', 'WKND20', NULL, '2025-10-30 10:30', 180000, 75000, 11250, 63750, 22.5, '0987654321', N'Lê Hoàng', 6.0, N'Bình Thạnh, TP.HCM', N'Quận 5, TP.HCM', 15, N'Tiêu chuẩn', 'KH3'),
('DH009', N'Đã hoàn thành', '2025-10-30 13:00', '2025-10-30 17:30', 'KMHE2025', 'SUMMERFREE', 'VCFREE15', '2025-10-30 12:00', 175000, 52000, 7800, 44200, 14.0, '0901234567', N'Nguyễn Văn B', 2.0, N'Quận 1, TP.HCM', N'Thủ Đức', 20, N'Giao nhanh', 'KH1'),
('DH010', N'Đang xử lý', '2025-10-31 08:00', '2025-10-31 13:00', 'BF2025', 'BF50', 'LOYAL15', '2025-10-31 07:30', 240000, 90000, 13500, 76500, 30.0, '0977112233', N'Lê Mai', 5.0, N'Quận 7, TP.HCM', N'Bình Dương', 5, N'Tiêu chuẩn', 'KH4');
GO

-- HOA_DON ĐÃ BỊ XÓA - Thông tin thanh toán đã được tích hợp vào DON_HANG

PRINT N'--- Chèn dữ liệu KHO ---';
INSERT INTO KHO (Vi_tri, Tinh_trang) VALUES
(N'Kho Bình Thạnh, TP.HCM', N'Hoạt động'),
(N'Kho Quận 7, TP.HCM', N'Hoạt động'),
(N'Kho Thủ Đức, TP.HCM', N'Hoạt động'),
(N'Kho Biên Hòa, Đồng Nai', N'Đang bảo trì'),
(N'Kho Dĩ An, Bình Dương', N'Hoạt động');
GO

PRINT N'--- Chèn dữ liệu DON_HANG_HOAN_VE_KHO ---';
INSERT INTO DON_HANG_HOAN_VE_KHO (Ma_don_hang, Ma_kho, Thoi_gian_hoan, Li_do_hoan) VALUES
('DH004', 2, '2025-10-28 15:00', N'Khách hủy đơn trước khi giao');
GO

PRINT N'--- Chèn dữ liệu DON_HANG_HUY ---';
INSERT INTO DON_HANG_HUY (Ma_don_hang, Ma_khach_hang, Thoi_gian_huy, Ly_do_huy) VALUES
('DH004', 'KH4', '2025-10-28 15:00', N'Khách không nhận hàng, yêu cầu hủy đơn');
GO

-- ===========================
--           UPDATE          
-- ===========================
PRINT N'--- Chèn dữ liệu CHUYEN_GIAO_HANG (FIX: Bỏ VehicleID) ---';
-- Loại bỏ cột VehicleID khỏi danh sách cột và danh sách VALUES
INSERT INTO CHUYEN_GIAO_HANG (DeliveryID, so_luong_don_gop, DriverID, TrangThaiChuyen) VALUES
('CGH001', 1, 'DRV001', N'Đang thực hiện'),
('CGH002', 1, 'DRV002', N'Đang thực hiện'),
('CGH003', 1, 'DRV003', N'Đã hủy'),
('CGH004', 2, 'DRV006', N'Hoàn thành'),
('CGH005', 3, 'DRV008', N'Hoàn thành');
GO
-- ===========================
--           UPDATE          
-- ===========================
PRINT N'--- Chèn dữ liệu DON_HANG_DUOC_GIAO (FIX: Bỏ Thoi_diem_giao_du_kien) ---';
-- Cập nhật danh sách cột: Bỏ Thoi_diem_giao_du_kien
INSERT INTO DON_HANG_DUOC_GIAO (DeliveryID, Ma_don_hang, Thoi_gian_giao_hang_thuc_te, Thoi_gian_lay_hang_thuc_te, Thu_tu_lay_hang, Thu_tu_giao_hang, ThuTuGiao, Thoi_diem_gop_don) VALUES
('CGH001', 'DH001', '2025-10-26 10:50', '2025-10-26 08:00', 1, 1, 1, '2025-10-26 07:45'), 
('CGH002', 'DH002', '2025-10-27 12:10', '2025-10-27 09:00', 1, 1, 1, '2025-10-27 08:45'),
('CGH003', 'DH003', '2025-10-27 13:00', '2025-10-27 08:30', 1, 1, 1, '2025-10-27 08:15'),
('CGH004', 'DH005', '2025-10-29 11:50', '2025-10-29 07:45', 1, 1, 1, '2025-10-29 07:30'),
('CGH004', 'DH006', '2025-10-29 13:40', '2025-10-29 10:00', 2, 2, 2, '2025-10-29 09:45'),
('CGH005', 'DH007', NULL, '2025-10-30 09:00', 1, 1, 1, '2025-10-30 08:45'), -- Đơn hàng DH007 chưa giao thành công (NULL)
('CGH005', 'DH008', '2025-10-30 15:30', '2025-10-30 11:00', 2, 2, 2, '2025-10-30 10:45'),
('CGH005', 'DH009', '2025-10-30 17:00', '2025-10-30 13:00', 3, 3, 3, '2025-10-30 12:45');
GO

PRINT N'--- Chèn dữ liệu KHOANG_CACH_VAN_CHUYEN ---';
INSERT INTO KHOANG_CACH_VAN_CHUYEN (DeliveryID, Khoang_cach) VALUES
('CGH001', 12.5), ('CGH002', 15.2), ('CGH003', 18.0), ('CGH004', 8.7), ('CGH005', 20.0);
GO

PRINT N'--- Chèn dữ liệu THONG_TIN_XU_LI_DON_HANG ---';
INSERT INTO THONG_TIN_XU_LI_DON_HANG (Ma_don_hang, Thoi_gian, Tinh_trang, MaNVXuLy) VALUES
('DH001', '2025-10-25 09:05', N'Đã tiếp nhận', 'NV0003'),
('DH001', '2025-10-26 08:00', N'Đang giao', 'NV0003'),
('DH002', '2025-10-26 15:10', N'Đã tiếp nhận', 'NV0003'),
('DH002', '2025-10-27 12:30', N'Đã giao', 'NV0003'),
('DH003', '2025-10-27 07:40', N'Đã tiếp nhận', 'NV0003'),
('DH003', '2025-10-27 13:30', N'Đã giao', 'NV0003'),
('DH004', '2025-10-28 09:15', N'Đang xử lý', 'NV0003'),
('DH004', '2025-10-28 15:00', N'Đã hủy', 'NV0003'),
('DH005', '2025-10-29 07:10', N'Đang giao', 'NV0003'),
('DH006', '2025-10-29 09:15', N'Đã tiếp nhận', 'NV0003'),
('DH006', '2025-10-29 14:00', N'Đã giao', 'NV0003');
GO

PRINT N'--- Chèn dữ liệu DON_HANG_DUOC_TIEP_NHAN ---';
INSERT INTO DON_HANG_DUOC_TIEP_NHAN (Ma_don_hang, Ma_nhan_vien) VALUES
('DH001', 'NV0003'), ('DH002', 'NV0003'), ('DH003', 'NV0003'), ('DH004', 'NV0003');
GO

PRINT N'--- Chèn dữ liệu YEU_CAU_HO_TRO ---';
-- SỬA LỖI: Thêm cột Thoi_diem_tao và chèn dữ liệu cũ hơn Thoi_diem_tiep_nhan
INSERT INTO YEU_CAU_HO_TRO (Ma_yeu_cau, Ma_khach_hang, Thoi_diem_tao, Loai_van_de, Noi_dung, Ma_nhan_vien, Thoi_diem_tiep_nhan, Thoi_diem_phan_hoi, Noi_dung_phan_hoi, Trang_thai_xu_ly) VALUES
('YC0001', 'KH2', GETDATE()-1, N'Khiếu nại', N'Tài xế giao hàng trễ 30 phút so với dự kiến cho đơn DH000X.', 'NV0004', GETDATE()-0.5, GETDATE()-0.4, N'Xin lỗi quý khách về sự chậm trễ. Hệ thống ghi nhận và sẽ làm việc lại với tài xế.', N'Đã xử lý'),
('YC0002', 'KH3', GETDATE()-0.3, N'Tư vấn dịch vụ', N'Công ty tôi muốn gửi hàng số lượng lớn hàng tuần, có gói cước ưu đãi nào không?', 'NV0004', GETDATE()-0.2, NULL, NULL, N'Đang xử lý'),
('YC0003', 'KH1', GETDATE(), N'Hỗ trợ kỹ thuật', N'Tôi không áp dụng được mã giảm giá VCFREE15.', NULL, NULL, NULL, NULL, N'Chờ xử lý'),
('YC0004', 'KH4', GETDATE()-2.1, N'Khiếu nại', N'Hàng hóa bị móp méo nhẹ khi nhận.', 'NV0004', GETDATE()-2, GETDATE()-1.9, N'Đã tiếp nhận thông tin và xem xét bồi thường.', N'Đã xử lý');
GO

PRINT N'Đã chèn dữ liệu mẫu cho tất cả 43 bảng.';
GO

PRINT N'--- Chèn dữ liệu DANH_GIA_CUA_KHACH_HANG ---';
INSERT INTO DANH_GIA_CUA_KHACH_HANG VALUES
('1', 5.0, 'giao nhanh', '2025-10-26 11:00', 'KH1', 'DH001', 'DRV001'),
('2', 4.0, 'tai xe coc', '2025-10-27 12:15', 'KH2', 'DH002', 'DRV002'),
('3', 5.0, NULL, '2025-10-29 11:51', 'KH5', 'DH005', 'DRV006'),
('4', 4.0, 'hang cua toi bi vo', '2025-10-30 15:35', 'KH3', 'DH008', 'DRV008'),
('5', 5.0, 'dung gio', '2025-10-30 17:10', 'KH1', 'DH009', 'DRV008');

-- =====================================================================
-- 5. KIỂM TRA DỮ LIỆU ĐÃ INSERT
-- =====================================================================
PRINT N'';
PRINT N'=====================================================================';
PRINT N'5. KIỂM TRA DỮ LIỆU ĐÃ INSERT';
PRINT N'====================================================================='; 
GO

PRINT N'--- Dữ liệu bảng NHANVIEN ---'; SELECT * FROM NHANVIEN;
GO
PRINT N'--- Dữ liệu bảng CA_LAM_VIEC_CUA_NHAN_VIEN ---'; SELECT * FROM CA_LAM_VIEC_CUA_NHAN_VIEN;
GO
PRINT N'--- Dữ liệu bảng NHANVIEN_TAI_CHINH ---'; SELECT * FROM NHANVIEN_TAI_CHINH;
GO
PRINT N'--- Dữ liệu bảng CHUNG_CHI_BANG_CAP_CUA_NHANVIEN_TAI_CHINH ---'; SELECT * FROM CHUNG_CHI_BANG_CAP_CUA_NHANVIEN_TAI_CHINH;
GO
PRINT N'--- Dữ liệu bảng HANG_THANH_VIEN ---'; SELECT * FROM HANG_THANH_VIEN;
GO
PRINT N'--- Dữ liệu bảng KHACH_HANG ---'; SELECT * FROM KHACH_HANG;
GO
PRINT N'--- Dữ liệu bảng THANH_TOAN ---'; SELECT * FROM THANH_TOAN;
GO
PRINT N'--- Dữ liệu bảng GIAO_DICH_DUOC_KIEM_SOAT ---'; SELECT * FROM GIAO_DICH_DUOC_KIEM_SOAT;
GO
PRINT N'--- Dữ liệu bảng CHUONG_TRINH_KHUYEN_MAI ---'; SELECT * FROM CHUONG_TRINH_KHUYEN_MAI;
GO
PRINT N'--- Dữ liệu bảng MA_KHUYEN_MAI ---'; SELECT * FROM MA_KHUYEN_MAI;
GO
PRINT N'--- Dữ liệu bảng MA_GIAM_GIA ---'; SELECT * FROM MA_GIAM_GIA;
GO
PRINT N'--- Dữ liệu bảng MA_GIAM_GIA_THEO_HANG ---'; SELECT * FROM MA_GIAM_GIA_THEO_HANG;
GO
PRINT N'--- Dữ liệu bảng DON_HANG ---'; SELECT * FROM DON_HANG;
GO
-- Bảng HOA_DON đã bị xóa, bỏ qua
-- PRINT N'--- Dữ liệu bảng HOA_DON ---'; SELECT * FROM HOA_DON;
-- GO 
PRINT N'--- Dữ liệu bảng NHANVIEN_XU_LI_DON_HANG ---'; SELECT * FROM NHANVIEN_XU_LI_DON_HANG;
GO
PRINT N'--- Dữ liệu bảng DON_HANG_DUOC_TIEP_NHAN ---'; SELECT * FROM DON_HANG_DUOC_TIEP_NHAN;
GO
PRINT N'--- Dữ liệu bảng NHANVIEN_HO_TRO ---'; SELECT * FROM NHANVIEN_HO_TRO;
GO
PRINT N'--- Dữ liệu bảng LINH_VUC_CHUYEN_MON_CUA_NHANVIEN_HO_TRO ---'; SELECT * FROM LINH_VUC_CHUYEN_MON_CUA_NHANVIEN_HO_TRO;
GO
PRINT N'--- Dữ liệu bảng YEU_CAU_HO_TRO ---'; SELECT * FROM YEU_CAU_HO_TRO;
GO
PRINT N'--- Dữ liệu bảng QUAN_TRI_VIEN ---'; SELECT * FROM QUAN_TRI_VIEN;
GO
PRINT N'--- Dữ liệu bảng NHAN_VIEN_DUOC_GIAM_SAT ---'; SELECT * FROM NHAN_VIEN_DUOC_GIAM_SAT;
GO
PRINT N'--- Dữ liệu bảng NHAN_VIEN_QUAN_LY_TAI_XE ---'; SELECT * FROM NHAN_VIEN_QUAN_LY_TAI_XE;
GO
PRINT N'--- Dữ liệu bảng TAI_XE ---'; SELECT * FROM TAI_XE;
GO
PRINT N'--- Dữ liệu bảng GHI_CHU_QUAN_LY_TAI_XE ---'; SELECT * FROM GHI_CHU_QUAN_LY_TAI_XE;
GO
PRINT N'--- Dữ liệu bảng KHO ---'; SELECT * FROM KHO;
GO
PRINT N'--- Dữ liệu bảng DON_HANG_HOAN_VE_KHO ---'; SELECT * FROM DON_HANG_HOAN_VE_KHO;
GO
PRINT N'--- Dữ liệu bảng DON_HANG_HUY ---'; SELECT * FROM DON_HANG_HUY;
GO
PRINT N'--- Dữ liệu bảng XE ---'; SELECT * FROM XE;
GO
PRINT N'--- Dữ liệu bảng CHUYEN_GIAO_HANG ---'; SELECT * FROM CHUYEN_GIAO_HANG;
GO
PRINT N'--- Dữ liệu bảng THONG_TIN_XU_LI_DON_HANG ---'; SELECT * FROM THONG_TIN_XU_LI_DON_HANG;
GO
PRINT N'--- Dữ liệu bảng DON_HANG_DUOC_GIAO ---'; SELECT * FROM DON_HANG_DUOC_GIAO;
GO
PRINT N'--- Dữ liệu bảng KHOANG_CACH_VAN_CHUYEN ---'; SELECT * FROM KHOANG_CACH_VAN_CHUYEN;
GO
PRINT N'--- Dữ liệu bảng TAI_XE_SDT ---'; SELECT * FROM TAI_XE_SDT;
GO
PRINT N'--- Dữ liệu bảng TAI_XE_XE_MAY ---'; SELECT * FROM TAI_XE_XE_MAY;
GO
PRINT N'--- Dữ liệu bảng TAI_XE_XE_TAI ---'; SELECT * FROM TAI_XE_XE_TAI;
GO
PRINT N'--- Dữ liệu bảng MENTORSHIP ---'; SELECT * FROM MENTORSHIP;
GO
PRINT N'--- Dữ liệu bảng SU_DUNG_XE_MAY ---'; SELECT * FROM SU_DUNG_XE_MAY;
GO
PRINT N'--- Dữ liệu bảng SU_DUNG_XE_TAI ---'; SELECT * FROM SU_DUNG_XE_TAI;
GO
PRINT N'--- Dữ liệu bảng KHACH_HANG_CA_NHAN ---'; SELECT * FROM KHACH_HANG_CA_NHAN;
GO
PRINT N'--- Dữ liệu bảng KHACH_HANG_DOANH_NGHIEP ---'; SELECT * FROM KHACH_HANG_DOANH_NGHIEP;
GO
PRINT N'--- Dữ liệu bảng DANH_GIA_CUA_KHACH_HANG ---'; SELECT * FROM DANH_GIA_CUA_KHACH_HANG;
GO
PRINT N'--- Dữ liệu bảng SO_DIEN_THOAI_CUA_KHACH_HANG ---'; SELECT * FROM SO_DIEN_THOAI_CUA_KHACH_HANG;
GO
PRINT N'--- Dữ liệu bảng DIA_CHI_CUA_KHACH_HANG ---'; SELECT * FROM DIA_CHI_CUA_KHACH_HANG;
GO


PRINT N'=====================================================================';
PRINT N'HOÀN TẤT KIỂM TRA DỮ LIỆU';
PRINT N'=====================================================================';
GO

-- =====================================================================
-- 6. FUNCTIONS VÀ STORED PROCEDURES (ĐÃ FIX LỖI MSG 208)
-- =====================================================================
PRINT N'';
PRINT N'=====================================================================';
PRINT N'6. FUNCTIONS VÀ STORED PROCEDURES';
PRINT N'=====================================================================';
GO

-- ---------------------------------------------------------------------
-- Function 1: Top Khách Hàng Theo Doanh Thu
-- ---------------------------------------------------------------------
PRINT N'--- Tạo function fn_TopKhachHangTheoDoanhThu ---';
GO
-- Xóa function nếu đã tồn tại
IF OBJECT_ID('fn_TopKhachHangTheoDoanhThu', 'TF') IS NOT NULL 
    DROP FUNCTION fn_TopKhachHangTheoDoanhThu;
GO

CREATE FUNCTION fn_TopKhachHangTheoDoanhThu
(
    @TopN INT,
    @TuNgay DATE,
    @DenNgay DATE
)
RETURNS @Result TABLE (
    Ma_khach_hang VARCHAR(10),
    TongDoanhThu MONEY
)
AS
BEGIN
    IF @TopN IS NULL OR @TopN <= 0
        RETURN;

    IF @TuNgay IS NULL OR @DenNgay IS NULL OR @TuNgay > @DenNgay
        RETURN;

    INSERT INTO @Result
    SELECT TOP (@TopN)
           KH.Ma_khach_hang,
           -- FIX: Tính doanh thu từ DON_HANG
           SUM(ISNULL(DH.phi_van_chuyen_sau_giam, 0) + ISNULL(DH.gia_tri_hang_hoa_phi_van_chuyen, 0)) AS TongDoanhThu
    FROM KHACH_HANG KH
    JOIN DON_HANG DH ON KH.Ma_khach_hang = DH.Ma_khach_hang
    WHERE DH.Trang_thai_don IN (N'Giao hàng thành công', N'Đã hoàn thành')
      AND CAST(DH.thoi_gian_dat_don AS DATE) BETWEEN @TuNgay AND @DenNgay  
    GROUP BY KH.Ma_khach_hang
    HAVING SUM(ISNULL(DH.phi_van_chuyen_sau_giam, 0) + ISNULL(DH.gia_tri_hang_hoa_phi_van_chuyen, 0)) > 0  
    ORDER BY SUM(ISNULL(DH.phi_van_chuyen_sau_giam, 0) + ISNULL(DH.gia_tri_hang_hoa_phi_van_chuyen, 0)) DESC; 

    RETURN;
END;
GO

-- ---------------------------------------------------------------------
-- Function 2: Top Tài Xế Đơn Giản
-- ---------------------------------------------------------------------
PRINT N'--- Tạo function fn_TopTaiXeDonGian ---';
GO
-- Xóa function nếu đã tồn tại
IF OBJECT_ID('fn_TopTaiXeDonGian', 'TF') IS NOT NULL 
    DROP FUNCTION fn_TopTaiXeDonGian;
GO

CREATE FUNCTION fn_TopTaiXeDonGian
(
    @TopN INT,
    @MinStar DECIMAL(2,1)
)
RETURNS @Result TABLE
(
    DriverID VARCHAR(10),
    Ho_ten NVARCHAR(100),
    SoChuyenGiao INT,
    Rating DECIMAL(2,1)
)
AS
BEGIN
    INSERT INTO @Result
    SELECT TOP (@TopN)
        TX.DriverID,
        TX.Ho_ten,
        COUNT(CGH.DeliveryID) AS SoChuyenGiao,
        TX.Rating
    FROM TAI_XE TX
    LEFT JOIN CHUYEN_GIAO_HANG CGH 
           ON TX.DriverID = CGH.DriverID 
          AND CGH.TrangThaiChuyen = N'Hoàn thành'  
    WHERE TX.Rating >= @MinStar
    GROUP BY TX.DriverID, TX.Ho_ten, TX.Rating
    ORDER BY SoChuyenGiao DESC, TX.Rating DESC;
    RETURN;
END;
GO

-- Test Functions
PRINT N'--- Test functions ---';
PRINT N'Test fn_TopKhachHangTheoDoanhThu:';
SELECT * FROM dbo.fn_TopKhachHangTheoDoanhThu(3,'2023-01-01','2025-12-31');

PRINT N'Test fn_TopTaiXeDonGian:';
SELECT * FROM fn_TopTaiXeDonGian(5, 4.0);
GO

-- ---------------------------------------------------------------------
-- Stored Procedure 1: Tạo Đơn Hàng
-- ---------------------------------------------------------------------
PRINT N'--- Tạo stored procedure sp_TaoDonHang ---';
GO
-- Xóa procedure nếu đã tồn tại (FIX LỖI MSG 208 Ở ĐÂY)
IF OBJECT_ID('sp_TaoDonHang', 'P') IS NOT NULL 
    DROP PROCEDURE sp_TaoDonHang;
GO

CREATE PROCEDURE sp_TaoDonHang
(
    @MaKH VARCHAR(10),
    @SDTNhan VARCHAR(15),
    @TenNguoiNhan NVARCHAR(100),
    @DiaChiLay NVARCHAR(255),
    @DiaChiGiao NVARCHAR(255),
    @CanNang DECIMAL(5,2),
    @GiaTri MONEY,
    @PhiVanChuyen MONEY,
    @PhuongThucGiao NVARCHAR(50),
    @ThoiGianGiaoDuKien DATETIME
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        -- Kiểm tra input cơ bản
        IF @MaKH IS NULL 
            OR @SDTNhan IS NULL 
            OR @TenNguoiNhan IS NULL 
            OR @DiaChiLay IS NULL 
            OR @DiaChiGiao IS NULL
            OR @CanNang <= 0
            OR @PhiVanChuyen <= 0
        BEGIN
            RAISERROR(N'Dữ liệu đầu vào không hợp lệ.', 16, 1);
            ROLLBACK;
            RETURN;
        END;

        -- Kiểm tra khách hàng tồn tại
        IF NOT EXISTS (SELECT 1 FROM KHACH_HANG WHERE Ma_khach_hang = @MaKH)
        BEGIN
            RAISERROR(N'Khách hàng không tồn tại.', 16, 1);
            ROLLBACK;
            RETURN;
        END;

        -- Sinh mã đơn
        DECLARE @MaDon VARCHAR(10);
        SELECT @MaDon = 'DH' + 
            RIGHT('000' + CAST(ISNULL(MAX(CAST(SUBSTRING(Ma_don_hang, 3, 10) AS INT)), 0) + 1 AS VARCHAR), 3)
        FROM DON_HANG;

        -- Tạo đơn hàng
        INSERT INTO DON_HANG
        (
            Ma_don_hang,
            Thoi_gian_giao_hang_du_kien,
            gia_tri_hang_hoa_phi_van_chuyen,
            SDT_nguoi_nhan,
            ten_nguoi_nhan,
            can_nang,
            dia_chi_lay_hang,
            dia_chi_giao_hang,
            phuong_thuc_giao_hang,
            Ma_khach_hang,
            -- Các trường NOT NULL mới thêm vào cần giá trị mặc định hoặc tính toán
            phi_van_chuyen_goc,
            phi_van_chuyen_sau_giam,
            quang_duong
        )
        VALUES
        (
            @MaDon,
            @ThoiGianGiaoDuKien,
            @GiaTri,
            @SDTNhan,
            @TenNguoiNhan,
            @CanNang,
            @DiaChiLay,
            @DiaChiGiao,
            @PhuongThucGiao,
            @MaKH,
            -- Giả định giá trị cho các trường mới để tránh lỗi INSERT
            @PhiVanChuyen, -- phi_van_chuyen_goc
            @PhiVanChuyen, -- phi_van_chuyen_sau_giam (tạm thời chưa giảm)
            5.0            -- quang_duong (giả định 5km)
        );

        COMMIT;
        SELECT @MaDon AS MaDonHangMoi;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END;
GO

-- ---------------------------------------------------------------------
-- Stored Procedure 2: Hủy Đơn Hàng
-- ---------------------------------------------------------------------
PRINT N'--- Tạo stored procedure sp_HuyDonHang ---';
GO
-- Xóa procedure nếu đã tồn tại (FIX LỖI MSG 208 Ở ĐÂY)
IF OBJECT_ID('sp_HuyDonHang', 'P') IS NOT NULL 
    DROP PROCEDURE sp_HuyDonHang;
GO

CREATE PROCEDURE sp_HuyDonHang
(
    @MaDon VARCHAR(10),
    @LyDo NVARCHAR(255) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        -- Kiểm tra đơn hàng tồn tại
        IF NOT EXISTS (SELECT 1 FROM DON_HANG WHERE Ma_don_hang = @MaDon)
        BEGIN
            RAISERROR(N'Đơn hàng không tồn tại.', 16, 1);
            ROLLBACK;
            RETURN;
        END;

        -- Lấy trạng thái và mã khách hàng
        DECLARE @TrangThai NVARCHAR(50), @MaKH VARCHAR(10);

        SELECT 
            @TrangThai = Trang_thai_don,
            @MaKH = Ma_khach_hang
        FROM DON_HANG
        WHERE Ma_don_hang = @MaDon;

        -- Chỉ cho phép hủy khi đang xử lý
        IF @TrangThai <> N'Đang xử lý'
        BEGIN
            RAISERROR(N'Chỉ có thể hủy đơn hàng đang xử lý.', 16, 1);
            ROLLBACK;
            RETURN;
        END;

        -- Cập nhật trạng thái đơn hàng
        UPDATE DON_HANG
        SET Trang_thai_don = N'Đã hủy'
        WHERE Ma_don_hang = @MaDon;

        -- Thêm vào bảng DON_HANG_HUY
        INSERT INTO DON_HANG_HUY (Ma_khach_hang, Thoi_gian_huy, Ly_do_huy, Ma_don_hang)
        VALUES (@MaKH, GETDATE(), @LyDo, @MaDon);

        COMMIT;

        PRINT N'Đã hủy đơn hàng thành công.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        THROW;
    END CATCH
END;
GO

PRINT N'=====================================================================';
PRINT N'HOÀN TẤT TẠO FUNCTIONS VÀ STORED PROCEDURES';
PRINT N'=====================================================================';
GO

-- =====================================================================
-- 7. CÁC TRIGGER (Tối ưu hóa sau khi xóa HOA_DON)
-- =====================================================================
PRINT N'';
PRINT N'=====================================================================';
PRINT N'7. ĐỊNH NGHĨA TRIGGERS (Tối ưu SET-based)';
PRINT N'=====================================================================';
GO

-- 1. Trigger Cập nhật Trạng thái Đơn hàng
-- Nhiệm vụ: Đảm bảo cột Trang_thai_don trong DON_HANG luôn đồng bộ với bản ghi mới nhất trong lịch sử xử lý.
-- Chạy trước Trigger 2 để đảm bảo Trạng thái đơn được cập nhật trước khi tính điểm.
CREATE OR ALTER TRIGGER trg_capNhatTrangThaiDonHang
ON THONG_TIN_XU_LI_DON_HANG AFTER INSERT AS
BEGIN
	-- Cập nhật trạng thái đơn hàng (SET based operation)
	UPDATE DH
	SET Trang_thai_don = I.Tinh_trang
	FROM DON_HANG DH
	JOIN inserted I ON DH.Ma_don_hang = I.Ma_don_hang;
END
GO

-- 2. Trigger Cập nhật Điểm Thành viên
-- Nhiệm vụ: Cập nhật Diem_thanh_vien và Ten_hang trong KHACH_HANG khi đơn hàng đạt trạng thái thành công.
CREATE OR ALTER TRIGGER trg_capNhatDiemThanhVienKhiDonHangThanhCong
ON THONG_TIN_XU_LI_DON_HANG AFTER INSERT AS
BEGIN
    -- Chỉ xử lý khi trạng thái mới được chèn là 'Giao hàng thành công' hoặc tương đương
	IF NOT EXISTS (SELECT 1 FROM inserted WHERE Tinh_trang IN ( N'Đã hoàn thành')) RETURN;

	-- Cập nhật điểm và hạng thành viên cho tất cả khách hàng liên quan (Sử dụng SET-based)
	UPDATE KH
	SET 
		-- Cộng điểm tích lũy của đơn hàng vào tổng điểm hiện tại
		Diem_thanh_vien = T.Diem_hien_tai + T.Diem_tich_luy_moi,
		
		-- Tìm hạng thành viên mới dựa trên tổng điểm mới
		Ten_hang = H.New_Ten_hang,
		
		-- Cập nhật ngày lên hạng nếu hạng thay đổi
		Ngay_len_hang = CASE 
			WHEN KH.Ten_hang <> H.New_Ten_hang THEN GETDATE() 
			ELSE KH.Ngay_len_hang 
		END
	
	FROM KHACH_HANG KH
	JOIN (
        -- Bảng tạm T tính tổng điểm mới (cho phép xử lý nhiều đơn hàng/khách hàng được chèn cùng lúc)
		SELECT 
            DH.Ma_khach_hang,
            SUM(DH.diem_tich_luy) AS Diem_tich_luy_moi,
            MAX(KH_Old.Diem_thanh_vien) AS Diem_hien_tai
        FROM inserted I
		JOIN DON_HANG DH ON DH.Ma_don_hang = I.Ma_don_hang
        JOIN KHACH_HANG KH_Old ON KH_Old.Ma_khach_hang = DH.Ma_khach_hang
        -- Chỉ tính điểm cho các đơn hàng vừa chuyển sang trạng thái thành công
		WHERE I.Tinh_trang IN ( N'Đã hoàn thành')
        GROUP BY DH.Ma_khach_hang
	) AS T ON KH.Ma_khach_hang = T.Ma_khach_hang
    
    -- CROSS APPLY để tìm hạng mới dựa trên tổng điểm tính toán
    CROSS APPLY (
        SELECT TOP(1) HTV.Ten_hang AS New_Ten_hang
        FROM HANG_THANH_VIEN HTV
        WHERE T.Diem_hien_tai + T.Diem_tich_luy_moi >= HTV.Diem_thanh_vien_toi_thieu
        ORDER BY HTV.Diem_thanh_vien_toi_thieu DESC
    ) AS H;
END
GO



-- =====================================================================
-- 8. TEST CASES CHO TRIGGERS
-- =====================================================================
PRINT N'';
PRINT N'=====================================================================';
PRINT N'8. TEST CASES CHO TRIGGERS (Cập nhật Trạng thái & Điểm thành viên)';
PRINT N'=====================================================================';
GO

-------------------------------------------------------------------------
-- KHỞI TẠO TEST DỮ LIỆU BAN ĐẦU
-------------------------------------------------------------------------
PRINT N'--- Dữ liệu KHÁCH HÀNG (KH1) và ĐƠN HÀNG (DH007) trước khi test ---';
-- KH1: 150 điểm, Hạng Đồng. DH007: 10 điểm, Trang_thai_don = Đã tạo
SELECT Ma_khach_hang, Diem_thanh_vien, Ten_hang, Ngay_len_hang FROM KHACH_HANG WHERE Ma_khach_hang = 'KH1';
SELECT Ma_don_hang, Trang_thai_don, diem_tich_luy FROM DON_HANG WHERE Ma_don_hang = 'DH007';

-------------------------------------------------------------------------
-- TEST 1: CHÈN TRẠNG THÁI 'ĐANG XỬ LÝ' (Kiểm tra Trigger Trạng thái)
-------------------------------------------------------------------------
PRINT N'--- TEST 1: Cập nhật trạng thái cho DH007 (Đang xử lý) ---';
INSERT INTO THONG_TIN_XU_LI_DON_HANG (Ma_don_hang, Thoi_gian, Tinh_trang, MaNVXuLy)
VALUES ('DH007', GETDATE() + 1, N'Đang xử lý', 'NV0003');
GO

PRINT N'Kết quả sau TEST 1: (Trạng thái DH007 phải là "Đang xử lý")';
SELECT Ma_don_hang, Trang_thai_don FROM DON_HANG WHERE Ma_don_hang = 'DH007';

-------------------------------------------------------------------------
-- TEST 2: CHÈN TRẠNG THÁI 'GIAO HÀNG THÀNH CÔNG' (Kiểm tra cả 2 Triggers)
-------------------------------------------------------------------------
PRINT N'--- TEST 2: Cập nhật trạng thái cho DH007 (Đã hoàn thành) ---';
INSERT INTO THONG_TIN_XU_LI_DON_HANG (Ma_don_hang, Thoi_gian, Tinh_trang, MaNVXuLy)
VALUES ('DH007', GETDATE() + 2, N'Đã hoàn thành', 'NV0003');
GO

PRINT N'Kết quả sau TEST 2:';
PRINT N'1. Trạng thái DH007: (Phải là "Đã hoàn thành")';
SELECT Ma_don_hang, Trang_thai_don FROM DON_HANG WHERE Ma_don_hang = 'DH007';

PRINT N'2. Điểm và Hạng KH1: (150 điểm + 10 điểm = 160 điểm. Hạng vẫn là Đồng)';
SELECT Ma_khach_hang, Diem_thanh_vien, Ten_hang, Ngay_len_hang FROM KHACH_HANG WHERE Ma_khach_hang = 'KH1';

-------------------------------------------------------------------------
-- TEST 3: ĐƠN HÀNG KHÁC VÀ KHÁCH HÀNG LÊN HẠNG (KH2)
-------------------------------------------------------------------------
PRINT N'--- Dữ liệu KHÁCH HÀNG (KH2) và ĐƠN HÀNG (DH002) trước khi test ---';
-- KH2: 499 điểm, Hạng Đồng. DH002: 15 điểm.
SELECT Ma_khach_hang, Diem_thanh_vien, Ten_hang, Ngay_len_hang FROM KHACH_HANG WHERE Ma_khach_hang = 'KH2';

PRINT N'--- TEST 3: Đơn DH002 thành công (499 + 15 = 514 điểm -> Lên Hạng Bạc) ---';
INSERT INTO THONG_TIN_XU_LI_DON_HANG (Ma_don_hang, Thoi_gian, Tinh_trang, MaNVXuLy)
VALUES ('DH002', GETDATE() + 3, N'Đã hoàn thành', 'NV0003');
GO

PRINT N'Kết quả sau TEST 3: (KH2 phải có 514 điểm, Hạng Bạc)';
SELECT Ma_khach_hang, Diem_thanh_vien, Ten_hang, Ngay_len_hang FROM KHACH_HANG WHERE Ma_khach_hang = 'KH2';
GO

------------------------------------------------------------------------

