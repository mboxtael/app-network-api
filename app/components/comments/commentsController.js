const Router = require('koa-router');
const { authenticate } = require('../../utils/jwt');
const { Post } = require('../posts');

const controller = new Router({ prefix: '/posts/:postId/comments' });

controller.post('/', authenticate, async ctx => {
  const { postId } = ctx.params;
  const { body } = ctx.request;
  try {
    const comment = await Post.addComment(postId, {
      body: body.body,
      user: ctx.state.user._id
    });

    ctx.status = 201;
    ctx.body = { data: { comment } };
  } catch (error) {
    ctx.status = 422;
    ctx.body = { error: error.message };
  }
});

module.exports = controller;
