/**
 * BAO_CAO CONTROLLER
 * Controller xử lý các API endpoint cho báo cáo và thống kê
 * 
 * Chức năng:
 * - getTopTaiXe: Gọi function fn_TopTaiXeDonGian từ database
 */

const db = require('../models');
const { QueryTypes } = require('sequelize');
const moment = require('moment'); // Ensure moment is imported for date formatting

/**
 * ============================================
 * GET TOP TÀI XẾ (Gọi Function từ SQL Server)
 * ============================================
 * Endpoint: GET /api/bao-cao/top-tai-xe
 * Query params:
 *   - topN: Số lượng tài xế cần lấy (mặc định: 5)
 *   - minStar: Rating tối thiểu (mặc định: 4.0)
 * 
 * Function SQL: fn_TopTaiXeDonGian(@TopN INT, @MinStar DECIMAL(2,1))
 * 
 * Trả về:
 * - DriverID: Mã tài xế
 * - Ho_ten: Họ tên tài xế
 * - SoChuyenGiao: Số chuyến giao đã hoàn thành
 * - Rating: Điểm đánh giá trung bình
 */
exports.getTopTaiXe = async (req, res) => {
  try {
    // ========== 1. LẤY QUERY PARAMETERS ==========
    const {
      topN = 5,
      minStar = 4.0
    } = req.query;

    // Chuyển đổi kiểu dữ liệu
    const topNInt = parseInt(topN);
    const minStarFloat = parseFloat(minStar);

    // ========== 2. VALIDATION ==========
    
    // Kiểm tra topN
    if (isNaN(topNInt) || topNInt <= 0 || topNInt > 100) {
      return res.status(400).json({
        success: false,
        message: 'topN phải là số nguyên dương trong khoảng 1-100'
      });
    }

    // Kiểm tra minStar
    if (isNaN(minStarFloat) || minStarFloat < 1.0 || minStarFloat > 5.0) {
      return res.status(400).json({
        success: false,
        message: 'minStar phải là số thập phân trong khoảng 1.0-5.0'
      });
    }

    // ========== 3. GỌI FUNCTION TỪ SQL SERVER ==========
    /**
     * Cách gọi Function trong SQL Server bằng Sequelize:
     * - Sử dụng sequelize.query() với type: QueryTypes.SELECT
     * - Dùng named parameters với :paramName
     * - SQL Server function: SELECT * FROM dbo.fn_TopTaiXeDonGian(@TopN, @MinStar)
     */
    const result = await db.sequelize.query(
      'SELECT * FROM dbo.fn_TopTaiXeDonGian(:topN, :minStar)',
      {
        replacements: {
          topN: topNInt,
          minStar: minStarFloat
        },
        type: QueryTypes.SELECT
      }
    );

    // ========== 4. KIỂM TRA KẾT QUẢ ==========
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy tài xế nào có rating >= ${minStarFloat}`
      });
    }

    // ========== 5. MAP COLUMNS ==========
    // Function trả về: DriverID, Ho_ten, SoChuyenGiao, Rating
    // Test expect: Ma_tai_xe, Ten_tai_xe, so_don_giao, diem_trung_binh
    const mappedResult = result.map(row => ({
      Ma_tai_xe: row.DriverID,
      Ten_tai_xe: row.Ho_ten,
      so_don_giao: row.SoChuyenGiao,
      diem_trung_binh: row.Rating
    }));

    // ========== 6. TRẢ VỀ KẾT QUẢ ==========
    res.status(200).json({
      success: true,
      message: 'Lấy báo cáo top tài xế thành công',
      data: mappedResult,
      criteria: {
        topN: topNInt,
        minStar: minStarFloat
      },
      summary: {
        totalFound: mappedResult.length
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi lấy báo cáo top tài xế:', error);
    
    // Kiểm tra lỗi cụ thể
    if (error.message.includes('Invalid object name')) {
      return res.status(500).json({
        success: false,
        message: 'Function fn_TopTaiXeDonGian chưa tồn tại trong database',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy báo cáo top tài xế',
      error: error.message
    });
  }
};

/**
 * ============================================
 * TẠO ĐƠN HÀNG SỬ DỤNG STORED PROCEDURE
 * ============================================
 * Endpoint: POST /api/bao-cao/tao-don-hang-sp
 * 
 * Frontend gửi lên 8 params:
 * - Ma_khach_hang, SDT_nguoi_nhan, ten_nguoi_nhan
 * - dia_chi_lay_hang, dia_chi_giao_hang
 * - can_nang, gia_tri_hang_hoa, phuong_thuc_giao_hang
 * 
 * Backend tự tính:
 * - PhiVanChuyen = 15,000 * 5 (giả định 5km)
 * - ThoiGianGiaoDuKien = Hiện tại + 3 ngày
 * 
 * Stored Procedure: sp_TaoDonHang
 */
exports.createOrderUsingSP = async (req, res) => {
  try {
    // ========== 1. LẤY DỮ LIỆU TỪ REQUEST BODY ==========
    const {
      Ma_khach_hang,
      SDT_nguoi_nhan,
      ten_nguoi_nhan,
      dia_chi_lay_hang,
      dia_chi_giao_hang,
      can_nang,
      gia_tri_hang_hoa,
      phuong_thuc_giao_hang
    } = req.body;

    // ========== 2. VALIDATION CƠ BẢN ==========
    if (!Ma_khach_hang || !SDT_nguoi_nhan || !ten_nguoi_nhan ||
        !dia_chi_lay_hang || !dia_chi_giao_hang || !can_nang ||
        !gia_tri_hang_hoa || !phuong_thuc_giao_hang) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // ========== 3. KIỂM TRA SỰ TỒN TẠI CỦA KHÁCH HÀNG ==========
    const customerExists = await db.sequelize.query(
      'SELECT 1 FROM KHACH_HANG WHERE Ma_khach_hang = :maKH',
      {
        replacements: { maKH: Ma_khach_hang },
        type: QueryTypes.SELECT
      }
    );

    if (!customerExists || customerExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Khách hàng không tồn tại'
      });
    }

    // ========== 4. TÍNH TOÁN THAM SỐ TỰ ĐỘNG ==========
    // PhiVanChuyen: Giả định 5km * 15,000 VND/km
    const quangDuongGiaDinh = 5.0;
    const donGiaKm = 15000;
    const phiVanChuyen = quangDuongGiaDinh * donGiaKm;

    // ThoiGianGiaoDuKien: Hiện tại + 3 ngày
    const thoiGianGiaoDuKien = moment().add(3, 'days').format('YYYY-MM-DD HH:mm:ss');

    // ========== 5. GỌI STORED PROCEDURE ==========
    /**
     * SQL Server Stored Procedure:
     * EXEC sp_TaoDonHang 
     *   @MaKH, @SDTNhan, @TenNguoiNhan,
     *   @DiaChiLay, @DiaChiGiao, @CanNang,
     *   @GiaTri, @PhiVanChuyen, @PhuongThucGiao, @ThoiGianGiaoDuKien
     */
    const result = await db.sequelize.query(
      `EXEC sp_TaoDonHang 
        @MaKH = :maKH,
        @SDTNhan = :sdtNhan,
        @TenNguoiNhan = :tenNguoiNhan,
        @DiaChiLay = :diaChiLay,
        @DiaChiGiao = :diaChiGiao,
        @CanNang = :canNang,
        @GiaTri = :giaTri,
        @PhiVanChuyen = :phiVanChuyen,
        @PhuongThucGiao = :phuongThucGiao,
        @ThoiGianGiaoDuKien = :thoiGianGiaoDuKien`,
      {
        replacements: {
          maKH: Ma_khach_hang,
          sdtNhan: SDT_nguoi_nhan,
          tenNguoiNhan: ten_nguoi_nhan,
          diaChiLay: dia_chi_lay_hang,
          diaChiGiao: dia_chi_giao_hang,
          canNang: can_nang,
          giaTri: gia_tri_hang_hoa,
          phiVanChuyen: phiVanChuyen,
          phuongThucGiao: phuong_thuc_giao_hang,
          thoiGianGiaoDuKien: thoiGianGiaoDuKien
        },
        type: QueryTypes.SELECT
      }
    );

    // ========== 6. XỬ LÝ KẾT QUẢ ==========
    if (!result || result.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại dữ liệu.'
      });
    }

    // Stored Procedure trả về: MaDonHangMoi
    const maDonHangMoi = result[0].MaDonHangMoi;

    // ========== 7. TRẢ VỀ KẾT QUẢ ==========
    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công bằng stored procedure',
      data: {
        Ma_don_hang: maDonHangMoi,
        Trang_thai_don: 'Đang xử lý',
        phi_van_chuyen: phiVanChuyen,
        thoi_gian_giao_du_kien: thoiGianGiaoDuKien,
        quang_duong_gia_dinh: quangDuongGiaDinh
      },
      calculatedParams: {
        phiVanChuyen: phiVanChuyen,
        thoiGianGiaoDuKien: thoiGianGiaoDuKien,
        quangDuongGiaDinh: quangDuongGiaDinh
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi tạo đơn hàng bằng stored procedure:', error);

    // Kiểm tra lỗi cụ thể
    if (error.message.includes('Could not find stored procedure')) {
      return res.status(500).json({
        success: false,
        message: 'Stored procedure sp_TaoDonHang chưa tồn tại trong database',
        error: error.message
      });
    }

    if (error.message.includes('Khách hàng không tồn tại')) {
      return res.status(404).json({
        success: false,
        message: 'Khách hàng không tồn tại',
        error: error.message
      });
    }

    if (error.message.includes('CHECK constraint')) {
      return res.status(500).json({
        success: false,
        message: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các giá trị đầu vào.',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo đơn hàng bằng stored procedure',
      error: error.message
    });
  }
};

/**
 * ============================================
 * (OPTIONAL) GET TOP KHÁCH HÀNG THEO DOANH THU
 * ============================================
 * Gọi function fn_TopKhachHangTheoDoanhThu
 */
exports.getTopKhachHang = async (req, res) => {
  try {
    // Lấy params từ query
    const topN = parseInt(req.query.topN) || 10;
    
    // ✅ PARAMS THỜI GIAN (Function SQL chỉ nhận 3 params: @TopN, @TuNgay, @DenNgay)
    const startDate = req.query.startDate || '2020-01-01'; // Default: từ 2020
    const endDate = req.query.endDate || '2099-12-31';     // Default: đến 2099
    
    // Validation
    if (topN <= 0 || topN > 100) {
      return res.status(400).json({
        success: false,
        message: 'topN phải là số nguyên dương trong khoảng 1-100'
      });
    }
    
    // ✅ FIX: Dùng TOP trong subquery và lấy số điện thoại đầu tiên (không JOIN với SDT table tránh duplicate)
    // Function đã trả về TongDonHang, không cần COUNT lại
    // Test expect: Ma_khach_hang, Email, SDT, total_revenue, so_don_hang
    const results = await db.sequelize.query(
      `SELECT 
        f.Ma_khach_hang,
        kh.email as Email,
        (
          SELECT TOP 1 So_dien_thoai 
          FROM SO_DIEN_THOAI_CUA_KHACH_HANG 
          WHERE Ma_khach_hang = f.Ma_khach_hang
        ) as SDT,
        f.TongDoanhThu as total_revenue,
        f.TongDonHang as so_don_hang
      FROM dbo.fn_TopKhachHangTheoDoanhThu(:topN, :startDate, :endDate) f
      LEFT JOIN KHACH_HANG kh ON f.Ma_khach_hang = kh.Ma_khach_hang
      ORDER BY f.TongDoanhThu DESC, f.TongDonHang DESC`,
      {
        replacements: { 
          topN, 
          startDate,
          endDate
        },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không có dữ liệu trong khoảng thời gian này'
      });
    }

    res.json({
      success: true,
      message: 'Lấy báo cáo top khách hàng thành công',
      data: results,
      criteria: {
        topN,
        startDate,
        endDate
      },
      summary: {
        totalFound: results.length
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi lấy top khách hàng:', error);
    
    if (error.message.includes('Invalid object name')) {
      return res.status(500).json({
        success: false,
        message: 'Function fn_TopKhachHangTheoDoanhThu chưa tồn tại trong database',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy báo cáo top khách hàng',
      error: error.message
    });
  }
};