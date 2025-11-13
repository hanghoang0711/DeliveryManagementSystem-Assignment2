module.exports = (sequelize, DataTypes) => {
  const NhanVien = sequelize.define("NHANVIEN", {
    Ma_nhan_vien: { type: DataTypes.STRING(10), primaryKey: true },
    Gioi_tinh: {
      type: DataTypes.STRING(10),
      validate: {
        isIn: [["Nam", "Nữ", "Khác"]],
      },
    },
    Ho_va_ten_lot: { type: DataTypes.STRING(50), allowNull: false },
    Ten: { type: DataTypes.STRING(50), allowNull: false },
    Ngay_sinh: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isOldEnough(value) {
          if (new Date().getFullYear() - new Date(value).getFullYear() < 18) {
            throw new Error("Tuổi nhân viên phải >= 18");
          }
        },
      },
    },
    Dia_chi: { type: DataTypes.STRING(255) },
    SDT: { type: DataTypes.STRING(10), unique: true },
    email: { type: DataTypes.STRING(100), unique: true },
    CCCD: { type: DataTypes.STRING(12), allowNull: false, unique: true },
    Ngay_bat_dau_lam: {
      type: DataTypes.DATE, // Lưu cả ngày + giờ
      allowNull: false,
      validate: {
        isAfterSinh(value) {
          if (this.Ngay_sinh && new Date(value) <= new Date(this.Ngay_sinh)) {
            throw new Error("Ngày bắt đầu làm phải sau ngày sinh");
          }
        },
      },
    },

    Vai_tro: { type: DataTypes.STRING(50), allowNull: false },
  });

  return NhanVien; // <--- trả về model
};
