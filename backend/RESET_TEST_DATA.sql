/**
 * =============================================
 * RESET TEST DATA SCRIPT - SIMPLE VERSION
 * =============================================
 * Mục đích: Reset về trạng thái ban đầu để test lại từ đầu
 * 
 * Script này sẽ:
 * 1. XÓA dữ liệu test mới được tạo qua API
 * 2. GIỮ LẠI dữ liệu mẫu từ file SQL gốc
 * 
 * Cách sử dụng:
 * Option 1: sqlcmd -S localhost -U sManager -P Nhom6251 -d QuanLyGiaoHang_Nhom06 -i RESET_TEST_DATA.sql
 * Option 2: Mở SSMS → Connect → Execute
 * 
 * ⚠️ AN TOÀN: Script CHỈ xóa records có ID/Ma KHÔNG nằm trong danh sách gốc
 */

USE QuanLyGiaoHang_Nhom06;
GO

PRINT N'========================================';
PRINT N'RESET TEST DATA - BAT DAU';
PRINT N'========================================';
PRINT N'';

-- =============================================
-- BUOC 1: XOA CAC BANG PHU THUOC (FOREIGN KEY CONSTRAINTS)
-- =============================================
PRINT N'Buoc 1: Xoa cac bang phu thuoc...';

-- 1.1: Xóa KHOANG_CACH_VAN_CHUYEN của chuyến giao hàng mới
DELETE FROM KHOANG_CACH_VAN_CHUYEN
WHERE DeliveryID NOT IN ('CGH001', 'CGH002', 'CGH003', 'CGH004', 'CGH005');
DECLARE @deletedKCVC INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedKCVC AS NVARCHAR) + N' records tu KHOANG_CACH_VAN_CHUYEN';

-- 1.2: Xóa DON_HANG_DUOC_GIAO của các chuyến giao hàng mới
DELETE FROM DON_HANG_DUOC_GIAO
WHERE DeliveryID NOT IN ('CGH001', 'CGH002', 'CGH003', 'CGH004', 'CGH005');
DECLARE @deletedDHDG INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedDHDG AS NVARCHAR) + N' records tu DON_HANG_DUOC_GIAO';

-- 1.3: Xóa THONG_TIN_XU_LI_DON_HANG của đơn hàng mới
DELETE FROM THONG_TIN_XU_LI_DON_HANG
WHERE Ma_don_hang NOT IN (
    'DH001', 'DH002', 'DH003', 'DH004', 'DH005', 'DH006',
    'DH007', 'DH008', 'DH009', 'DH010'
);
DECLARE @deletedTTXL INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedTTXL AS NVARCHAR) + N' records tu THONG_TIN_XU_LI_DON_HANG';

-- 1.4: Xóa DON_HANG_DUOC_TIEP_NHAN của đơn hàng mới
DELETE FROM DON_HANG_DUOC_TIEP_NHAN
WHERE Ma_don_hang NOT IN (
    'DH001', 'DH002', 'DH003', 'DH004', 'DH005', 'DH006',
    'DH007', 'DH008', 'DH009', 'DH010'
);
DECLARE @deletedDHTN INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedDHTN AS NVARCHAR) + N' records tu DON_HANG_DUOC_TIEP_NHAN';

-- 1.5: Xóa DANH_GIA_CUA_KHACH_HANG của đơn hàng mới
DELETE FROM DANH_GIA_CUA_KHACH_HANG
WHERE Ma_don_hang NOT IN (
    'DH001', 'DH002', 'DH003', 'DH004', 'DH005', 'DH006',
    'DH007', 'DH008', 'DH009', 'DH010'
);
DECLARE @deletedDGCKH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedDGCKH AS NVARCHAR) + N' records tu DANH_GIA_CUA_KHACH_HANG';

-- 1.5a: Xóa DON_HANG_HOAN_VE_KHO của đơn hàng mới
DELETE FROM DON_HANG_HOAN_VE_KHO
WHERE Ma_don_hang NOT IN (
    'DH001', 'DH002', 'DH003', 'DH004', 'DH005', 'DH006',
    'DH007', 'DH008', 'DH009', 'DH010'
);
DECLARE @deletedDHHVK INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedDHHVK AS NVARCHAR) + N' records tu DON_HANG_HOAN_VE_KHO';

-- 1.5b: Xóa DON_HANG_HUY của đơn hàng mới
DELETE FROM DON_HANG_HUY
WHERE Ma_don_hang NOT IN (
    'DH001', 'DH002', 'DH003', 'DH004', 'DH005', 'DH006',
    'DH007', 'DH008', 'DH009', 'DH010'
);
DECLARE @deletedDHH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedDHH AS NVARCHAR) + N' records tu DON_HANG_HUY';

