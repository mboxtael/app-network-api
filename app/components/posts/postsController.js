/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] } ] */

const fse = require('fs-extra');
const Router = require('koa-router');
const koaBody = require('koa-body');
const { Post } = require('./postModel');
const { validationErrors } = require('../../utils/mongoose');

const multipartBody = koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true
  }
});
const controller = new Router({ prefix: '/posts' });

controller.post('/', multipartBody, async ctx => {
  const { fields, files } = ctx.request.body;
  const { image } = files;
  try {
    const post = new Post({
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
