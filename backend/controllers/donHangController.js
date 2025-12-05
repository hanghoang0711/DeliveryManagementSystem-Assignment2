/**
 * DON_HANG CONTROLLER
 * Controller xử lý các API endpoint cho quản lý đơn hàng
 * 
 * Chức năng:
 * - getAllDonHang: Lấy danh sách đơn hàng (có filter, sort, pagination)
 * - getDonHangById: Lấy chi tiết một đơn hàng
 * - createDonHang: Tạo đơn hàng mới
 * - updateDonHang: Cập nhật đơn hàng
 * - deleteDonHang: Xóa đơn hàng
 */

const db = require('../models');
const { Op } = require('sequelize');

const DonHang = db.DonHang;
const KhachHang = db.KhachHang;
// const HoaDon = db.HoaDon; // ❌ REMOVED in ERD v2

/**
 * ============================================
 * 1. GET ALL DON_HANG (Có Filter, Sort, Pagination)
 * ============================================
 * Endpoint: GET /api/don-hang
 * Query params:
 *   - page: Trang hiện tại (mặc định: 1)
 *   - limit: Số bản ghi mỗi trang (mặc định: 10)
 *   - trang_thai_don: Lọc theo trạng thái (ví dụ: "Đã giao")
 *   - ma_khach_hang: Lọc theo mã khách hàng (ví dụ: "KH001")
 *   - sortKey: Trường để sắp xếp (ví dụ: "thoi_gian_dat_don")
 *   - sortOrder: Chiều sắp xếp (ASC hoặc DESC, mặc định: DESC)
 */
exports.getAllDonHang = async (req, res) => {
  try {
    // ========== 1. LẤY QUERY PARAMETERS ==========
    const {
      page = 1,
      limit = 10,
      trang_thai_don,
      ma_khach_hang,
      sortKey = 'thoi_gian_dat_don',
      sortOrder = 'DESC'
    } = req.query;

    // Chuyển đổi sang số nguyên
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitInt = parseInt(limit);

    // ========== 2. XÂY DỰNG ĐIỀU KIỆN LỌC (WHERE CLAUSE) ==========
    const whereConditions = {};

    // Lọc theo trạng thái đơn hàng
    if (trang_thai_don) {
      whereConditions.Trang_thai_don = {
        [Op.like]: `%${trang_thai_don}%` // Tìm kiếm gần đúng
      };
    }

    // Lọc theo mã khách hàng
    if (ma_khach_hang) {
      whereConditions.Ma_khach_hang = ma_khach_hang; // Tìm chính xác
    }

    // ========== 3. XÂY DỰNG ĐIỀU KIỆN SẮP XẾP (ORDER BY) ==========
    const validSortKeys = [
      'thoi_gian_dat_don',
      'gia_tri_hang_hoa_phi_van_chuyen',
      'Trang_thai_don',
      'Ma_don_hang'
    ];

    const validSortOrders = ['ASC', 'DESC'];

    // Kiểm tra tính hợp lệ
    const finalSortKey = validSortKeys.includes(sortKey) ? sortKey : 'thoi_gian_dat_don';
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : 'DESC';

    const orderClause = [[finalSortKey, finalSortOrder]];

    // ========== 4. THỰC HIỆN QUERY ==========
    const { count, rows } = await DonHang.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: KhachHang,
          as: 'khachHang',
          attributes: ['Ma_khach_hang', 'email', 'Ten_hang'] // Chỉ lấy một số trường
        }
      ],
      order: orderClause,
      limit: limitInt,
      offset: offset,
      distinct: true // Đếm đúng khi có JOIN
    });

    // ========== 5. TÍNH TOÁN THÔNG TIN PHÂN TRANG ==========
    const totalPages = Math.ceil(count / limitInt);
    const currentPage = parseInt(page);

    // ========== 6. TRẢ VỀ KẾT QUẢ ==========
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách đơn hàng thành công',
      pagination: {
        totalOrders: count,           // Tổng số bản ghi
        totalPages: totalPages, // Tổng số trang
        currentPage: currentPage,
        limit: limitInt,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      },
      data: rows // Array of orders at top level
    });

  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách đơn hàng',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 2. GET DON_HANG BY ID
 * ============================================
 * Endpoint: GET /api/don-hang/:id
 */
