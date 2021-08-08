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
		console.log(err, 'failed');
		if (req.body && req.body.refresh_token) {
			return authController.login(req, res, next);
		}
		return res.status(401).send({ message: err });
	},
);
module.exports = router;
