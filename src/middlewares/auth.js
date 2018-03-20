const koaJwt = require('koa-jwt');

const defaultOpts = { optional: false };

module.exports = (opts = defaultOpts) =>
  koaJwt({ secret: process.env.JWT_SECRET, passthrough: opts.optional });
