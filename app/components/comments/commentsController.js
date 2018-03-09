const Router = require('koa-router');
const { authenticate } = require('../../utils/jwt');
const { Post } = require('../posts');

const controller = new Router({ prefix: '/posts/:postId/comments' });

controller.get('/', async ctx => {
  const { postId } = ctx.params;

  try {
    const { comments } = await Post.find(postId);

    ctx.status = 200;
    ctx.body = { data: { comments } };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: error.message };
  }
});

controller.post('/', authenticate, async ctx => {
  const { postId } = ctx.params;
  const { body } = ctx.request;
  try {
    const comment = await Post.addComment(postId, { body: body.body });

    ctx.status = 201;
    ctx.body = { data: { comment } };
  } catch (error) {
    ctx.status = 422;
    ctx.body = { error: error.message };
  }
});

module.exports = controller;
