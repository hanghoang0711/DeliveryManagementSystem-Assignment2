module.exports = (sequelize, DataTypes) => {
  const TaiXe = sequelize.define("TAI_XE", {
    DriverID: { type: DataTypes.STRING(10), primaryKey: true },
    Ho_ten: { type: DataTypes.STRING(100), allowNull: false },
    CCCD: { type: DataTypes.STRING(12), allowNull: false, unique: true },
    Gioi_Tinh: { 
      type: DataTypes.STRING(10),
      validate: { isIn: [['Nam','Nữ','Khác']] }
    },
    Ngay_Sinh: { 
      type: DataTypes.DATE,
      allowNull: false,
      validate: { 
        isOldEnough(value) { 
          if ((new Date().getFullYear() - value.getFullYear()) < 18) {
            throw new Error("Tuổi phải ≥ 18");
          }
        }
      }
    },
    Ngay_Bat_Dau_Lam_Viec: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        afterBirth(value) {
          if (this.Ngay_Sinh && value <= this.Ngay_Sinh) {
            throw new Error("Ngày bắt đầu làm việc phải sau ngày sinh");
          }
        }
      }
    },
    Rating: { type: DataTypes.DECIMAL(2,1), defaultValue: 5.0 },
    Ma_Nhan_Vien_quan_li: { type: DataTypes.STRING(10), allowNull: false },
    Trang_Thai: { type: DataTypes.STRING, defaultValue: 'Sẵn sàng', allowNull: false },
    Ngay_Bat_Dau_Quan_Ly: { type: DataTypes.DATE, allowNull: false }
  });

  return TaiXe; // <--- phải return model
};
