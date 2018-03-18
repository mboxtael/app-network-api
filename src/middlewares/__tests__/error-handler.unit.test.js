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

  it('should set error json in response error', async () => {
    const jsonError = { message: 'error message' };
    const error = new Error();
    error.status = 400;
    error.toJSON = () => jsonError;
    const ctx = {};
    await errorHandler()(ctx, () => {
      throw error;
    });

    expect(ctx.body.error).toBe(jsonError);
    expect(ctx.status).toEqual(400);
  });
});
