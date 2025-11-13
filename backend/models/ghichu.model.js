module.exports = (sequelize, DataTypes) => {
  const GhiChuQuanLyTaiXe = sequelize.define("GHI_CHU_QUAN_LY_TAI_XE", {
    Ma_tai_xe: { type: DataTypes.STRING, allowNull: false },
    Thoi_gian: { type: DataTypes.DATE, allowNull: false },
    Noi_dung: { type: DataTypes.STRING(500), allowNull: false }
  }, {
    tableName: "GHI_CHU_QUAN_LY_TAI_XE",
    timestamps: false,
    indexes: [
      { unique: true, fields: ['Ma_tai_xe', 'Thoi_gian', 'Noi_dung'] } // composite PK
    ]
  });

  return GhiChuQuanLyTaiXe; // trả về model
};
