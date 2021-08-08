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

app.use('/auth', authRoutes);
app.use('/', passport.authenticate('jwt', { session: false }));

User.associations({ Product });
Product.associations({ User });

sequelize
	.sync({ force: true })
	// .sync()
	.then((result) => {
		return User.findByPk(1);
		// console.log(result);
	})
	.then((user) => {
		if (!user) {
			return User.create({ name: 'Max', email: 'test@test.com', password: 'asdasdasd' });
		}
		return user;
	})
	.then((user) => {
		// console.log(user);

		// console.log(user);
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
