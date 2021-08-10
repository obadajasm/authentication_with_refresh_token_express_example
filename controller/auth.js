const { User } = require('../model/user');
const { TokensBlacklist } = require('../model/blacklist_tokens');
const jwt = require('jsonwebtoken');

const cron = require('node-cron');
const moment = require('moment');

const validator = require('validator');
const { Op, Sequelize } = require('sequelize');

exports.signup = async (req, res) => {
	if (!req.body || !req.body.email || !req.body.password) {
		return res.status(400).json('Email and password are required');
	}

	if (!validator.isEmail(req.body.email)) {
		return res.status(400).json('Invalid email');
	}
	if (req.body.password.toString().length <= 5) {
		return res.status(400).json('Password is too short, 6 or more');
	}
	const isEx = await User.findOne({ where: { email: req.body.email } });

	if (isEx) {
		return res.status(401).json('use another email');
	}
	try {
		let user = await User.create({
			email: req.body.email,
			password: req.body.password,
		});
		return res.status(200).json({
			user: user.toJSON(true),
			access_token: user.generateAccessToekn(),
			refresh_token: user.generateRefreshToekn(),
		});
	} catch (error) {
		return res.json(error);
	}
	// const userAA = user.toJSON();
};

exports.login = async (req, res, next) => {
	if (!req.body || !req.body.email || !req.body.password) {
		return res.status(401).json('missing email or password');
	}
	try {
		const tempUser = await User.findOne({
			where: {
				email: req.body.email,
			},
		});
		if (!tempUser) {
			return res.status(401).json('didnt find');
		}

		const ispasswordMatch = await tempUser.isUserPasswordValid(req.body.password);
		if (ispasswordMatch) {
			return res.status(200).json({
				user: tempUser.toJSON(true),
				access_token: tempUser.generateAccessToekn(),
				refresh_token: tempUser.generateRefreshToekn(),
			});
		}
		return res.status(401).json();
	} catch (error) {
		return res.status(500).json(error);
	}
};

exports.refreshToken = async (req, res, next) => {
	console.log('sss');
	if (!req.body || !req.body.refresh_token) {
		return res.status(400).json('Refresh token is requeired');
	}
	const refresh_token = req.body.refresh_token;
	try {
		var decoded = jwt.verify(refresh_token, process.env.REF_TOKEN_SEC);
		req.body.id = decoded.id;
	} catch (err) {
		console.log(err);
		return res.status(400).json('Invalid Refresh token');
	}

	try {
		const tempUser = await User.findOne({
			where: {
				id: req.body.id,
			},
		});
		if (!tempUser) {
			return res.status(401).json('didnt find the user');
		}

		return res.status(200).json({
			user: tempUser.toJSON(true),
			access_token: tempUser.generateAccessToekn(),
			refresh_token: tempUser.generateRefreshToekn(),
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};

exports.logout = async (req, res, next) => {
	try {
		if (!req.body || !req.headers.authorization) {
			return res.status(400);
		}

		const tempUser = await User.findOne({
			where: {
				id: req.user.id,
			},
		});
		if (!tempUser) {
			return res.status(500).json();
		}
		req.user.createTokensBlacklist({
			token: req.headers.authorization.toString().split(' ')[1],
		});
		return res.status(200).json('done');
	} catch (error) {
		return res.status(500).json(error);
	}
};

cron.schedule('0 0 0 * * *', async () => {
	///24 cron to remove expired token TokensBlacklist
	/// 7 days to the refresh token to be expired not the access token

	try {
		await TokensBlacklist.destroy({
			where: {
				createdAt: {
					[Op.lte]: moment().subtract(8, 'days').toDate(),
				},
			},
		});
	} catch (error) {
		console.log(error);
	}
});
