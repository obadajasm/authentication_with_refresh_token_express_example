const express = require('express');
const passport = require('passport');
const loaclPassportMiddleware = require('../middlewares/auth_middleware').loaclPassportMiddleware;

const authController = require('../controller/auth');

const router = express.Router();

router.post('/signup', authController.signup);
router.post(
	'/login',
	passport.authenticate('local', { failWithError: true, session: false }),
	authController.login,
	function (err, req, res, next) {
		///custom erroe msg
		return res.status(401).send({ message: err });
	},
);
router.post(
	'/refresh',
	passport.authenticate('jwt', { session: false }),
	authController.refreshToken,
);

router.post('/logout', passport.authenticate('jwt', { session: false }), authController.logout);

module.exports = router;
