/**
 * CHUYEN_GIAO_HANG CONTROLLER (ERD v2)
 * Controller xử lý các API endpoint cho quản lý chuyến giao hàng
 * 
 * Chức năng:
 * - getAllChuyenGiaoHang: Lấy danh sách chuyến giao hàng
 * - getChuyenGiaoHangById: Lấy chi tiết một chuyến
 * - createChuyenGiaoHang: Tạo chuyến mới
 * - addDonHangToChuyenGiao: Gộp đơn hàng vào chuyến
 * - updateChuyenGiaoHang: Cập nhật chuyến
 * - calculateTotalDistance: Tính tổng quãng đường của chuyến
 */

const db = require('../models');
const { Op } = require('sequelize');

const ChuyenGiaoHang = db.ChuyenGiaoHang;
const DonHang = db.DonHang;
const DonHangDuocGiao = db.DonHangDuocGiao;
const TaiXe = db.TaiXe;

/**
 * ============================================
 * 1. GET ALL CHUYEN_GIAO_HANG
 * ============================================
 * Endpoint: GET /api/chuyen-giao-hang
 */
exports.getAllChuyenGiaoHang = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      trang_thai = '',
      driver_id = '',
      sortKey = 'DeliveryID',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitInt = parseInt(limit);

    // 🐛 DEBUG: Log received filter values
    console.log('🔍 Filter params:', { trang_thai, driver_id });

    // Build where conditions
    const whereConditions = {};
    if (trang_thai) {
      // Trim whitespace để tránh lỗi khoảng trắng thừa
      whereConditions.TrangThaiChuyen = trang_thai.trim();
    }
    if (driver_id) {
      whereConditions.DriverID = driver_id.trim();
    }

    // 🐛 DEBUG: Log where conditions
    console.log('🔍 Where conditions:', whereConditions);

    // ✅ FIX: If no results found with filters, return empty instead of all records
    // Check if filter is applied but no results
    if (trang_thai || driver_id) {
      const hasResults = await ChuyenGiaoHang.count({ where: whereConditions });
      if (hasResults === 0) {
        return res.status(200).json({
          success: true,
          message: 'Không tìm thấy chuyến giao hàng phù hợp với bộ lọc',
          pagination: {
            total: 0,
            totalPages: 0,
            currentPage: parseInt(page),
            limit: limitInt
          },
          data: []
        });
      }
    }

    // Query with pagination
    const { count, rows } = await ChuyenGiaoHang.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: TaiXe,
          as: 'taiXe',
          attributes: ['DriverID', 'Ho_ten', 'Rating']
        },
        {
          model: DonHang,
          as: 'donHangs',
          through: {
            attributes: ['Thoi_diem_gop_don', 'Thu_tu_lay_hang', 'Thu_tu_giao_hang']
          },
          attributes: ['Ma_don_hang', 'quang_duong', 'Trang_thai_don']
        }
      ],
      order: [[sortKey, sortOrder.toUpperCase()]],
      limit: limitInt,
      offset: offset,
      distinct: true
    });

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách chuyến giao hàng thành công',
      pagination: {
        total: count,
        totalPages: Math.ceil(count / limitInt),
        currentPage: parseInt(page),
        limit: limitInt
      },
      data: rows
    });

  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách chuyến giao hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 2. GET CHUYEN_GIAO_HANG BY ID
 * ============================================
 * Endpoint: GET /api/chuyen-giao-hang/:id
 */
