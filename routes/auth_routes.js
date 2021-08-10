const authController = require('../controllers/auth');

const express = require('express');
const passport = require('passport');

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
