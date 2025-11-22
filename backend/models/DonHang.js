/**
 * Model: DON_HANG
 * Ánh xạ bảng DON_HANG trong database
 */

module.exports = (sequelize, DataTypes) => {
  const DonHang = sequelize.define('DON_HANG', {
    Ma_don_hang: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false
    },
    Trang_thai_don: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Đang xử lý', // ERD v2: Trạng thái ban đầu
      validate: {
        isIn: [[
          'Đang xử lý',
          'Đang tìm tài xế',
          'Đã tìm được tài xế',
          'Đang lấy hàng',
          'Lấy hàng thành công',
          'Lấy hàng thất bại',
          'Đang giao hàng',
          'Giao hàng thành công',
          'Giao hàng thất bại',
          'Đã hoàn về kho',
          'Đã hoàn thành'
        ]]
      }
    },
    Thoi_gian_lay_hang_du_kien: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Thoi_gian_giao_hang_du_kien: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Ma_khuyen_mai_CT: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ma_khuyen_mai_KM: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ma_giam_gia: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    thoi_gian_dat_don: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    gia_tri_hang_hoa_phi_van_chuyen: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    // ===== ERD v2: 4 TRƯỜNG MỚI =====
    phi_van_chuyen_goc: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    so_tien_duoc_giam: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    phi_van_chuyen_sau_giam: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    quang_duong: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      },
      comment: 'Quãng đường vận chuyển (km)'
    },
    // ================================
    SDT_nguoi_nhan: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    ten_nguoi_nhan: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    can_nang: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    dia_chi_giao_hang: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    dia_chi_lay_hang: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    diem_tich_luy: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    phuong_thuc_giao_hang: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Ma_khach_hang: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'KHACH_HANG',
        key: 'Ma_khach_hang'
      }
    }
  }, {
    tableName: 'DON_HANG',
    timestamps: false,
    freezeTableName: true
  });

  // Associations
  DonHang.associate = (models) => {
    // Một đơn hàng thuộc về một khách hàng
    DonHang.belongsTo(models.KhachHang, {
      foreignKey: 'Ma_khach_hang',
      as: 'khachHang'
    });

    // Một đơn hàng có thể có nhiều chuyến giao hàng (qua bảng trung gian)
    DonHang.belongsToMany(models.ChuyenGiaoHang, {
      through: 'DON_HANG_DUOC_GIAO',
      foreignKey: 'Ma_don_hang',
      otherKey: 'DeliveryID',
      as: 'chuyenGiaoHangs'
    });
  };

  return DonHang;
};
