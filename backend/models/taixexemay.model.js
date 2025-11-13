module.exports = (sequelize, DataTypes) => {
  const TaiXeXeMay = sequelize.define("TAI_XE_XE_MAY", {
    DriverID: { type: DataTypes.STRING(10), primaryKey: true },
    Bang_lai_A_A1: { type: DataTypes.STRING(50), allowNull: false },
    Bien_ban_hoat_dong: { type: DataTypes.STRING(100) },
    Loai_hang_chuyen_cho: { type: DataTypes.STRING(100) }
  });

  return TaiXeXeMay; // <--- bắt buộc phải return model
};
