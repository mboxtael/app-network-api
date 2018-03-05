const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
require('dotenv').config();

const app = new Koa();
app.use(bodyParser());

const { routes: userRoutes } = require('../app/components/users');
const { routes: authRoutes } = require('../app/components/auth');

app.use(userRoutes);
app.use(authRoutes);

const server = app.listen(process.env.PORT_SERVER || 3000);

module.exports = { app, server };
