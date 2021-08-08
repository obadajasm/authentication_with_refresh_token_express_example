const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	dialect: 'mysql',
	host: process.env.DB_HOST,
	define: {
		underscored: true,
	},
	// query: { raw: true },
});

module.exports = sequelize;