-- 1.6: Xóa YEU_CAU_HO_TRO của khách hàng mới
DELETE FROM YEU_CAU_HO_TRO
WHERE Ma_khach_hang NOT IN (
    'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
    'KH6', 'KH7', 'KH8', 'KH9'
);
DECLARE @deletedYCHT INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedYCHT AS NVARCHAR) + N' records tu YEU_CAU_HO_TRO';

-- 1.7: Xóa THANH_TOAN của khách hàng mới
DELETE FROM GIAO_DICH_DUOC_KIEM_SOAT
WHERE Ma_thanh_toan IN (
    SELECT Ma_thanh_toan FROM THANH_TOAN
    WHERE Ma_khach_hang NOT IN (
        'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
        'KH6', 'KH7', 'KH8', 'KH9'
    )
);
DECLARE @deletedGDKS INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedGDKS AS NVARCHAR) + N' records tu GIAO_DICH_DUOC_KIEM_SOAT';

DELETE FROM THANH_TOAN
WHERE Ma_khach_hang NOT IN (
    'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
    'KH6', 'KH7', 'KH8', 'KH9'
);
DECLARE @deletedTT INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedTT AS NVARCHAR) + N' records tu THANH_TOAN';

PRINT N'';

-- =============================================
-- BUOC 2: XOA CHUYEN GIAO HANG MOI (DeliveryID > 'CGH005')
-- =============================================
PRINT N'Buoc 2: Xoa chuyen giao hang moi...';

DELETE FROM CHUYEN_GIAO_HANG
WHERE DeliveryID NOT IN ('CGH001', 'CGH002', 'CGH003', 'CGH004', 'CGH005');

DECLARE @deletedCGH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedCGH AS NVARCHAR) + N' records tu CHUYEN_GIAO_HANG';

PRINT N'';

-- =============================================
-- BUOC 3: XOA DON HANG MOI
-- =============================================
PRINT N'Buoc 3: Xoa don hang moi...';

-- 3.1a: Xóa DANH_GIA_CUA_KHACH_HANG của đơn hàng từ khách hàng mới
DELETE FROM DANH_GIA_CUA_KHACH_HANG
WHERE Ma_don_hang IN (
    SELECT Ma_don_hang FROM DON_HANG
    WHERE Ma_khach_hang NOT IN (
        'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
        'KH6', 'KH7', 'KH8', 'KH9'
    )
);
DECLARE @deletedDGCKHByKH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedDGCKHByKH AS NVARCHAR) + N' records tu DANH_GIA_CUA_KHACH_HANG (don hang cua KH moi)';

-- 3.1b: Xóa DON_HANG_DUOC_GIAO của đơn hàng từ khách hàng mới
DELETE FROM DON_HANG_DUOC_GIAO
WHERE Ma_don_hang IN (
    SELECT Ma_don_hang FROM DON_HANG
    WHERE Ma_khach_hang NOT IN (
        'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
        'KH6', 'KH7', 'KH8', 'KH9'
    )
);
DECLARE @deletedDHDGByKH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedDHDGByKH AS NVARCHAR) + N' records tu DON_HANG_DUOC_GIAO (don hang cua KH moi)';

-- 3.1c: Xóa THONG_TIN_XU_LI_DON_HANG của đơn hàng từ khách hàng mới
DELETE FROM THONG_TIN_XU_LI_DON_HANG
WHERE Ma_don_hang IN (
    SELECT Ma_don_hang FROM DON_HANG
    WHERE Ma_khach_hang NOT IN (
        'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
        'KH6', 'KH7', 'KH8', 'KH9'
    )
);
DECLARE @deletedTTXLByKH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedTTXLByKH AS NVARCHAR) + N' records tu THONG_TIN_XU_LI_DON_HANG (don hang cua KH moi)';

-- 3.1c: Xóa DON_HANG_DUOC_TIEP_NHAN của đơn hàng từ khách hàng mới
DELETE FROM DON_HANG_DUOC_TIEP_NHAN
WHERE Ma_don_hang IN (
    SELECT Ma_don_hang FROM DON_HANG
    WHERE Ma_khach_hang NOT IN (
        'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
        'KH6', 'KH7', 'KH8', 'KH9'
    )
);
DECLARE @deletedDHTNByKH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedDHTNByKH AS NVARCHAR) + N' records tu DON_HANG_DUOC_TIEP_NHAN (don hang cua KH moi)';

