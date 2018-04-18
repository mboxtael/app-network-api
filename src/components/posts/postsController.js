const fse = require('fs-extra');
const Router = require('koa-router');
const koaBody = require('koa-body');
const { Post: PostModel } = require('./postModel');
const Post = require('./postDAL');
const User = require('../users/userDAL');
const auth = require('../../middlewares/auth');

const multipartBody = koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true
  }
});
const controller = new Router({ prefix: '/posts' });

controller.get('/', auth({ optional: true }), async ctx => {
  let posts = await Post.all();

  if (ctx.state.user) {
    posts = await User.verifyLikedPosts(ctx.state.user._id, posts);
  }

  ctx.status = 200;
  ctx.body = { data: { posts } };
});

controller.get('/:id', auth({ optional: true }), async ctx => {
  const { id } = ctx.params;
  let post = await Post.findAndIncViews(id);

  if (ctx.state.user) {
    post = {
      ...post.toJSON(),
      liked: await User.verifyLikedPost(ctx.state.user._id, post._id)
    };
  }

  ctx.status = 200;
  ctx.body = { data: { post } };
});

controller.use(auth());

controller.post('/', multipartBody, async ctx => {
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

controller.put('/:id', multipartBody, async ctx => {
  const { fields, files } = ctx.request.body;
  const { id } = ctx.params;

  let imagePath = null;
  if (files && files.image) {
    const { image } = files;
    imagePath = `images/posts/${id}/${image.name}`;
    await fse.copy(image.path, `public/${imagePath}`);
  }
  const post = await Post.update(id, { ...fields, image: imagePath });

  if (post == null) {
    ctx.status = 404;
    ctx.body = { error: 'Post not found' };
    return;
  }

  ctx.status = 200;
  ctx.body = { data: { post } };
});

controller.delete('/:id', async ctx => {
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
