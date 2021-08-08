const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('zoo_system', 'root', '', {
	dialect: 'mysql',
	host: 'localhost',
	define: {
		underscored: true,
	},
	// query: { raw: true },
});

module.exports = sequelize;