-- 3.2: Xóa đơn hàng của khách hàng mới (Ma_khach_hang không nằm trong danh sách gốc)
DELETE FROM DON_HANG
WHERE Ma_khach_hang NOT IN (
    'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
    'KH6', 'KH7', 'KH8', 'KH9'
);
DECLARE @deletedDHByKH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedDHByKH AS NVARCHAR) + N' don hang cua khach hang moi';

-- Xóa các đơn hàng mới
DELETE FROM DON_HANG
WHERE Ma_don_hang NOT IN (
    'DH001', 'DH002', 'DH003', 'DH004', 'DH005', 'DH006',
    'DH007', 'DH008', 'DH009', 'DH010'
);
DECLARE @deletedDH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedDH AS NVARCHAR) + N' don hang moi (Ma_don_hang > DH0012)';

PRINT N'';

-- =============================================
-- BUOC 4: XOA TAI XE MOI
-- =============================================
PRINT N'Buoc 4: Xoa tai xe moi...';

-- Xóa Mentorship của tài xế mới (mentor hoặc mentee không nằm trong danh sách gốc)
DELETE FROM Mentorship
WHERE MentorID NOT IN (
    'DRV001', 'DRV002', 'DRV003', 'DRV004', 'DRV005', 'DRV006',
    'DRV007', 'DRV008', 'DRV009', 'DRV010'
)
OR MenteeID NOT IN (
    'DRV001', 'DRV002', 'DRV003', 'DRV004', 'DRV005', 'DRV006',
    'DRV007', 'DRV008', 'DRV009', 'DRV010'
);
DECLARE @deletedMentorship INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedMentorship AS NVARCHAR) + N' records tu Mentorship';

-- Xóa ghi chú của tài xế mới
DELETE FROM GHI_CHU_QUAN_LY_TAI_XE
WHERE Ma_tai_xe NOT IN (
    'DRV001', 'DRV002', 'DRV003', 'DRV004', 'DRV005', 'DRV006',
    'DRV007', 'DRV008', 'DRV009', 'DRV010'
);
DECLARE @deletedGhiChu INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedGhiChu AS NVARCHAR) + N' records tu GHI_CHU_QUAN_LY_TAI_XE';

-- Xóa số điện thoại tài xế mới
DELETE FROM TAI_XE_SDT
WHERE DriverID NOT IN (
    'DRV001', 'DRV002', 'DRV003', 'DRV004', 'DRV005', 'DRV006',
    'DRV007', 'DRV008', 'DRV009', 'DRV010'
);
DECLARE @deletedSDT INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedSDT AS NVARCHAR) + N' records tu TAI_XE_SDT';

-- Xóa thông tin xe máy
DELETE FROM TAI_XE_XE_MAY
WHERE DriverID NOT IN (
    'DRV001', 'DRV002', 'DRV003', 'DRV004', 'DRV005', 'DRV006',
    'DRV007', 'DRV008', 'DRV009', 'DRV010'
);
DECLARE @deletedXeMay INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedXeMay AS NVARCHAR) + N' records tu TAI_XE_XE_MAY';

-- Xóa thông tin xe tải
DELETE FROM TAI_XE_XE_TAI
WHERE DriverID NOT IN (
    'DRV001', 'DRV002', 'DRV003', 'DRV004', 'DRV005', 'DRV006',
    'DRV007', 'DRV008', 'DRV009', 'DRV010'
);
DECLARE @deletedXeTai INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedXeTai AS NVARCHAR) + N' records tu TAI_XE_XE_TAI';

-- Xóa tài xế mới
DELETE FROM TAI_XE
WHERE DriverID NOT IN (
    'DRV001', 'DRV002', 'DRV003', 'DRV004', 'DRV005', 'DRV006',
    'DRV007', 'DRV008', 'DRV009', 'DRV010'
);
DECLARE @deletedTaiXe INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedTaiXe AS NVARCHAR) + N' records tu TAI_XE';

PRINT N'';

-- =============================================
-- BUOC 5: XOA KHACH HANG MOI
-- =============================================
PRINT N'Buoc 5: Xoa khach hang moi...';

-- Xóa số điện thoại khách hàng mới
DELETE FROM SO_DIEN_THOAI_CUA_KHACH_HANG
WHERE Ma_khach_hang NOT IN (
    'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
    'KH6', 'KH7', 'KH8', 'KH9'
);
DECLARE @deletedSDTKH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedSDTKH AS NVARCHAR) + N' records tu SO_DIEN_THOAI_CUA_KHACH_HANG';

