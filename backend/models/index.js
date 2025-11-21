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
db.ChuyenGiaoHang = require('./chuyengiaohang.model.js')(sequelize, Sequelize);
// ============================================
// IMPORT MODELS - (ORDER DOMAIN)
// ============================================
db.KhachHang = require('./KhachHang.js')(sequelize, Sequelize);
db.DonHang = require('./DonHang.js')(sequelize, Sequelize);
db.HoaDon = require('./HoaDon.js')(sequelize, Sequelize);

// ============================================
// ASSOCIATIONS - (DRIVER DOMAIN)
// ============================================
// Comment out NhanVien associations - causing SequelizeDatabaseError
// db.NhanVienQuanLyTaiXe.belongsTo(db.NhanVien, { foreignKey: "Ma_nhan_vien" });
// db.NhanVien.hasOne(db.NhanVienQuanLyTaiXe, { foreignKey: "Ma_nhan_vien" });

db.TaiXe.belongsTo(db.NhanVienQuanLyTaiXe, {foreignKey: "Ma_Nhan_Vien_quan_li",});
db.NhanVienQuanLyTaiXe.hasMany(db.TaiXe, {
    foreignKey: "Ma_Nhan_Vien_quan_li",
});

db.TaiXe.hasOne(db.TaiXeXeMay, {
    foreignKey: "DriverID",
    onDelete: "CASCADE",  // xóa tài xế thì xóa luôn hồ sơ xe gắn liền
});
db.TaiXeXeMay.belongsTo(db.TaiXe, { foreignKey: "DriverID" });

db.TaiXe.hasOne(db.TaiXeXeTai, {
    foreignKey: "DriverID",
    onDelete: "CASCADE",
});
db.TaiXeXeTai.belongsTo(db.TaiXe, { foreignKey: "DriverID" });

db.TaiXe.hasMany(db.TaiXeSDT, {
    foreignKey: "DriverID",
    onDelete: "CASCADE",  // xóa tài xế xoá các số điện thoại
});
db.TaiXeSDT.belongsTo(db.TaiXe, { foreignKey: "DriverID" });

db.TaiXe.hasMany(db.GhiChuQuanLyTaiXe, {
    foreignKey: "Ma_tai_xe",
    onDelete: "CASCADE",
});
db.GhiChuQuanLyTaiXe.belongsTo(db.TaiXe, { foreignKey: "Ma_tai_xe" });

db.Mentorship.belongsTo(db.TaiXe, {
    as: "Mentor",
    foreignKey: "MentorID",
 
});

db.Mentorship.belongsTo(db.TaiXe, {
    as: "Mentee",
    foreignKey: "MenteeID",
  
});

db.TaiXe.hasMany(db.Mentorship, {
    as: "MentorRecords",
    foreignKey: "MentorID"
});

db.TaiXe.hasMany(db.Mentorship, {
    as: "MenteeRecords",
    foreignKey: "MenteeID"
});

db.ChuyenGiaoHang.belongsTo(db.TaiXe, {
    foreignKey: "DriverID",
    onDelete: "SET NULL", 
   
});
db.TaiXe.hasMany(db.ChuyenGiaoHang, { foreignKey: "DriverID" });


// ============================================
// ASSOCIATIONS (ORDER DOMAIN)
// ============================================
db.DonHang.belongsTo(db.KhachHang, {
  foreignKey: 'Ma_khach_hang',
  as: 'khachHang'
});

db.KhachHang.hasMany(db.DonHang, {
  foreignKey: 'Ma_khach_hang',
  as: 'donHangs'
});

db.DonHang.hasOne(db.HoaDon, {
  foreignKey: 'Ma_don_hang',
  as: 'hoaDon'
});

db.HoaDon.belongsTo(db.DonHang, {
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
