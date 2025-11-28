/**
 * STORED PROCEDURE CONTROLLER
 * Controller tổng hợp các endpoints gọi stored procedures
 * 
 * Các SP được triển khai:
 * 1. sp_ThemNhanVien - Tạo nhân viên mới (mã NVxxx)
 * 2. sp_DangKyKhachHang - Đăng ký khách hàng (mã KHxxx)
 * 3. sp_ThemTaiXe - Thêm tài xế (mã DRVxxx) - ĐÃ CÓ TRONG driver.controller.js
 * 4. sp_TaoDonHang - Tạo đơn hàng (mã DHxxx) - ĐÃ CÓ TRONG donHangController.js
 * 5. sp_TaoChuyenGiaoHang - Tạo chuyến giao hàng (mã CGHxxx) - ĐÃ CÓ TRONG chuyenGiaoHangController.js
 * 6. sp_TaoDanhGia - Tạo đánh giá (mã DGxxx)
 * 7. sp_TaoYeuCauHoTro - Tạo yêu cầu hỗ trợ (mã YCxxx)
 * 8. sp_TaoThanhToan - Tạo thanh toán (mã TTxxx)
 * 9. sp_ThemXe - Thêm xe (mã VHCxxx)
 */

const db = require('../models');
const { QueryTypes } = require('sequelize');

/**
 * ============================================
 * 1. SP THÊM NHÂN VIÊN (Mã NVxxx)
 * ============================================
 */
