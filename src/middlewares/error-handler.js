module.exports = () =>
  async function errorHandler(ctx, next) {
    try {
      next();
    } catch (err) {
      ctx.status = err.statusCode || 500;
      ctx.body = err.toJSON ? err.toJSON() : { error: err.message, ...err };
    }
  };
