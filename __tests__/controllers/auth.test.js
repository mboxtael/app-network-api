const request = require('supertest');
const setupDatabase = require('../../test/setup-database');
const { server } = require('../../server');
const User = require('../../app/components/users/user');
const { verify } = require('../../app/utils/jwt');
const { FB, mockMe } = require('../../app/utils/fb');

jest.mock('../../app/utils/fb');

const PATH = '/auth';

beforeEach(async () => {
  await setupDatabase();
});

afterEach(() => {
  server.close();
});

describe(`POST: ${PATH}`, () => {
  it('should return a valid auth token', async () => {
    const user = {
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
      gender: 'Male',
      birthdate: '1990/05/16'
    };
    await User.create(user);
    const res = await request(server)
      .post(PATH)
      .send({ username: user.username, password: user.password });

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
});

describe(`POST: ${PATH}/facebook`, () => {
  const FACEBOOK_PATH = `${PATH}/facebook`;

  it('should return a valid auth token when send valid access token', async () => {
    const res = await request(server)
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
    const res = await request(server)
      .post(FACEBOOK_PATH)
      .send({ accessToken: 'fb_access_token' });

    expect(FB).toHaveBeenCalledTimes(2);
    expect(mockMe).toHaveBeenCalledTimes(2);
    expect(res.status).toEqual(422);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.errors).toEqual(
      expect.objectContaining({
        email: expect.objectContaining({
          type: expect.stringContaining('required')
        })
      })
    );
  });
});
