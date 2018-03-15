const Router = require('koa-router');
const { User } = require('./userModel');
const { validationErrors } = require('../../utils/mongoose');
const { sign } = require('../../utils/jwt');

const controller = new Router({ prefix: '/users' });

controller.post('/', async ctx => {
  const user = new User(ctx.request.body);
  try {
    await user.save();
    ctx.status = 201;
    ctx.body = { data: { user, token: await sign(user.toJSON()) } };
  } catch (error) {
    ctx.status = 422;
    ctx.body = { data: { errors: validationErrors(error) } };
  }
});

module.exports = controller;
