const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  pool: dbConfig.pool,
  dialectOptions: dbConfig.dialectOptions
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import model
db.TaiXe = require('./taixe.model.js')(sequelize, Sequelize);
db.TaiXeXeMay = require('./taixexemay.model.js')(sequelize, Sequelize);
db.TaiXeXeTai = require('./taixexetai.model.js')(sequelize, Sequelize);
db.TaiXeSDT = require('./taixesdt.model.js')(sequelize, Sequelize);
db.NhanVien = require('./nhanvien.model.js')(sequelize, Sequelize);
db.NhanVienQuanLyTaiXe = require('./nhanvienquanlytaixe.model.js')(sequelize, Sequelize);
db.GhiChuQuanLyTaiXe = require('./ghichu.model.js')(sequelize, Sequelize);

// ----------------- Associations -----------------
db.NhanVienQuanLyTaiXe.belongsTo(db.NhanVien, { foreignKey: "Ma_nhan_vien" });
db.NhanVien.hasOne(db.NhanVienQuanLyTaiXe, { foreignKey: "Ma_nhan_vien" });

db.TaiXe.belongsTo(db.NhanVienQuanLyTaiXe, { foreignKey: "Ma_Nhan_Vien_quan_li" });
db.NhanVienQuanLyTaiXe.hasMany(db.TaiXe, { foreignKey: "Ma_Nhan_Vien_quan_li" });

db.TaiXe.hasOne(db.TaiXeXeMay, { foreignKey: "DriverID" });
db.TaiXeXeMay.belongsTo(db.TaiXe, { foreignKey: "DriverID" });

db.TaiXe.hasOne(db.TaiXeXeTai, { foreignKey: "DriverID" });
db.TaiXeXeTai.belongsTo(db.TaiXe, { foreignKey: "DriverID" });

db.TaiXe.hasMany(db.TaiXeSDT, { foreignKey: "DriverID" });
db.TaiXeSDT.belongsTo(db.TaiXe, { foreignKey: "DriverID" });

db.TaiXe.hasMany(db.GhiChuQuanLyTaiXe, { foreignKey: "Ma_tai_xe" });
db.GhiChuQuanLyTaiXe.belongsTo(db.TaiXe, { foreignKey: "Ma_tai_xe" });

module.exports = db;
