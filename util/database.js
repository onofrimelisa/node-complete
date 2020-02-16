const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-server', 'root', '', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