-- Xóa địa chỉ khách hàng mới
DELETE FROM DIA_CHI_CUA_KHACH_HANG
WHERE Ma_khach_hang NOT IN (
    'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
    'KH6', 'KH7', 'KH8', 'KH9'
);
DECLARE @deletedDiaChiKH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedDiaChiKH AS NVARCHAR) + N' records tu DIA_CHI_CUA_KHACH_HANG';

-- Xóa khách hàng cá nhân mới
DELETE FROM KHACH_HANG_CA_NHAN
WHERE Ma_khach_hang NOT IN (
    'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
    'KH6', 'KH7', 'KH8', 'KH9'
);
DECLARE @deletedKHCN INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedKHCN AS NVARCHAR) + N' records tu KHACH_HANG_CA_NHAN';

-- Xóa khách hàng doanh nghiệp mới
DELETE FROM KHACH_HANG_DOANH_NGHIEP
WHERE Ma_khach_hang NOT IN (
    'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
    'KH6', 'KH7', 'KH8', 'KH9'
);
DECLARE @deletedKHDN INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedKHDN AS NVARCHAR) + N' records tu KHACH_HANG_DOANH_NGHIEP';

-- Xóa khách hàng mới
DELETE FROM KHACH_HANG
WHERE Ma_khach_hang NOT IN (
    'KH1', 'KH2', 'KH3', 'KH4', 'KH5',
    'KH6', 'KH7', 'KH8', 'KH9'
);
DECLARE @deletedKH INT = @@ROWCOUNT;
PRINT N'   Da xoa ' + CAST(@deletedKH AS NVARCHAR) + N' records tu KHACH_HANG';

PRINT N'';

-- =============================================
-- BUOC 6: KIEM TRA KET QUA
-- =============================================
PRINT N'Buoc 6: Kiem tra so luong records con lai...';
PRINT N'';

DECLARE @countTable TABLE (
    TableName NVARCHAR(100), 
    RecordCount INT, 
    ExpectedCount INT
);

INSERT INTO @countTable (TableName, RecordCount, ExpectedCount)
VALUES 
    ('TAI_XE', (SELECT COUNT(*) FROM TAI_XE), 10),
    ('TAI_XE_SDT', (SELECT COUNT(*) FROM TAI_XE_SDT), 11),
    ('TAI_XE_XE_MAY', (SELECT COUNT(*) FROM TAI_XE_XE_MAY), 6),
    ('TAI_XE_XE_TAI', (SELECT COUNT(*) FROM TAI_XE_XE_TAI), 3),
    ('KHACH_HANG', (SELECT COUNT(*) FROM KHACH_HANG), 9),
    ('SO_DIEN_THOAI_CUA_KHACH_HANG', (SELECT COUNT(*) FROM SO_DIEN_THOAI_CUA_KHACH_HANG), 11),
    ('DIA_CHI_CUA_KHACH_HANG', (SELECT COUNT(*) FROM DIA_CHI_CUA_KHACH_HANG), 10),
    ('DON_HANG', (SELECT COUNT(*) FROM DON_HANG), 10),
    ('CHUYEN_GIAO_HANG', (SELECT COUNT(*) FROM CHUYEN_GIAO_HANG), 5),
    ('DON_HANG_DUOC_GIAO', (SELECT COUNT(*) FROM DON_HANG_DUOC_GIAO), 8),
    ('GHI_CHU_QUAN_LY_TAI_XE', (SELECT COUNT(*) FROM GHI_CHU_QUAN_LY_TAI_XE), 7),
    ('Mentorship', (SELECT COUNT(*) FROM Mentorship), 5);

-- Hiển thị kết quả
SELECT 
    TableName AS [Ten bang],
    RecordCount AS [So records hien tai],
    ExpectedCount AS [So records ban dau],
    CASE 
        WHEN RecordCount = ExpectedCount THEN N'OK - Da ve trang thai ban dau'
        WHEN RecordCount > ExpectedCount THEN N'WARNING - Con du lieu test'
        ELSE N'ERROR - Mat du lieu ban dau'
    END AS [Trang thai]
FROM @countTable
ORDER BY TableName;

PRINT N'';
PRINT N'========================================';
PRINT N'HOAN TAT RESET TEST DATA';
PRINT N'========================================';
PRINT N'';
PRINT N'Du lieu da duoc reset ve trang thai ban dau';
PRINT N'Ban co the bat dau test API tu dau';
GO
