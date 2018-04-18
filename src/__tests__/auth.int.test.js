const request = require('supertest');
const { prepareDB } = require('../../test/setup-database');
const app = require('../../app');
const { User } = require('../components/users');
const { verify } = require('../utils/jwt');
const FB = require('../utils/fb');

jest.unmock('mongoose');
const mockMe = jest
  .fn()
  .mockImplementationOnce(() => ({
    id: '123456',
    email: 'jhondoe@example.com',
    gender: 'male'
  }))
  .mockImplementationOnce(() => ({
    id: '123456',
    gender: 'male'
  }));
jest.mock(
  '../utils/fb',
  () => jest.fn().mockImplementation(() => ({ me: mockMe }))
);

const PATH = '/auth';

beforeEach(async () => {
  await prepareDB();
});

describe(`POST: ${PATH}`, () => {
  const user = {
    username: 'johndoe',
    email: 'johndoe@example.com',
    password: '123456',
    gender: 'Male',
    birthdate: '1990/05/16'
  };

  beforeEach(async () => User.create(user));

  it('should auth user by username', async () => {
    const res = await request(app.listen())
      .post(PATH)
      .send({ username: user.username, password: user.password });

    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    await expect(verify(res.body.data.token)).resolves.toBeTruthy();
    expect(res.body.data.user).toEqual(
      expect.objectContaining({
        username: expect.any(String),
        email: expect.any(String)
      })
    );
  });

  it('should auth user by email', async () => {
    const res = await request(app.listen())
      .post(PATH)
      .send({ username: user.email, password: user.password });

    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    await expect(verify(res.body.data.token)).resolves.toBeTruthy();
  });

  it('should return an error when send wrong password', async () => {
    const res = await request(app.listen())
      .post(PATH)
      .send({ username: user.username, password: user.password.repeat(2) });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual('application/json');
    expect(res.body.error).toEqual(expect.any(String));
  });

  it("should return an error when user don't exists", async () => {
    const res = await request(app.listen())
      .post(PATH)
      .send({ username: 'janedoe', password: '123456' });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual('application/json');
    expect(res.body.error).toEqual(expect.any(String));
  });
});

describe(`POST: ${PATH}/facebook`, () => {
  const FACEBOOK_PATH = `${PATH}/facebook`;

  it('should auth user when send facebook access token', async () => {
    const res = await request(app.listen())
      .post(FACEBOOK_PATH)
      .send({ accessToken: 'fb_access_token' });

    expect(FB).toHaveBeenCalledTimes(1);
    expect(mockMe).toHaveBeenCalledTimes(1);
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body.data).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    );
    await expect(verify(res.body.data.token)).resolves.toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        iat: expect.any(Number)
      })
    );
    expect(res.body.data.user).toEqual(
      expect.objectContaining({
        username: expect.any(String),
        email: expect.any(String)
      })
    );
  });

  it('should return error when access token without email field is provided', async () => {
    const res = await request(app.listen())
      .post(FACEBOOK_PATH)
      .send({ accessToken: 'fb_access_token' });

    expect(FB).toHaveBeenCalledTimes(2);
    expect(mockMe).toHaveBeenCalledTimes(2);
    expect(res.status).toEqual(422);
    expect(res.type).toEqual('application/json');
    expect(res.body.error).toEqual(
      expect.objectContaining({
        email: expect.objectContaining({
          type: expect.stringContaining('required')
        })
      })
    );
  });
});
