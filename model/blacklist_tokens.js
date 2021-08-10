const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const TokensBlacklist = sequelize.define('tokensBlacklist', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	token: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

module.exports = { TokensBlacklist };
