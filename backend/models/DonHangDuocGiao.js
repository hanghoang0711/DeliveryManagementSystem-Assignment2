/**
 * Model: DON_HANG_DUOC_GIAO (Bảng trung gian M-N)
 * Ánh xạ bảng DON_HANG_DUOC_GIAO trong database
 * 
 * CẬP NHẬT ERD v2:
 * - Đã THÊM: Thoi_diem_gop_don, Thu_tu_lay_hang, Thu_tu_giao_hang
 * - Giữ lại ThuTuGiao để backward compatible
 */

module.exports = (sequelize, DataTypes) => {
  const DonHangDuocGiao = sequelize.define('DON_HANG_DUOC_GIAO', {
    DeliveryID: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'CHUYEN_GIAO_HANG',
        key: 'DeliveryID'
      },
      comment: 'Mã chuyến giao hàng'
    },
    Ma_don_hang: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'DON_HANG',
        key: 'Ma_don_hang'
      },
      comment: 'Mã đơn hàng'
    },
    Thoi_gian_giao_hang_thuc_te: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Thời gian giao hàng thực tế cho khách'
    },
    Thoi_gian_lay_hang_thuc_te: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Thời gian lấy hàng thực tế từ kho/người gửi'
    },
    // ===== 3 TRƯỜNG MỚI (ERD v2) =====
    Thoi_diem_gop_don: {
      type: DataTypes.DATE,
      allowNull: false,
      // FIX: Xóa defaultValue: DataTypes.NOW để tránh timezone format issue
      // Controller sẽ cung cấp giá trị explicit: new Date()
      validate: {
        // Thời điểm gộp đơn phải <= thời gian lấy hàng
        isBeforePickup(value) {
          if (this.Thoi_gian_lay_hang_thuc_te && value > this.Thoi_gian_lay_hang_thuc_te) {
            throw new Error('Thời điểm gộp đơn phải trước hoặc bằng thời gian lấy hàng thực tế');
          }
        }
      },
      comment: 'Thời điểm đơn hàng được gộp vào chuyến giao hàng'
    },
    Thu_tu_lay_hang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      },
      comment: 'Thứ tự lấy hàng trong chuyến (1, 2, 3, ...) - Chuyển từ CHUYEN_GIAO_HANG'
    },
    Thu_tu_giao_hang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      },
      comment: 'Thứ tự giao hàng trong chuyến (1, 2, 3, ...) - Chuyển từ CHUYEN_GIAO_HANG'
    },
    // ===== KẾT THÚC TRƯỜNG MỚI =====
    ThuTuGiao: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Giữ lại để backward compatible (có thể xóa sau)'
    }
  }, {
    tableName: 'DON_HANG_DUOC_GIAO',
    timestamps: false,
    freezeTableName: true,
    validate: {
      // Validation: Thời gian giao phải >= thời gian lấy
      deliveryAfterPickup() {
        if (this.Thoi_gian_giao_hang_thuc_te && 
            this.Thoi_gian_lay_hang_thuc_te &&
            this.Thoi_gian_giao_hang_thuc_te < this.Thoi_gian_lay_hang_thuc_te) {
          throw new Error('Thời gian giao hàng phải sau hoặc bằng thời gian lấy hàng');
        }
      }
    },
    comment: 'Bảng trung gian: Đơn hàng được giao trong chuyến nào, thứ tự lấy/giao'
  });

  // Associations
  DonHangDuocGiao.associate = (models) => {
    // Thuộc về một chuyến giao hàng
    DonHangDuocGiao.belongsTo(models.CHUYEN_GIAO_HANG, {
      foreignKey: 'DeliveryID',
      as: 'chuyenGiaoHang'
    });

    // Thuộc về một đơn hàng
    DonHangDuocGiao.belongsTo(models.DON_HANG, {
      foreignKey: 'Ma_don_hang',
      as: 'donHang'
    });
  };

  return DonHangDuocGiao;
};
