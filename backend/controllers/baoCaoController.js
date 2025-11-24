/**
 * BAO_CAO CONTROLLER
 * Controller xử lý các API endpoint cho báo cáo và thống kê
 * 
 * Chức năng:
 * - getTopTaiXe: Gọi function fn_TopTaiXeDonGian từ database
 */

const db = require('../models');
const { QueryTypes } = require('sequelize');

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
    
    // ✅ FIX: Thêm tiêu chí phụ - số đơn hàng để tránh trùng doanh thu
    // Gọi function và JOIN với KHACH_HANG + SO_DIEN_THOAI_CUA_KHACH_HANG để lấy Email, SDT
    // + COUNT đơn hàng để làm tiêu chí sắp xếp phụ
    // Test expect: Ma_khach_hang, Email, SDT, total_revenue, so_don_hang
    const results = await db.sequelize.query(
      `SELECT TOP (:topN)
        f.Ma_khach_hang,
        kh.email as Email,
        sdt.So_dien_thoai as SDT,
        f.TongDoanhThu as total_revenue,
        COUNT(dh.Ma_don_hang) as so_don_hang
      FROM dbo.fn_TopKhachHangTheoDoanhThu(100, :startDate, :endDate) f
      LEFT JOIN KHACH_HANG kh ON f.Ma_khach_hang = kh.Ma_khach_hang
      LEFT JOIN SO_DIEN_THOAI_CUA_KHACH_HANG sdt ON f.Ma_khach_hang = sdt.Ma_khach_hang
      LEFT JOIN DON_HANG dh ON f.Ma_khach_hang = dh.Ma_khach_hang
      GROUP BY f.Ma_khach_hang, kh.email, sdt.So_dien_thoai, f.TongDoanhThu
      ORDER BY f.TongDoanhThu DESC, COUNT(dh.Ma_don_hang) DESC`,
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