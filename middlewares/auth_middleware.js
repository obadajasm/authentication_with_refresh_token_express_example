const passport = require('passport');
const express = require('express');

const { ExtractJwt, Strategy } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../model/user');

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromHeader('authorization');
opts.secretOrKey = 'hhh';
exports.jwtPassportMiddleware = passport.use(
	new Strategy(opts, async function (payload, done) {
		try {
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
