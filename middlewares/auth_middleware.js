const passport = require('passport');

const { ExtractJwt, Strategy } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../model/user');
const { TokensBlacklist } = require('../model/blacklist_tokens');

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACC_TOKEN_SEC;
exports.jwtPassportMiddleware = passport.use(
	new Strategy(opts, async function (payload, done) {
		try {
			///check if the access token black listed

			const isBlackListed = await TokensBlacklist.findOne({
				where: {
					user_id: payload.id,
					///re sign the payload to get the original access token
					token: jwt.sign(payload, process.env.ACC_TOKEN_SEC),
				},
			});

			if (isBlackListed) {
				return done(null, false, { message: 'Invalid user.' });
			}

			const user = await User.findOne({ where: { id: payload.id } });
			if (!user) {
				return done(null, false, { message: 'Error.' });
			}

			return done(null, user);
		} catch (error) {
			return done(error, false, { message: error });
		}
	}),
);
exports.loaclPassportMiddleware = passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async function (email, password, done) {
			try {
				const user = await User.findOne({ where: { email: email } });
				if (!user) {
					return done(null, false, { message: 'Wrnog email or password.' });
				}
				if (!user.isUserPasswordValid(password)) {
					return done(null, false, { message: 'Wrnog email or password.' });
				}
				return done(null, user);
			} catch (error) {
				return done(null, false, { message: 'error' });
			}
		},
	),
);
