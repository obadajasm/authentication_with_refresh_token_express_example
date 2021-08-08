const Sequelize = require('sequelize');
const UserProduct = require('./user_product').UserProduct;

const sequelize = require('../util/database');

const Product = sequelize.define('Product', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	title: Sequelize.STRING,
	category: Sequelize.STRING,
});

Product.associations = (models) => {
	Product.belongsToMany(models.User, { through: UserProduct });
};

const addProduct = async (product) => {
	const prod = await Product.create({
		title: product.title,
		category: product.category,
	});

	const result = await UserProduct.create({
		ProductId: prod.id,
		UserId: 1,
	});

	return result;
};

module.exports = { Product, addProduct };
