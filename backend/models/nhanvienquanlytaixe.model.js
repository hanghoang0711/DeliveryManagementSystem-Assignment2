module.exports = (sequelize, DataTypes) => {
  const NhanVienQuanLyTaiXe = sequelize.define("NHAN_VIEN_QUAN_LY_TAI_XE", {
    Ma_nhan_vien: { type: DataTypes.STRING(10), primaryKey: true },
    So_luong_tai_xe_dang_phu_trach: { type: DataTypes.INTEGER, defaultValue: 0 }
  });

  return NhanVienQuanLyTaiXe; // <--- trả về model
};
