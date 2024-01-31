import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import passport from 'passport';
import sessionConfig from './config/session.config.js';

import { init as initPassport } from './config/passport.config olld.js';


import indexRouter from './routers/views/index.router.js';
import usersRouter from './routers/api/users.router.js';
import authRouter from './routers/api/auth.router.js';
import productsRouter from './routers/api/products.router.js';
import notificationsRouter from './routers/api/notifications.router.js';

import { __dirname } from './utils.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(sessionConfig);

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/notifications', notificationsRouter);
// app.use('/api/orders', ordersRouter);

app.use((error, req, res, next) => {
  const message = `Ha ocurrido un error desconocido 😨: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: 'error', message });
});

export default app;
