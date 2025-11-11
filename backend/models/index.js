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

// Nếu có model khác: db.Employee = require('./employee.model.js')(sequelize, Sequelize);

module.exports = db;
