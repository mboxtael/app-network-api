const { ValidationError } = require('mongoose').Error;
const { responseErrors } = require('../utils/response');

module.exports = () =>
  async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      if (err instanceof ValidationError) {
        ctx.status = 422;
        ctx.body = { error: responseErrors(err) };
      } else {
        ctx.status = err.statusCode || 500;
        ctx.body = err.toJSON ? err.toJSON() : { error: err.message, ...err };
      }
    }
  };
