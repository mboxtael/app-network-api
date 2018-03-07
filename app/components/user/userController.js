const Router = require('koa-router');
const User = require('../users');
const { authenticate } = require('../../utils/jwt');

const controller = new Router({ prefix: '/user' });
controller.use(authenticate);

controller.post('/posts/favorites', async ctx => {
  const { body } = ctx.request;
  try {
    await User.likePost(ctx.state.user._id, body.postId);

    ctx.status = 201;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { data: { error: error.message } };
  }
});

module.exports = controller;
