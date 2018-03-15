module.exports = () =>
  async function unauthorized(ctx, next) {
    try {
      await next();
    } catch (err) {
      if (err.status === 401) {
        ctx.status = 401;
        ctx.body = {
          error: 'Protected resource, use Authorization header to get access'
        };
      } else {
        throw err;
      }
    }
  };
