/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] } ] */

const fse = require('fs-extra');
const Router = require('koa-router');
const koaBody = require('koa-body');
const { Post: PostModel } = require('./postModel');
const Post = require('./postDAL');
const { authenticate } = require('../../utils/jwt');

const multipartBody = koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true
  }
});
const controller = new Router({ prefix: '/posts' });

controller.get('/', async ctx => {
  const posts = await Post.all();
  ctx.status = 200;
  ctx.body = { data: { posts } };
});

controller.get('/:id', async ctx => {
  const { id } = ctx.params;
  const post = await Post.findAndIncViews(id);
  ctx.status = 200;
  ctx.body = { data: { post } };
});

controller.post('/', authenticate, multipartBody, async ctx => {
  let { fields } = ctx.request.body;
  const { files } = ctx.request.body;
  fields = fields || {};
  const post = new PostModel({
    ...fields,
    user: ctx.state.user._id,
    tags: fields.tags && fields.tags.split(',')
  });

  if (files && files.image) {
    const { image } = files;
    post.image = `images/posts/${post._id}/${image.name}`;
    await fse.copy(image.path, `public/${post.image}`);
  }

  await post.save();
  ctx.status = 201;
  ctx.body = { data: { post } };
});

controller.put('/:id', authenticate, multipartBody, async ctx => {
  const { fields, files } = ctx.request.body;
  const { id } = ctx.params;

  let imagePath = null;
  if (files && files.image) {
    const { image } = files;
    imagePath = `images/posts/${id}/${image.name}`;
    await fse.copy(image.path, `public/${imagePath}`);
  }
  const post = await Post.findAndUpdate(id, { ...fields, image: imagePath });

  if (post == null) {
    ctx.status = 404;
    ctx.body = { error: 'Post not found' };
    return;
  }

  ctx.status = 200;
  ctx.body = { data: { post } };
});

controller.delete('/:id', authenticate, async ctx => {
  const { id } = ctx.params;
  const post = await Post.findAndRemove(id);

  if (post == null) {
    ctx.status = 404;
    ctx.body = { error: 'Post not found' };
    return;
  }

  ctx.status = 200;
  ctx.body = { message: 'Post removed sucessfully' };
});

module.exports = controller;
