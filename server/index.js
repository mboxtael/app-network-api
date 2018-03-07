const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
require('dotenv').config();

const app = new Koa();
app.use(bodyParser());
app.use((ctx, next) =>
  next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        data: {
          error: 'Protected resource, use Authorization header to get access'
        }
      };
    } else {
      throw err;
    }
  })
);

const { routes: usersRoutes } = require('../app/components/users');
const { routes: authRoutes } = require('../app/components/auth');
const { routes: postRoutes } = require('../app/components/posts');
const { routes: userRoutes } = require('../app/components/user');

app.use(usersRoutes);
app.use(authRoutes);
app.use(postRoutes);
app.use(userRoutes);

const server = app.listen(process.env.PORT_SERVER || 3000);

module.exports = { app, server };
