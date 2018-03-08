const Router = require('koa-router');
const { User } = require('../users');
const { authenticate } = require('../../utils/jwt');

const controller = new Router({ prefix: '/user' });
controller.use(authenticate);

controller.post('/posts/favorites', async ctx => {
  const { body } = ctx.request;

  try {
    const user = await User.likePost(ctx.state.user._id, body.postId);

    ctx.status = 201;
    ctx.body = { data: { posts: user.likedPosts } };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { data: { error: error.message } };
  }
});

controller.delete('/posts/favorites/:id', async ctx => {
  const { id } = ctx.params;

  try {
    const user = await User.removeLikedPost(ctx.state.user._id, id);

    ctx.status = 200;
    ctx.body = { data: { posts: user.likedPosts } };
  } catch (error) {
    ctx.status = 400;
    ctx.error = { error: error.message };
  }
});

module.exports = controller;
