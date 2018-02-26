const Router = require('koa-router');
const User = require('./model');
const { validationErrors } = require('../../utils/mongoose');

const controller = new Router({ prefix: '/users' });

controller.post('/', async ctx => {
  const user = new User(ctx.request.body);

  try {
    ctx.body = await user.save();
  } catch (error) {
    ctx.status = 422;
    ctx.body = validationErrors(error);
  }
});

module.exports =  controller;