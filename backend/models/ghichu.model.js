module.exports = (sequelize, DataTypes) => {
  const GhiChuQuanLyTaiXe = sequelize.define("GHI_CHU_QUAN_LY_TAI_XE", {
    Ma_tai_xe: { type: DataTypes.STRING, allowNull: false },
    Thoi_gian: { type: DataTypes.DATE, allowNull: false },
    Noi_dung: { type: DataTypes.TEXT, allowNull: false } // Changed to TEXT, remove from unique index
  }, {
    tableName: "GHI_CHU_QUAN_LY_TAI_XE",
    timestamps: false,
    indexes: [
      { unique: true, fields: ['Ma_tai_xe', 'Thoi_gian'] } // Remove Noi_dung from unique index (TEXT can't be in unique index)
    ]
  });

  return GhiChuQuanLyTaiXe; // trả về model
};
