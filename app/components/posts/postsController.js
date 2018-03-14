/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] } ] */

const fse = require('fs-extra');
const Router = require('koa-router');
const koaBody = require('koa-body');
const Joi = require('joi');
const { Post: PostModel } = require('./postModel');
const Post = require('./postDAL');
const { validationErrors } = require('../../utils/mongoose');
const { authenticate } = require('../../utils/jwt');
const { joiErrors } = require('../../utils/response');

const multipartBody = koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true
  }
});
const controller = new Router({ prefix: '/posts' });

controller.get('/', async ctx => {
  try {
    const posts = await Post.all();

    ctx.status = 200;
    ctx.body = { data: { posts } };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: error.message };
  }
});

controller.get('/:id', async ctx => {
  const { id } = ctx.params;
  try {
    const post = await Post.findAndIncViews(id);

    ctx.status = 200;
    ctx.body = { data: { post } };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: error.message };
  }
});

function validate() {
  return (ctx, next) => {
    const schema = Joi.object().keys({
      title: Joi.string().required(),
      category: Joi.string().required(),
      body: Joi.string().required(),
      link: Joi.string().required(),
      image: Joi.object().required(),
      tags: Joi.string().required()
    });
    const { fields, files } = ctx.request.body;
    const result = Joi.validate({ ...fields, ...files }, schema, {
      abortEarly: false
    });

    if (result.error == null) {
      return next();
    }

    ctx.status = 422;
    ctx.body = { error: joiErrors(result.error) };
  };
}

controller.post('/', authenticate, multipartBody, validate(), async ctx => {
  const { fields, files } = ctx.request.body;
  const { image } = files;

  try {
    const post = new PostModel({
      ...fields,
      user: ctx.state.user._id,
      tags: fields.tags.split(',')
    });
    post.image = `images/posts/${post._id}/${image.name}`;
    await fse.copy(image.path, `public/${post.image}`);
    await post.save();

    ctx.status = 201;
    ctx.body = { data: { post } };
  } catch (error) {
    ctx.status = 422;
    ctx.body = { error: validationErrors(error) };
  }
});

controller.put('/:id', authenticate, multipartBody, async ctx => {
  const { fields, files } = ctx.request.body;
  const { image } = files;
  const { id } = ctx.params;
  try {
    let imagePath = null;
    if (image) {
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
  } catch (error) {
    ctx.status = 422;
    ctx.body = { error: validationErrors(error) };
  }
});

module.exports = controller;
