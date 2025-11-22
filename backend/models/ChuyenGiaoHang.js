/**
 * Model: CHUYEN_GIAO_HANG (Chuyến giao hàng)
 * Ánh xạ bảng CHUYEN_GIAO_HANG trong database
 * 
 * CẬP NHẬT ERD v2:
 * - Đã XÓA: Tong_quang_duong_van_chuyen, Thu_tu_lay_hang, Thu_tu_giao_hang, VehicleID
 * - Đã THÊM: so_luong_don_gop (số đơn hàng được gộp trong chuyến)
 */

module.exports = (sequelize, DataTypes) => {
  const ChuyenGiaoHang = sequelize.define('CHUYEN_GIAO_HANG', {
    DeliveryID: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      comment: 'Mã chuyến giao hàng'
    },
    so_luong_don_gop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      },
      comment: 'Số lượng đơn hàng được gộp trong chuyến này (0 khi mới tạo)'
    },
    DriverID: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'TAI_XE',
        key: 'DriverID'
      },
      comment: 'Tài xế phụ trách chuyến'
    },
    TrangThaiChuyen: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Đang thực hiện',
      validate: {
        isIn: [[
          'Đang thực hiện',
          'Hoàn thành',
          'Đã hủy'
        ]]
      },
      comment: 'Trạng thái của chuyến giao hàng'
    }
  }, {
    tableName: 'CHUYEN_GIAO_HANG',
    timestamps: false,
    freezeTableName: true,
    comment: 'Bảng quản lý các chuyến giao hàng của tài xế'
  });

  // Associations
  ChuyenGiaoHang.associate = (models) => {
    // Một chuyến giao hàng có một tài xế
    ChuyenGiaoHang.belongsTo(models.TaiXe, {
      foreignKey: 'DriverID',
      as: 'taiXe'
    });

    // Một chuyến giao hàng có nhiều đơn hàng (qua bảng trung gian DON_HANG_DUOC_GIAO)
    ChuyenGiaoHang.belongsToMany(models.DonHang, {
      through: 'DON_HANG_DUOC_GIAO',
      foreignKey: 'DeliveryID',
      otherKey: 'Ma_don_hang',
      as: 'donHangs'
    });
  };

  return ChuyenGiaoHang;
};
