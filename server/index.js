const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
require('dotenv').config();

const app = new Koa();
app.use(bodyParser());

const users = require('../app/components/users/controller');
const auth = require('../app/components/auth/authController');

app.use(users.routes());
app.use(auth.routes());

const server = app.listen(process.env.PORT || 3000);

module.exports = { app, server };
