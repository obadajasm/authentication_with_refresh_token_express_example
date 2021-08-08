const { User } = require('../model/user');
const jwt = require('jsonwebtoken');

const validator = require('validator');

exports.signup = async (req, res) => {
	if (!req.body || !req.body.email || !req.body.password) {
		return res.status(401).json('email and password are required');
	}

	if (!validator.isEmail(req.body.email)) {
		return res.status(401).json('Invalid email');
	}
	if (req.body.password.toString().length <= 5) {
		return res.status(401).json('Password is too short, 6 or more');
	}
	let isEx = await User.findOne({ where: { email: req.body.email } });

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
	try {
		if (req.body || req.body.refresh_token) {
			const refresh_token = req.body.refresh_token;
			try {
				var decoded = jwt.verify(refresh_token, 'refhhh');

				req.body.email = decoded.email;
			} catch (err) {
				console.log(err);
				// err
			}
		} else if (!req.body.email || !req.body.password) {
			return res.status(401).json('email or password');
		}

		const tempUser = await User.findOne({
			where: {
				email: req.body.email,
			},
		});
		if (!tempUser) {
			return res.status(401).json('didnt find');
		}
		let ispasswordMatch = false;
		if (req.body.password) {
			ispasswordMatch = await tempUser.isUserPasswordValid(req.body.password);
		} else if (req.body.refresh_token) {
			ispasswordMatch = true;
		}
		if (ispasswordMatch) {
			return res.status(200).json({
				user: tempUser.toJSON(true),
				access_token: tempUser.generateAccessToekn(),
				refresh_token: tempUser.generateRefreshToekn(),
			});
		}
		return res.status(401).json('sorry');
	} catch (error) {
		return res.status(401).json(error);
	}
};
