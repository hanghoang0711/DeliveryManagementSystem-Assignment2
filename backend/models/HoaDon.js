/**
 * Model: HOA_DON
 * Ánh xạ bảng HOA_DON trong database
 */

module.exports = (sequelize, DataTypes) => {
  const HoaDon = sequelize.define('HOA_DON', {
    Ma_hoa_don: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false
    },
    Ma_thanh_toan: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ma_don_hang: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      references: {
        model: 'DON_HANG',
        key: 'Ma_don_hang'
      }
    },
    So_tien_goc: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    so_tien_sau_khi_giam: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    thoi_gian_tao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'HOA_DON',
    timestamps: false,
    freezeTableName: true
  });

  return HoaDon;
};
