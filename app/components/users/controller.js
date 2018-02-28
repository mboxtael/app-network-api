const Router = require('koa-router');
const User = require('./user');
const { validationErrors } = require('../../utils/mongoose');

const controller = new Router({ prefix: '/users' });

controller.post('/', async ctx => {
  const user = new User(ctx.request.body);
  try {
    await user.save();
    ctx.status = 201;
    ctx.body = { data: user };
  } catch (error) {
    ctx.status = 422;
    ctx.body = { data: validationErrors(error) };
  }
});

module.exports = controller;
