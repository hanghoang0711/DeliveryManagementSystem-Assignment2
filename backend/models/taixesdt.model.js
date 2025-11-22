module.exports = (sequelize, DataTypes) => {
  const TaiXeSDT = sequelize.define("TAI_XE_SDT", {
    DriverID: { 
      type: DataTypes.STRING(10), 
      allowNull: false, 
      primaryKey: true // phần này đánh dấu là 1 phần của composite PK
    },
    SDT: { 
      type: DataTypes.STRING(10), 
      allowNull: false, 
      primaryKey: true // phần này đánh dấu là 1 phần của composite PK
    }
  }, {
    tableName: "TAI_XE_SDT",
    timestamps: false,
    freezeTableName: true
  });

  return TaiXeSDT;
};