exports.createNhanVien = async (req, res) => {
  try {
    const {
      Ho_va_ten_lot, Ten, Gioi_tinh, Ngay_sinh,
      Dia_chi, SDT, email, CCCD,
      Ngay_bat_dau_lam, Vai_tro
    } = req.body;

    // Validation
    if (!Ten || !Gioi_tinh || !Ngay_sinh || !SDT || !email || !CCCD || !Ngay_bat_dau_lam || !Vai_tro) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const result = await db.sequelize.query(
      `EXEC sp_ThemNhanVien 
        @HoTenLot = :hoTenLot,
        @Ten = :ten,
        @GioiTinh = :gioiTinh,
        @NgaySinh = :ngaySinh,
        @DiaChi = :diaChi,
        @SDT = :sdt,
        @Email = :email,
        @CCCD = :cccd,
        @NgayBatDau = :ngayBatDau,
        @VaiTro = :vaiTro`,
      {
        replacements: {
          hoTenLot: Ho_va_ten_lot || '',
          ten: Ten,
          gioiTinh: Gioi_tinh,
          ngaySinh: Ngay_sinh,
          diaChi: Dia_chi || '',
          sdt: SDT,
          email: email,
          cccd: CCCD,
          ngayBatDau: Ngay_bat_dau_lam,
          vaiTro: Vai_tro
        },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Không thể tạo nhân viên'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Tạo nhân viên thành công',
      data: { Ma_nhan_vien: result[0].NewID, Ten, Vai_tro }
    });
  } catch (error) {
    console.error('❌ Lỗi sp_ThemNhanVien:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 2. SP ĐĂNG KÝ KHÁCH HÀNG (Mã KHxxx)
 * ============================================
 */
exports.createKhachHang = async (req, res) => {
  try {
    const {
      email,
      Ho_va_ten_lot, Ten, // Cho KH Cá nhân
      Ten_doanh_nghiep, Ma_so_thue, // Cho KH Doanh nghiệp
      Loai_khach_hang // 'CANHAN' hoặc 'DOANHNGHIEP'
    } = req.body;

    // Validation
    if (!email || !Loai_khach_hang) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: email và Loai_khach_hang'
      });
    }

    if (Loai_khach_hang === 'CANHAN' && (!Ten)) {
      return res.status(400).json({
        success: false,
        message: 'Khách hàng cá nhân cần có Tên'
      });
    }

    if (Loai_khach_hang === 'DOANHNGHIEP' && (!Ten_doanh_nghiep || !Ma_so_thue)) {
      return res.status(400).json({
        success: false,
        message: 'Khách hàng doanh nghiệp cần có Tên và Mã số thuế'
      });
    }

    const result = await db.sequelize.query(
      `EXEC sp_DangKyKhachHang 
        @Email = :email,
        @HoTenLot = :hoTenLot,
        @Ten = :ten,
        @TenDoanhNghiep = :tenDoanhNghiep,
        @MaSoThue = :maSoThue,
        @LoaiKhachHang = :loaiKhachHang`,
      {
        replacements: {
          email: email,
          hoTenLot: Ho_va_ten_lot || null,
          ten: Ten || null,
          tenDoanhNghiep: Ten_doanh_nghiep || null,
          maSoThue: Ma_so_thue || null,
          loaiKhachHang: Loai_khach_hang
        },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Không thể đăng ký khách hàng'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Đăng ký khách hàng thành công',
      data: { Ma_khach_hang: result[0].NewID, email, Loai_khach_hang }
    });
  } catch (error) {
    console.error('❌ Lỗi sp_DangKyKhachHang:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 3. SP TẠO ĐÁNH GIÁ (Mã DGxxx)
 * ============================================
 */
exports.createDanhGia = async (req, res) => {
  try {
    const { Ma_khach_hang, Ma_don_hang, Rating, Comment, DriverID } = req.body;

    // Validation
    if (!Ma_khach_hang || !Ma_don_hang || !Rating || !Comment) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    if (Rating < 1 || Rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating phải từ 1 đến 5'
      });
    }

    const result = await db.sequelize.query(
      `EXEC sp_TaoDanhGia 
        @MaKH = :maKH,
        @MaDon = :maDon,
        @Rating = :rating,
        @Comment = :comment,
        @DriverID = :driverID`,
      {
        replacements: {
          maKH: Ma_khach_hang,
          maDon: Ma_don_hang,
          rating: Rating,
          comment: Comment,
          driverID: DriverID || null
        },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Không thể tạo đánh giá'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Tạo đánh giá thành công',
      data: { Review_ID: result[0].NewID, Rating, Ma_don_hang }
    });
  } catch (error) {
    console.error('❌ Lỗi sp_TaoDanhGia:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 4. SP TẠO YÊU CẦU HỖ TRỢ (Mã YCxxx)
 * ============================================
 */
exports.createYeuCauHoTro = async (req, res) => {
  try {
    const { Ma_khach_hang, Loai_van_de, Noi_dung } = req.body;

    // Validation
    if (!Ma_khach_hang || !Loai_van_de || !Noi_dung) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const result = await db.sequelize.query(
      `EXEC sp_TaoYeuCauHoTro 
        @MaKH = :maKH,
        @LoaiVanDe = :loaiVanDe,
        @NoiDung = :noiDung`,
      {
        replacements: {
          maKH: Ma_khach_hang,
          loaiVanDe: Loai_van_de,
          noiDung: Noi_dung
        },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Không thể tạo yêu cầu hỗ trợ'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Tạo yêu cầu hỗ trợ thành công',
      data: { Ma_yeu_cau: result[0].NewID, Loai_van_de, Trang_thai: 'Chờ xử lý' }
    });
  } catch (error) {
    console.error('❌ Lỗi sp_TaoYeuCauHoTro:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 5. SP TẠO THANH TOÁN (Mã TTxxx)
 * ============================================
 */
exports.createThanhToan = async (req, res) => {
  try {
    const { Ma_khach_hang, phuong_thuc, so_tien, trang_thai } = req.body;

    // Validation
    if (!Ma_khach_hang || !phuong_thuc || !so_tien) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const result = await db.sequelize.query(
      `EXEC sp_TaoThanhToan 
        @MaKH = :maKH,
        @PhuongThuc = :phuongThuc,
        @SoTien = :soTien,
        @TrangThai = :trangThai`,
      {
        replacements: {
          maKH: Ma_khach_hang,
          phuongThuc: phuong_thuc,
          soTien: so_tien,
          trangThai: trang_thai || 'Thành công'
        },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Không thể tạo thanh toán'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Tạo thanh toán thành công',
      data: { Ma_thanh_toan: result[0].NewID, phuong_thuc, so_tien }
    });
  } catch (error) {
    console.error('❌ Lỗi sp_TaoThanhToan:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 6. SP THÊM XE (Mã VHCxxx)
 * ============================================
 */
exports.createXe = async (req, res) => {
  try {
    const {
      Bien_so, Chu_so_huu, Nam_san_xuat, Tinh_trang,
      Loai_xe, // 'XEMAY' hoặc 'XETAI'
      Phan_khoi, Khoang_cho, // Xe máy
      Trong_tai, Loai_thung // Xe tải
    } = req.body;

    // Validation
    if (!Bien_so || !Chu_so_huu || !Nam_san_xuat || !Loai_xe) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const result = await db.sequelize.query(
      `EXEC sp_ThemXe 
        @BienSo = :bienSo,
        @ChuSoHuu = :chuSoHuu,
        @NamSX = :namSX,
        @TinhTrang = :tinhTrang,
        @LoaiXe = :loaiXe,
        @PhanKhoi = :phanKhoi,
        @KhoangCho = :khoangCho,
        @TrongTai = :trongTai,
        @LoaiThung = :loaiThung`,
      {
        replacements: {
          bienSo: Bien_so,
          chuSoHuu: Chu_so_huu,
          namSX: Nam_san_xuat,
          tinhTrang: Tinh_trang || 'Sẵn sàng',
          loaiXe: Loai_xe,
          phanKhoi: Phan_khoi || null,
          khoangCho: Khoang_cho || null,
          trongTai: Trong_tai || null,
          loaiThung: Loai_thung || null
        },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Không thể thêm xe'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Thêm xe thành công',
      data: { VehicleID: result[0].NewID, Bien_so, Loai_xe }
    });
  } catch (error) {
    console.error('❌ Lỗi sp_ThemXe:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

module.exports = exports;
