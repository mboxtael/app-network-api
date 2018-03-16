const { ValidationError } = require('mongoose').Error;
const errorHandler = require('../error-handler');

describe('middleware: errorHandler', () => {
  it('should transform mongoose ValidationError to response error', async () => {
    const ctx = {};
    await errorHandler()(ctx, () => {
      throw new ValidationError();
    });

    expect(ctx.body.error).toBeTruthy();
  });

  it('should set error message in response error', async () => {
    const ctx = {};
    const message = 'error message';
    await errorHandler()(ctx, () => {
      throw new Error(message);
    });

    expect(ctx.body.error).toBe(message);
  });
});