exports.getDonHangById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm đơn hàng theo ID và include các thông tin liên quan
    const donHang = await DonHang.findOne({
      where: { Ma_don_hang: id },
      include: [
        {
          model: KhachHang,
          as: 'khachHang',
          attributes: ['Ma_khach_hang', 'email', 'Ten_hang', 'Diem_thanh_vien']
        }
        // HoaDon removed in ERD v2 - payment info integrated into DON_HANG
      ]
    });

    // Kiểm tra đơn hàng có tồn tại không
    if (!donHang) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy đơn hàng với mã ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin đơn hàng thành công',
      data: donHang
    });

  } catch (error) {
    console.error('❌ Lỗi khi lấy thông tin đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin đơn hàng',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 3. CREATE DON_HANG
 * ============================================
 * Endpoint: POST /api/don-hang
 * Body: Thông tin đơn hàng mới
 */
exports.createDonHang = async (req, res) => {
  try {
    const {
      Ma_khach_hang,
      SDT_nguoi_nhan,
      ten_nguoi_nhan,
      dia_chi_lay_hang,
      dia_chi_giao_hang,
      can_nang,
      gia_tri_hang_hoa_phi_van_chuyen,
      phuong_thuc_giao_hang,
      Thoi_gian_giao_hang_du_kien,
      Thoi_gian_lay_hang_du_kien
    } = req.body;

    // ========== VALIDATION CƠ BẢN ==========
    if (!Ma_khach_hang || !SDT_nguoi_nhan || !ten_nguoi_nhan ||
        !dia_chi_lay_hang || !dia_chi_giao_hang || !can_nang ||
        !gia_tri_hang_hoa_phi_van_chuyen || !phuong_thuc_giao_hang ||
        !Thoi_gian_giao_hang_du_kien) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Kiểm tra khách hàng có tồn tại không
    const khachHang = await KhachHang.findByPk(Ma_khach_hang);
    if (!khachHang) {
      return res.status(404).json({
        success: false,
        message: 'Khách hàng không tồn tại'
      });
    }

    // ========== GỌI STORED PROCEDURE sp_TaoDonHang ==========
    // SP sẽ tự động sinh mã DH và tính toán các giá trị
    const { QueryTypes } = require('sequelize');
    const moment = require('moment');

    // Tính toán tham số tự động
    const quangDuongGiaDinh = 10.5; // km (default)
    const donGiaKm = 15000;
    const phiVanChuyen = Math.round(quangDuongGiaDinh * donGiaKm);
    const thoiGianGiaoDuKien = moment(Thoi_gian_giao_hang_du_kien).format('YYYY-MM-DD HH:mm:ss');

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
          giaTri: gia_tri_hang_hoa_phi_van_chuyen,
          phiVanChuyen: phiVanChuyen,
          phuongThucGiao: phuong_thuc_giao_hang,
          thoiGianGiaoDuKien: thoiGianGiaoDuKien
        },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại dữ liệu.'
      });
    }

    const newMaDon = result[0].NewID;

    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công (sử dụng sp_TaoDonHang)',
      data: {
        Ma_don_hang: newMaDon,
        Ma_khach_hang,
        SDT_nguoi_nhan,
        ten_nguoi_nhan,
        dia_chi_lay_hang,
        dia_chi_giao_hang,
        can_nang,
        gia_tri_hang_hoa_phi_van_chuyen,
        phuong_thuc_giao_hang,
        phi_van_chuyen: phiVanChuyen,
        Thoi_gian_giao_hang_du_kien: thoiGianGiaoDuKien,
        Trang_thai_don: 'Đang xử lý'
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo đơn hàng',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 4. UPDATE DON_HANG
 * ============================================
 * Endpoint: PUT /api/don-hang/:id
 * Body: Thông tin cần cập nhật
 */
exports.updateDonHang = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Tìm đơn hàng
    const donHang = await DonHang.findByPk(id);
    if (!donHang) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy đơn hàng với mã ${id}`
      });
    }

    // Không cho phép cập nhật mã đơn hàng
    delete updateData.Ma_don_hang;

    // Cập nhật
    await donHang.update(updateData);

    // Lấy lại thông tin sau khi cập nhật
    const updatedDonHang = await DonHang.findOne({
      where: { Ma_don_hang: id },
      include: [
        { model: KhachHang, as: 'khachHang' }
        // HoaDon removed in ERD v2
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Cập nhật đơn hàng thành công',
      data: updatedDonHang
    });

  } catch (error) {
    console.error('❌ Lỗi khi cập nhật đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật đơn hàng',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 5. DELETE DON_HANG
 * ============================================
 * Endpoint: DELETE /api/don-hang/:id
 */
exports.deleteDonHang = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm đơn hàng
    const donHang = await DonHang.findByPk(id);
    if (!donHang) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy đơn hàng với mã ${id}`
      });
    }

    /**
     * ✅ QUY TẮC XÓA ĐƠN HÀNG THEO TRẠNG THÁI:
     * 
     * CÓ THỂ XÓA:
     * - Đang xử lý (chưa được gán tài xế)
     * - Đã huỷ (đơn đã bị hủy)
     * - Lấy hàng thất bại (chưa giao được)
     * - Giao hàng thất bại (giao không thành công)
     * - Đã hoàn về kho (hàng đã về kho)
     * 
     * KHÔNG THỂ XÓA:
     * - Đang tìm tài xế (đang xử lý)
     * - Đã tìm được tài xế (đã gán)
     * - Đang lấy hàng (đang thực hiện)
     * - Lấy hàng thành công (đang vận chuyển)
     * - Đang giao hàng (đang thực hiện)
     * - Giao hàng thành công (đã giao)
     * - Đã hoàn thành (đã thanh toán)
     */
    const DELETABLE_STATUSES = [
      'Đang xử lý',
      'Đã huỷ',
      'Lấy hàng thất bại',
      'Giao hàng thất bại',
      'Đã hoàn về kho'
    ];

    if (!DELETABLE_STATUSES.includes(donHang.Trang_thai_don)) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa đơn hàng có trạng thái "${donHang.Trang_thai_don}". Chỉ có thể xóa đơn hàng ở trạng thái: ${DELETABLE_STATUSES.join(', ')}`
      });
    }

    // ✅ XÓA CÁC BẢNG LIÊN QUAN TRƯỚC (CASCADE DELETE)
    // 1. Xóa DON_HANG_DUOC_GIAO (nếu đơn đã được gộp vào chuyến)
    await db.sequelize.query(
      'DELETE FROM DON_HANG_DUOC_GIAO WHERE Ma_don_hang = :id',
      {
        replacements: { id },
        type: db.sequelize.QueryTypes.DELETE
      }
    );

    // 2. Xóa DON_HANG_DUOC_TIEP_NHAN (nếu đơn đã được nhân viên tiếp nhận)
    await db.sequelize.query(
      'DELETE FROM DON_HANG_DUOC_TIEP_NHAN WHERE Ma_don_hang = :id',
      {
        replacements: { id },
        type: db.sequelize.QueryTypes.DELETE
      }
    );

    // 3. Xóa DON_HANG_HOAN_VE_KHO (nếu đơn đã được hoàn về kho)
    await db.sequelize.query(
      'DELETE FROM DON_HANG_HOAN_VE_KHO WHERE Ma_don_hang = :id',
      {
        replacements: { id },
        type: db.sequelize.QueryTypes.DELETE
      }
    );

    // 4. Xóa đơn hàng
    await donHang.destroy();

    res.status(200).json({
      success: true,
      message: 'Xóa đơn hàng thành công'
    });

  } catch (error) {
    console.error('❌ Lỗi khi xóa đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa đơn hàng',
      error: error.message
    });
  }
};
