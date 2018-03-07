/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] } ] */

const fse = require('fs-extra');
const Router = require('koa-router');
const koaBody = require('koa-body');
const { Post: PostModel } = require('./postModel');
const Post = require('./postDAL');
const { validationErrors } = require('../../utils/mongoose');

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
    ctx.body = { data: { error: error.message } };
  }
});

controller.get('/:id', async ctx => {
  const { id } = ctx.params;
  try {
    const post = await Post.find(id);

    ctx.status = 200;
    ctx.body = { data: { post } };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { data: { error: error.message } };
  }
});

controller.post('/', multipartBody, async ctx => {
  const { fields, files } = ctx.request.body;
  const { image } = files;
  try {
    const post = new PostModel({
      ...fields,
      tags: fields.tags.split(',')
    });
    post.image = `images/posts/${post._id}/${image.name}`;
    await fse.copy(image.path, `public/${post.image}`);
    await post.save();

    ctx.status = 201;
    ctx.body = { data: { post } };
  } catch (error) {
    ctx.status = 422;
    ctx.body = { data: { errors: validationErrors(error) } };
  }
});

module.exports = controller;
