const Router = require('koa-router');
const { authenticate } = require('../../utils/jwt');
const { Post } = require('../posts');

const controller = new Router({ prefix: '/posts/:postId/comments' });

controller.post('/', authenticate, async ctx => {
  const { postId } = ctx.params;
  const { body } = ctx.request;
  const comment = await Post.addComment(postId, {
    body: body.body,
    user: ctx.state.user._id
  });
  ctx.status = 201;
  ctx.body = { data: { comment } };
});

module.exports = controller;
