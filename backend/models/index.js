const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  pool: dbConfig.pool,
  dialectOptions: dbConfig.dialectOptions,
  logging: false // Tắt log SQL queries (bật khi debug)
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ============================================
// IMPORT MODELS - (DRIVER DOMAIN)
// ============================================
db.TaiXe = require('./taixe.model.js')(sequelize, Sequelize);
db.TaiXeXeMay = require('./taixexemay.model.js')(sequelize, Sequelize);
db.TaiXeXeTai = require('./taixexetai.model.js')(sequelize, Sequelize);
db.TaiXeSDT = require('./taixesdt.model.js')(sequelize, Sequelize);
db.NhanVien = require('./nhanvien.model.js')(sequelize, Sequelize);
db.NhanVienQuanLyTaiXe = require('./nhanvienquanlytaixe.model.js')(sequelize, Sequelize);
db.GhiChuQuanLyTaiXe = require('./ghichu.model.js')(sequelize, Sequelize);
db.User = require('./user.model.js')(sequelize, Sequelize);
db.Mentorship = require('./mentorship.model.js')(sequelize, Sequelize);
db.ChuyenGiaoHang = require('./ChuyenGiaoHang.js')(sequelize, Sequelize);
// ============================================
// IMPORT MODELS - (ORDER DOMAIN)
// ============================================
db.KhachHang = require('./KhachHang.js')(sequelize, Sequelize);
db.DonHang = require('./DonHang.js')(sequelize, Sequelize);
// db.HoaDon = require('./HoaDon.js')(sequelize, Sequelize); // ❌ REMOVED in ERD v2

// ============================================
// IMPORT MODELS - (DELIVERY DOMAIN - ERD v2)
// ============================================
db.DonHangDuocGiao = require('./DonHangDuocGiao.js')(sequelize, Sequelize);

// ============================================
// ASSOCIATIONS - (DRIVER DOMAIN)
// ============================================
// Comment out NhanVien associations - causing SequelizeDatabaseError
// db.NhanVienQuanLyTaiXe.belongsTo(db.NhanVien, { foreignKey: "Ma_nhan_vien" });
// db.NhanVien.hasOne(db.NhanVienQuanLyTaiXe, { foreignKey: "Ma_nhan_vien" });

db.TaiXe.belongsTo(db.NhanVienQuanLyTaiXe, { 
  foreignKey: "Ma_Nhan_Vien_quan_li",
  targetKey: "Ma_nhan_vien",
});

db.NhanVienQuanLyTaiXe.hasMany(db.TaiXe, { 
  foreignKey: "Ma_Nhan_Vien_quan_li",
  sourceKey: "Ma_nhan_vien",
});
db.TaiXe.hasOne(db.TaiXeXeMay, { 
  foreignKey: "DriverID",
  sourceKey: "DriverID",
  onDelete: "CASCADE"
});
db.TaiXeXeMay.belongsTo(db.TaiXe, { 
  foreignKey: "DriverID", 
  targetKey: "DriverID" 
});
db.TaiXe.hasMany(db.TaiXeSDT, { 
  foreignKey: "DriverID",
  sourceKey: "DriverID",
  onDelete: "CASCADE"
});
db.TaiXe.hasMany(db.GhiChuQuanLyTaiXe, { 
  foreignKey: "Ma_tai_xe",
  sourceKey: "DriverID",
  onDelete: "CASCADE"
});
db.TaiXe.hasMany(db.Mentorship, { as: "MentorRecords", foreignKey: "MentorID", sourceKey: "DriverID" });
db.TaiXe.hasMany(db.Mentorship, { as: "MenteeRecords", foreignKey: "MenteeID", sourceKey: "DriverID" });

db.TaiXe.hasMany(db.ChuyenGiaoHang, { 
  foreignKey: "DriverID",
  sourceKey: "DriverID",
  onDelete: "SET NULL"
});

// ChuyenGiaoHang associations are defined in ChuyenGiaoHang.associate() - see below

// ============================================
// ASSOCIATIONS (ORDER DOMAIN)
// ============================================
// DonHang <-> KhachHang associations are defined in DonHang.associate() - see below

db.KhachHang.hasMany(db.DonHang, {
  foreignKey: 'Ma_khach_hang',
  as: 'donHangs'
});

// ❌ REMOVED in ERD v2: DonHang <-> HoaDon associations
// db.DonHang.hasOne(db.HoaDon, { foreignKey: 'Ma_don_hang', as: 'hoaDon' });
// db.HoaDon.belongsTo(db.DonHang, { foreignKey: 'Ma_don_hang', as: 'donHang' });

// ============================================
// ASSOCIATIONS (DELIVERY DOMAIN - ERD v2)
// ============================================
// Call associate functions from models
if (db.DonHang.associate) {
  db.DonHang.associate(db);
}

if (db.ChuyenGiaoHang.associate) {
  db.ChuyenGiaoHang.associate(db);
}

// DonHangDuocGiao associations
db.DonHangDuocGiao.belongsTo(db.ChuyenGiaoHang, {
  foreignKey: 'DeliveryID',
  as: 'chuyenGiaoHang'
});

db.DonHangDuocGiao.belongsTo(db.DonHang, {
  foreignKey: 'Ma_don_hang',
  as: 'donHang'
});

// ============================================
// TEST CONNECTION
// ============================================
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');
  } catch (error) {
    console.error('❌ Không thể kết nối database:', error.message);
  }
};

testConnection();

module.exports = db;