exports.getChuyenGiaoHangById = async (req, res) => {
  try {
    const { id } = req.params;

    const chuyenGiao = await ChuyenGiaoHang.findOne({
      where: { DeliveryID: id },
      include: [
        {
          model: TaiXe,
          as: 'taiXe',
          attributes: ['DriverID', 'Ho_ten', 'Rating']
          // So_dien_thoai ở bảng TAI_XE_SDT riêng (1-N relationship)
        },
        {
          model: DonHang,
          as: 'donHangs',
          through: {
            attributes: [
              'Thoi_diem_gop_don',
              'Thu_tu_lay_hang',
              'Thu_tu_giao_hang',
              'Thoi_gian_lay_hang_thuc_te',
              'Thoi_gian_giao_hang_thuc_te'
            ]
          },
          attributes: [
            'Ma_don_hang',
            'dia_chi_lay_hang',
            'dia_chi_giao_hang',
            'quang_duong',
            'Trang_thai_don',
            'ten_nguoi_nhan',
            'SDT_nguoi_nhan'
          ]
        }
      ]
    });

    if (!chuyenGiao) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy chuyến giao hàng với mã ${id}`
      });
    }

    // Tính tổng quãng đường từ các đơn hàng
    const tongQuangDuong = chuyenGiao.donHangs.reduce((total, donHang) => {
      return total + (parseFloat(donHang.quang_duong) || 0);
    }, 0);

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin chuyến giao hàng thành công',
      data: {
        ...chuyenGiao.toJSON(),
        tong_quang_duong_tinh_toan: tongQuangDuong.toFixed(2) // km
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi lấy thông tin chuyến giao hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 3. CREATE CHUYEN_GIAO_HANG
 * ============================================
 * Endpoint: POST /api/chuyen-giao-hang
 */
exports.createChuyenGiaoHang = async (req, res) => {
  try {
    const { DriverID } = req.body;

    // Validation
    if (!DriverID) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: DriverID'
      });
    }

    // Kiểm tra tài xế tồn tại
    const taiXe = await TaiXe.findByPk(DriverID);
    if (!taiXe) {
      return res.status(404).json({
        success: false,
        message: 'Tài xế không tồn tại'
      });
    }

    // Sinh mã chuyến giao hàng tự động
    const lastChuyen = await ChuyenGiaoHang.findOne({
      order: [['DeliveryID', 'DESC']],
      attributes: ['DeliveryID']
    });

    let newDeliveryID = 'CGH001';
    if (lastChuyen) {
      const lastNumber = parseInt(lastChuyen.DeliveryID.replace('CGH', ''));
      newDeliveryID = 'CGH' + String(lastNumber + 1).padStart(3, '0');
    }

    // Tạo chuyến giao hàng mới
    const newChuyen = await ChuyenGiaoHang.create({
      DeliveryID: newDeliveryID,
      DriverID,
      so_luong_don_gop: 0, // Ban đầu chưa có đơn nào
      TrangThaiChuyen: 'Đang thực hiện'
    });

    res.status(201).json({
      success: true,
      message: 'Tạo chuyến giao hàng thành công',
      data: newChuyen
    });

  } catch (error) {
    console.error('❌ Lỗi khi tạo chuyến giao hàng:', error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 4. ADD DON_HANG TO CHUYEN_GIAO (Gộp đơn)
 * ============================================
 * Endpoint: POST /api/chuyen-giao-hang/:id/add-don-hang
 */
exports.addDonHangToChuyenGiao = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params; // DeliveryID
    const { Ma_don_hang, Thu_tu_lay_hang, Thu_tu_giao_hang } = req.body;

    // Validation
    if (!Ma_don_hang || !Thu_tu_lay_hang || !Thu_tu_giao_hang) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: Ma_don_hang, Thu_tu_lay_hang, Thu_tu_giao_hang'
      });
    }

    // Kiểm tra chuyến giao hàng
    const chuyenGiao = await ChuyenGiaoHang.findByPk(id, { transaction });
    if (!chuyenGiao) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Chuyến giao hàng không tồn tại'
      });
    }

    // Kiểm tra đơn hàng
    const donHang = await DonHang.findByPk(Ma_don_hang, { transaction });
    if (!donHang) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    // Kiểm tra đơn đã được gộp vào chuyến khác chưa
    const existingAssignment = await DonHangDuocGiao.findOne({
      where: { Ma_don_hang },
      transaction
    });

    if (existingAssignment) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Đơn hàng ${Ma_don_hang} đã được gộp vào chuyến ${existingAssignment.DeliveryID}`
      });
    }

    // Thêm đơn vào chuyến (bảng trung gian)
    // FIX: Dùng raw SQL INSERT để tránh Sequelize tự động thêm timezone
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedNow = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    await db.sequelize.query(
      `INSERT INTO DON_HANG_DUOC_GIAO 
       (DeliveryID, Ma_don_hang, Thu_tu_lay_hang, Thu_tu_giao_hang, Thoi_diem_gop_don)
       VALUES (:deliveryId, :maDonHang, :thuTuLay, :thuTuGiao, :thoiDiem)`,
      {
        replacements: {
          deliveryId: id,
          maDonHang: Ma_don_hang,
          thuTuLay: Thu_tu_lay_hang,
          thuTuGiao: Thu_tu_giao_hang,
          thoiDiem: formattedNow
        },
        transaction,
        type: db.Sequelize.QueryTypes.INSERT
      }
    );

    // Cập nhật số lượng đơn gộp
    await chuyenGiao.increment('so_luong_don_gop', { by: 1, transaction });

    // Cập nhật trạng thái đơn hàng
    await donHang.update({
      Trang_thai_don: 'Đã tìm được tài xế'
    }, { transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Gộp đơn hàng vào chuyến thành công',
      data: {
        DeliveryID: id,
        Ma_don_hang,
        so_luong_don_gop_moi: chuyenGiao.so_luong_don_gop + 1
      }
    });

  } catch (error) {
    // Safely rollback transaction
    try {
      if (transaction) {
        await transaction.rollback();
      }
    } catch (rollbackError) {
      console.error('⚠️ Lỗi khi rollback transaction:', rollbackError.message);
    }
    
    console.error('❌ Lỗi khi gộp đơn:', error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi gộp đơn',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 5. UPDATE CHUYEN_GIAO_HANG
 * ============================================
 * Endpoint: PUT /api/chuyen-giao-hang/:id
 */
exports.updateChuyenGiaoHang = async (req, res) => {
  try {
    const { id } = req.params;
    const { TrangThaiChuyen } = req.body;

    const chuyenGiao = await ChuyenGiaoHang.findByPk(id);
    if (!chuyenGiao) {
      return res.status(404).json({
        success: false,
        message: 'Chuyến giao hàng không tồn tại'
      });
    }

    // Validate trạng thái
    const validStatuses = ['Đang thực hiện', 'Hoàn thành', 'Đã hủy'];
    if (TrangThaiChuyen && !validStatuses.includes(TrangThaiChuyen)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    await chuyenGiao.update({ TrangThaiChuyen });

    res.status(200).json({
      success: true,
      message: 'Cập nhật chuyến giao hàng thành công',
      data: chuyenGiao
    });

  } catch (error) {
    console.error('❌ Lỗi khi cập nhật:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

/**
 * ============================================
 * 6. CALCULATE TOTAL DISTANCE (Helper API)
 * ============================================
 * Endpoint: GET /api/chuyen-giao-hang/:id/total-distance
 */
exports.calculateTotalDistance = async (req, res) => {
  try {
    const { id } = req.params;

    const chuyenGiao = await ChuyenGiaoHang.findOne({
      where: { DeliveryID: id },
      include: [{
        model: DonHang,
        as: 'donHangs',
        attributes: ['Ma_don_hang', 'quang_duong']
      }]
    });

    if (!chuyenGiao) {
      return res.status(404).json({
        success: false,
        message: 'Chuyến giao hàng không tồn tại'
      });
    }

    const tongQuangDuong = chuyenGiao.donHangs.reduce((total, donHang) => {
      return total + (parseFloat(donHang.quang_duong) || 0);
    }, 0);

    res.status(200).json({
      success: true,
      message: 'Tính tổng quãng đường thành công',
      data: {
        DeliveryID: id,
        so_luong_don: chuyenGiao.donHangs.length,
        tong_quang_duong_km: tongQuangDuong.toFixed(2)
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi tính quãng đường:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
