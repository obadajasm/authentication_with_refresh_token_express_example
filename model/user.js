const { Sequelize, Model } = require('sequelize');
const UserProduct = require('./user_product').UserProduct;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sequelize = require('../util/database');
// const { Product } = require('./product');
const PROTECTED_ATTRIBUTES = ['password'];
class User extends Model {
	toJSON(remove) {
		let attributes = Object.assign({}, this.get());
		if (!remove) {
			return attributes;
		}
		for (let a of PROTECTED_ATTRIBUTES) {
			delete attributes[a];
		}
		return attributes;
	}
	generateAccessToekn() {
		return jwt.sign(
			{
				sub: this.id,
				id: this.id,
				email: this.email,
				iss: new Date().getTime(),
				exp: new Date().setTime(new Date().getTime() + 60 * 60 * 1000),
			},
			process.env.ACC_TOKEN_SEC,
		);
	}
	generateRefreshToekn() {
		return jwt.sign(
			{
				sub: this.id,
				id: this.id,
				email: this.email,
				iss: new Date().getTime(),
				exp: new Date().setTime(new Date().getTime() + 200 * 60 * 60 * 1000),
			},
			process.env.REF_TOKEN_SEC,
		);
	}

	async getAll() {
		const res = await User.findAll();
		return res;
	}
	async isUserPasswordValid(password) {
		return await bcrypt.compare(password, this.password);
	}
}
User.init(
	{
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		password: {
			type: Sequelize.STRING,
		},
		name: Sequelize.STRING,
		email: Sequelize.STRING,
	},
	{ sequelize },
);
User.afterCreate(async (user, options) => {
	const salt = await bcrypt.genSalt(10);
	const newPassword = await bcrypt.hash(user.password, salt);
	user.password = newPassword;
	await user.save();
});

User.associations = (models) => {
	User.belongsToMany(models.Product, { through: UserProduct });
};
module.exports = {
	User,
};
