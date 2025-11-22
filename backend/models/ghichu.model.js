module.exports = (sequelize, DataTypes) => {
  const GhiChuQuanLyTaiXe = sequelize.define("GHI_CHU_QUAN_LY_TAI_XE", {
    Ma_tai_xe: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
    Thoi_gian: { type: DataTypes.DATE, primaryKey: true, allowNull: false },
    Noi_dung: { type: DataTypes.TEXT, allowNull: false }
  }, {
    tableName: "GHI_CHU_QUAN_LY_TAI_XE",
    timestamps: false,
    freezeTableName: true
  });

  return GhiChuQuanLyTaiXe;
};
