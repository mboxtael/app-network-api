const Router = require('koa-router');
const bcrypt = require('bcrypt');
const { sign } = require('../../utils/jwt');
const User = require('../users/user');

const controller = new Router({ prefix: '/auth' });

controller.post('/', async ctx => {
  const { body } = ctx.request;
  try {
    const user = await User.findOne({
      $or: [{ username: body.username }, { email: body.username }]
    }).select('+password');
    
    if (!await bcrypt.compare(body.password, user.password)) {
      throw new Error('Username or password are invalid'); 
    }

    ctx.status = 201;
    ctx.body = { data: { token: await sign(user.toJSON()) } };
  } catch (error) {
    console.log(error)
    ctx.status = 500;
  }
});

module.exports = controller;
