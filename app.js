const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const serve = require('koa-static');
const helmet = require('koa-helmet');
const compress = require('koa-compress');
const unauthorized = require('./src/middlewares/unauthorized');
require('dotenv').config();

const app = new Koa();
app.use(compress());
app.use(bodyParser());
app.use(cors());
app.use(serve('public'));
app.use(helmet());
app.use(unauthorized());

const { routes: usersRoutes } = require('./src/components/users');
const { routes: authRoutes } = require('./src/components/auth');
const { routes: postRoutes } = require('./src/components/posts');
const { routes: userRoutes } = require('./src/components/user');
const { routes: commentsRoutes } = require('./src/components/comments');

app.use(usersRoutes);
app.use(authRoutes);
app.use(postRoutes);
app.use(userRoutes);
app.use(commentsRoutes);

module.exports = app;
