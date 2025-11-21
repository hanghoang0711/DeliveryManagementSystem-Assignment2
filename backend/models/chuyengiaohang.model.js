module.exports = (sequelize, DataTypes) => {
  const ChuyenGiaoHang = sequelize.define("CHUYEN_GIAO_HANG", {
    DeliveryID: { 
      type: DataTypes.STRING(10), 
      primaryKey: true 
    },

    
    so_luong_don_gop: { 
      type: DataTypes.INTEGER, 
      defaultValue: 1,
      validate: { min: 1 }
    },

    
    DriverID: { 
      type: DataTypes.STRING(10), 
      allowNull: true 
    },

    TrangThaiChuyen: {
      type: DataTypes.STRING(50),
      defaultValue: "Đang thực hiện"
    }

  }, {
    tableName: "CHUYEN_GIAO_HANG",
    timestamps: false
  });

  return ChuyenGiaoHang;
};
