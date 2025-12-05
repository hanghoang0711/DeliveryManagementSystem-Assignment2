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

    // ✅ Validate sortKey - chỉ cho phép field hợp lệ
    const validSortKeys = ['DeliveryID', 'so_luong_don_gop', 'DriverID', 'TrangThaiChuyen'];
    const validatedSortKey = validSortKeys.includes(sortKey) ? sortKey : 'DeliveryID';

    // 🐛 DEBUG: Log received filter values
    console.log('🔍 Filter params:', { trang_thai, driver_id, sortKey: validatedSortKey });

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
      order: [[validatedSortKey, sortOrder.toUpperCase()]],
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
    const { QueryTypes } = require('sequelize');

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

    // Gọi stored procedure sp_TaoChuyenGiaoHang
    const result = await db.sequelize.query(
      `EXEC sp_TaoChuyenGiaoHang @DriverID = :driverID`,
      {
        replacements: { driverID: DriverID },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Không thể tạo chuyến giao hàng. Vui lòng thử lại.'
      });
    }

    const newDeliveryID = result[0].NewID;

    res.status(201).json({
      success: true,
      message: 'Tạo chuyến giao hàng thành công (sử dụng sp_TaoChuyenGiaoHang)',
      data: {
        DeliveryID: newDeliveryID,
        DriverID,
        TrangThaiChuyen: 'Đang thực hiện',
        so_luong_don_gop: 0
      }
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

/**
 * ============================================
 * 7. DELETE CHUYEN_GIAO_HANG
 * ============================================
 * Endpoint: DELETE /api/chuyen-giao-hang/:id
 * 
 * Logic xóa:
 * - Kiểm tra chuyến giao hàng tồn tại
 * - Kiểm tra trạng thái (chỉ cho phép xóa chuyến "Đã hủy" hoặc chưa có đơn hàng)
 * - Xóa quan hệ DON_HANG_DUOC_GIAO trước (bảng trung gian)
 * - Cập nhật trạng thái đơn hàng về "Đang tìm tài xế"
 * - Xóa chuyến giao hàng
 */
exports.deleteChuyenGiaoHang = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;

    // 1. Kiểm tra chuyến giao hàng tồn tại
    const chuyenGiao = await ChuyenGiaoHang.findOne({
      where: { DeliveryID: id },
      include: [{
        model: DonHang,
        as: 'donHangs',
        attributes: ['Ma_don_hang', 'Trang_thai_don']
      }],
      transaction
    });

    if (!chuyenGiao) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Chuyến giao hàng không tồn tại'
      });
    }

    // 2. Kiểm tra điều kiện xóa
    // Chỉ cho phép xóa nếu:
    // - Trạng thái là "Đã hủy" HOẶC
    // - Chuyến chưa có đơn hàng nào (so_luong_don_gop = 0)
    const canDelete = chuyenGiao.TrangThaiChuyen === 'Đã hủy' || chuyenGiao.so_luong_don_gop === 0;

    if (!canDelete) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa chuyến giao hàng đang hoạt động. Vui lòng hủy chuyến trước khi xóa hoặc đảm bảo chuyến chưa có đơn hàng.',
        data: {
          TrangThaiChuyen: chuyenGiao.TrangThaiChuyen,
          so_luong_don_gop: chuyenGiao.so_luong_don_gop
        }
      });
    }

    // 3. Nếu có đơn hàng trong chuyến, cập nhật trạng thái đơn hàng
    if (chuyenGiao.donHangs && chuyenGiao.donHangs.length > 0) {
      const maDonHangs = chuyenGiao.donHangs.map(dh => dh.Ma_don_hang);
      
      // Cập nhật trạng thái đơn hàng về "Đang tìm tài xế"
      await DonHang.update(
        { Trang_thai_don: 'Đang tìm tài xế' },
        { 
          where: { Ma_don_hang: maDonHangs },
          transaction 
        }
      );

      console.log(`✅ Đã cập nhật ${maDonHangs.length} đơn hàng về trạng thái "Đang tìm tài xế"`);
    }

    // 4. Xóa quan hệ trong bảng trung gian DON_HANG_DUOC_GIAO
    await DonHangDuocGiao.destroy({
      where: { DeliveryID: id },
      transaction
    });

    console.log(`✅ Đã xóa quan hệ DON_HANG_DUOC_GIAO cho chuyến ${id}`);

    // 5. Xóa KHOANG_CACH_VAN_CHUYEN (foreign key constraint)
    await db.sequelize.query(
      'DELETE FROM KHOANG_CACH_VAN_CHUYEN WHERE DeliveryID = :deliveryId',
      {
        replacements: { deliveryId: id },
        transaction,
        type: db.Sequelize.QueryTypes.DELETE
      }
    );

    console.log(`✅ Đã xóa KHOANG_CACH_VAN_CHUYEN cho chuyến ${id}`);

    // 6. Xóa chuyến giao hàng
    await chuyenGiao.destroy({ transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Xóa chuyến giao hàng thành công',
      data: {
        DeliveryID: id,
        so_don_hang_da_cap_nhat: chuyenGiao.donHangs ? chuyenGiao.donHangs.length : 0
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

    console.error('❌ Lỗi khi xóa chuyến giao hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa chuyến giao hàng',
      error: error.message
    });
  }
};


/**
 * CHUYEN_GIAO_HANG CONTROLLER (ERD v2)
 */

// const db = require('../models');
// const { Op } = require('sequelize');

// const ChuyenGiaoHang = db.ChuyenGiaoHang;
// const DonHang = db.DonHang;
// const DonHangDuocGiao = db.DonHangDuocGiao;
// const TaiXe = db.TaiXe;

