/**
 * Model: KHACH_HANG
 * Ánh xạ bảng KHACH_HANG trong database
 */

module.exports = (sequelize, DataTypes) => {
  const KhachHang = sequelize.define('KHACH_HANG', {
    Ma_khach_hang: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    Diem_thanh_vien: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    Ten_hang: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Ngay_len_hang: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Ngay_het_han: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'KHACH_HANG',
    timestamps: false, // Không dùng createdAt, updatedAt của Sequelize
    freezeTableName: true // Giữ nguyên tên bảng (không pluralize)
  });

  return KhachHang;
};
