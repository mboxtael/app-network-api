const Router = require('koa-router');
const bcrypt = require('bcrypt');
const FB = require('../../utils/fb');
const { sign } = require('../../utils/jwt');
const { User } = require('../users/userModel');

const controller = new Router({ prefix: '/auth' });

controller.post('/', async ctx => {
  const { body } = ctx.request;
  const user = await User.findOne({
    $or: [{ username: body.username }, { email: body.username }]
  }).select('+password');

  if (user == null || !await bcrypt.compare(body.password, user.password)) {
    ctx.throw(400, 'Username or password are invalid');
  }
  ctx.status = 201;
  ctx.body = { data: { user, token: await sign(user.toJSON()) } };
});

controller.post('/facebook', async ctx => {
  const { body } = ctx.request;
  const fb = new FB(body.accessToken);

  const fbUser = await fb.me();
  const user = await User.create({
    username: fbUser.email,
    password: fbUser.id,
    email: fbUser.email,
    gender: fbUser.gender
  });
  ctx.status = 201;
  ctx.body = { data: { user, token: await sign(user.toJSON()) } };
});

module.exports = controller;
