module.exports = (sequelize, DataTypes) => {
  const TaiXeXeTai = sequelize.define("TAI_XE_XE_TAI", {
    DriverID: { type: DataTypes.STRING(10), primaryKey: true },
    Bang_lai_B_B1_C: { type: DataTypes.STRING(50), allowNull: false },
    Suc_chua_toi_da: { type: DataTypes.DECIMAL(10,2) },
    Kinh_nghiem_van_chuyen: { type: DataTypes.STRING (255)}
  });

  return TaiXeXeTai;
};
