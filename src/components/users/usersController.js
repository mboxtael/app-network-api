const Router = require('koa-router');
const { User } = require('./userModel');
const { sign } = require('../../utils/jwt');

const controller = new Router({ prefix: '/users' });

controller.post('/', async ctx => {
  const user = new User(ctx.request.body);
  await user.save();
  ctx.status = 201;
  ctx.body = { data: { user, token: await sign(user.toJSON()) } };
});

module.exports = controller;