// // ==========================
// // 1. GET ALL CHUYEN GIAO HÀNG
// // ==========================
// exports.getAllChuyenGiaoHang = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       trang_thai = '',
//       driver_id = '',
//       sortKey = 'DeliveryID',
//       sortOrder = 'DESC'
//     } = req.query;

//     const offset = (parseInt(page) - 1) * parseInt(limit);
//     const limitInt = parseInt(limit);

//     const whereConditions = {};
//     if (trang_thai) whereConditions.TrangThaiChuyen = trang_thai.trim();
//     if (driver_id) whereConditions.DriverID = driver_id.trim();

//     const { count, rows } = await ChuyenGiaoHang.findAndCountAll({
//       where: whereConditions,
//       attributes: ['DeliveryID', 'DriverID', 'TrangThaiChuyen', 'Ngay_bat_dau', 'Ngay_ket_thuc'],
//       include: [
//         {
//           model: TaiXe,
//           as: 'taiXe',
//           attributes: ['DriverID', 'Ho_ten', 'Rating']
//         },
//         {
//           model: DonHang,
//           as: 'donHangs',
//           through: { attributes: ['Thoi_diem_gop_don', 'Thu_tu_lay_hang', 'Thu_tu_giao_hang'] },
//           attributes: ['Ma_don_hang', 'quang_duong', 'Trang_thai_don']
//         }
//       ],
//       order: [[sortKey, sortOrder.toUpperCase()]],
//       limit: limitInt,
//       offset: offset,
//       distinct: true
//     });

//     // 🛠 Thêm field số đơn hàng + tổng quãng đường
//     const formattedTrips = rows.map(trip => {
//       const quangDuong = trip.donHangs.reduce((total, don) => total + (parseFloat(don.quang_duong) || 0), 0);
//       return {
//         ...trip.toJSON(),
//         so_don_hang: trip.donHangs.length || 0,
//         tong_quang_duong: quangDuong.toFixed(2) // km
//       };
//     });

//     console.log("📦 Dữ liệu gửi về frontend:", formattedTrips);

//     res.status(200).json({
//       success: true,
//       message: 'Lấy danh sách chuyến giao hàng thành công',
//       pagination: {
//         total: count,
//         totalPages: Math.ceil(count / limitInt),
//         currentPage: parseInt(page),
//         limit: limitInt
//       },
//       data: formattedTrips
//     });

//   } catch (error) {
//     console.error('❌ Lỗi khi lấy danh sách chuyến giao hàng:', error);
//     res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
//   }
// };

// // ==========================
// // 2. GET CHUYẾN GIAO HÀNG BY ID
// // ==========================
// exports.getChuyenGiaoHangById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const chuyenGiao = await ChuyenGiaoHang.findOne({
//       where: { DeliveryID: id },
//       include: [
//         { model: TaiXe, as: 'taiXe', attributes: ['DriverID', 'Ho_ten', 'Rating'] },
//         { model: DonHang, as: 'donHangs', attributes: ['Ma_don_hang', 'quang_duong', 'Trang_thai_don'] }
//       ]
//     });

//     if (!chuyenGiao) {
//       return res.status(404).json({ success: false, message: `Không tìm thấy chuyến giao hàng với mã ${id}` });
//     }

//     const tongQuangDuong = chuyenGiao.donHangs.reduce((total, donHang) => total + (parseFloat(donHang.quang_duong) || 0), 0);

//     res.status(200).json({
//       success: true,
//       message: 'Lấy thông tin chuyến giao hàng thành công',
//       data: { ...chuyenGiao.toJSON(), tong_quang_duong_tinh_toan: tongQuangDuong.toFixed(2) }
//     });

//   } catch (error) {
//     console.error('❌ Lỗi khi lấy thông tin chuyến giao hàng:', error);
//     res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
//   }
// };

// // ==========================
// // 3. CREATE CHUYẾN GIAO HÀNG
// // ==========================
// exports.createChuyenGiaoHang = async (req, res) => {
//   try {
//     const { DriverID } = req.body;
//     if (!DriverID) return res.status(400).json({ success: false, message: 'Thiếu thông tin: DriverID' });

//     const last = await ChuyenGiaoHang.findOne({ order: [['DeliveryID', 'DESC']], attributes: ['DeliveryID'] });
//     const newDeliveryID = last ? `CGH${String(parseInt(last.DeliveryID.replace('CGH', '')) + 1).padStart(3, '0')}` : 'CGH001';

//     const newTrip = await ChuyenGiaoHang.create({ DeliveryID: newDeliveryID, DriverID, TrangThaiChuyen: 'Đang thực hiện' });

//     res.status(201).json({ success: true, message: 'Tạo chuyến giao hàng thành công', data: newTrip });

//   } catch (error) {
//     console.error('❌ Lỗi tạo chuyến:', error);
//     res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
//   }
// };

// // ==========================
// // 4. ADD ĐƠN HÀNG VÀO CHUYẾN
// // ==========================
// exports.addDonHangToChuyenGiao = async (req, res) => { /* giữ nguyên logic cũ */ }

// // ==========================
// // 5. UPDATE CHUYẾN GIAO HÀNG
// // ==========================
// exports.updateChuyenGiaoHang = async (req, res) => { /* giữ nguyên logic cũ */ }

// // ==========================
// // 6. TÍNH TỔNG QUÃNG ĐƯỜNG
// // ==========================
// exports.calculateTotalDistance = async (req, res) => { /* giữ nguyên logic cũ */ }
