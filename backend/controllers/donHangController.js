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
const HoaDon = db.HoaDon;

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
        },
        {
          model: HoaDon,
          as: 'hoaDon',
          attributes: ['Ma_hoa_don', 'So_tien_goc', 'so_tien_sau_khi_giam', 'thoi_gian_tao']
        }
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

    // ========== SINH MÃ ĐƠN HÀNG TỰ ĐỘNG ==========
    const lastDonHang = await DonHang.findOne({
      order: [['Ma_don_hang', 'DESC']],
      attributes: ['Ma_don_hang']
    });

    let newMaDonHang = 'DH0001';
    if (lastDonHang) {
      // Lấy số từ mã đơn hàng (DH0001 -> 1, DH0006 -> 6, DH0123 -> 123)
      const lastNumber = parseInt(lastDonHang.Ma_don_hang.replace('DH', ''));
      const newNumber = lastNumber + 1;
      newMaDonHang = 'DH' + String(newNumber).padStart(4, '0');
    }

    // ========== FORMAT DATETIME for SQL Server ==========
    const formatForSQL = (dateStr) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // ========== TẠO ĐƠN HÀNG MỚI (Use Raw SQL to avoid timezone issues) ==========
    const now = formatForSQL(new Date());
    const expectedDelivery = formatForSQL(Thoi_gian_giao_hang_du_kien);
    const expectedPickup = Thoi_gian_lay_hang_du_kien ? formatForSQL(Thoi_gian_lay_hang_du_kien) : null;

    await db.sequelize.query(
      `INSERT INTO DON_HANG (
        Ma_don_hang, Ma_khach_hang, SDT_nguoi_nhan, ten_nguoi_nhan,
        dia_chi_lay_hang, dia_chi_giao_hang, can_nang, 
        gia_tri_hang_hoa_phi_van_chuyen, phuong_thuc_giao_hang,
        Thoi_gian_giao_hang_du_kien, Thoi_gian_lay_hang_du_kien,
        Trang_thai_don, thoi_gian_dat_don, diem_tich_luy
      ) VALUES (
        :ma_don_hang, :ma_khach_hang, :sdt, :ten,
        :dia_chi_lay, :dia_chi_giao, :can_nang,
        :gia_tri, :phuong_thuc,
        :giao_du_kien, :lay_du_kien,
        :trang_thai, :dat_don, :diem
      )`,
      {
        replacements: {
          ma_don_hang: newMaDonHang,
          ma_khach_hang: Ma_khach_hang,
          sdt: SDT_nguoi_nhan,
          ten: ten_nguoi_nhan,
          dia_chi_lay: dia_chi_lay_hang,
          dia_chi_giao: dia_chi_giao_hang,
          can_nang,
          gia_tri: gia_tri_hang_hoa_phi_van_chuyen,
          phuong_thuc: phuong_thuc_giao_hang,
          giao_du_kien: expectedDelivery,
          lay_du_kien: expectedPickup,
          trang_thai: 'Đã tạo',
          dat_don: now,
          diem: 0
        },
        type: db.Sequelize.QueryTypes.INSERT
      }
    );

    // Fetch the created order
    const newDonHang = await DonHang.findByPk(newMaDonHang);

    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: newDonHang
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
        { model: KhachHang, as: 'khachHang' },
        { model: HoaDon, as: 'hoaDon' }
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

    // Kiểm tra trạng thái đơn hàng (không cho xóa đơn đã hoàn thành)
    if (donHang.Trang_thai_don === 'Đã giao') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa đơn hàng đã hoàn thành'
      });
    }

    // Kiểm tra có bản ghi liên quan không (FK constraint check)
    // Check các bảng: DON_HANG_DUOC_TIEP_NHAN, DON_HANG_DUOC_GIAO, HOA_DON, etc.
    const checkTables = [
      'DON_HANG_DUOC_TIEP_NHAN',
      'DON_HANG_DUOC_GIAO',
      'THONG_TIN_XU_LI_DON_HANG',
      'HOA_DON'
    ];

    for (const table of checkTables) {
      const hasDependencies = await db.sequelize.query(
        `SELECT COUNT(*) as count FROM ${table} WHERE Ma_don_hang = :id`,
        {
          replacements: { id },
          type: db.sequelize.QueryTypes.SELECT
        }
      );

      if (hasDependencies[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: `Không thể xóa đơn hàng đã có dữ liệu liên quan trong bảng ${table}. Vui lòng xóa dữ liệu liên quan trước.`
        });
      }
    }

    // Xóa
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
