module.exports = (sequelize, DataTypes) => {
  const TaiXeSDT = sequelize.define("TAI_XE_SDT", {
    DriverID: { type: DataTypes.STRING(10), allowNull: false },
    SDT: { type: DataTypes.STRING(10), allowNull: false }
  }, {
    tableName: "TAI_XE_SDT",
    timestamps: false,
    indexes: [
      { unique: true, fields: ['DriverID', 'SDT'] } // composite PK
    ]
  });

  return TaiXeSDT; // <--- phải return model
};
