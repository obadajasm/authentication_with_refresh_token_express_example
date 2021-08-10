require('dotenv').config();

const express = require('express');
const sequelize = require('./utils/database');
const passport = require('passport');

const { User } = require('./models/user');
const { TokensBlacklist } = require('./models/blacklist_tokens');
const authRoutes = require('./routes/auth_routes');
const PassportMiddleware = require('./middlewares/auth_middleware');

const app = express();

app.use(passport.initialize());
app.use(express.json());

///set up the middlewares
PassportMiddleware.jwtPassportMiddleware;
PassportMiddleware.loaclPassportMiddleware;

///auth routes MUST come first
app.use('/auth', authRoutes);

///then JWT middleware
app.use('/', passport.authenticate('jwt', { session: false }));

////define your protected routes

app.get('/hello', (req, res) => {
	res.json({
		hello: req.user.email,
		user: req.user.toJSON(true),
	});
});
///define the associations
User.associations({ TokensBlacklist });

sequelize
	// .sync({ force: true })
	.sync()
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
