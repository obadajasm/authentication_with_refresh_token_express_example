require('dotenv').config();

const express = require('express');
const sequelize = require('./util/database');
const passport = require('passport');

const { User } = require('./model/user');
const { Product } = require('./model/product');
const authRoutes = require('./routes/auth_routes');
const PassportMiddleware = require('./middlewares/auth_middleware');

const app = express();

app.use(passport.initialize());
app.use(express.json());

PassportMiddleware.jwtPassportMiddleware;
PassportMiddleware.loaclPassportMiddleware;

///auth routes MUST come first
app.use('/auth', authRoutes);
///then JWT middleware
app.use('/', passport.authenticate('jwt', { session: false }));
////define your routes

User.associations({ Product });
Product.associations({ User });

sequelize
	// .sync({ force: true })
	.sync()

	.then(() => {
		// console.log(user);
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
