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
        ctx.status = err.status || 500;

        if (ctx.status === 401) {
          ctx.body = {
            error: 'Protected resource, use Authorization header to get access'
          };
        } else {
          ctx.body = err.toJSON
            ? { error: err.toJSON() }
            : { error: err.message, ...err };
        }
      }
    }
  };
