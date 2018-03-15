const Router = require('koa-router');
const { User } = require('../users');
const { authenticate } = require('../../utils/jwt');

const controller = new Router({ prefix: '/user' });
controller.use(authenticate);

controller.post('/posts/favorites', async ctx => {
  const { body } = ctx.request;
  const user = await User.likePost(ctx.state.user._id, body.postId);
  ctx.status = 201;
  ctx.body = { data: { posts: user.likedPosts } };
});

controller.delete('/posts/favorites/:id', async ctx => {
  const { id } = ctx.params;
  const user = await User.removeLikedPost(ctx.state.user._id, id);
  ctx.status = 200;
  ctx.body = { data: { posts: user.likedPosts } };
});

module.exports = controller;
