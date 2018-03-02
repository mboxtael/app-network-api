const request = require('supertest');
const { FB } = require('fb');
const setupDatabase = require('../../test/setup-database');
const { server } = require('../../server');
const User = require('../../app/components/users/user');
const { verify } = require('../../app/utils/jwt');

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
  it('should return valid auth token when send facebook access token', async () => {
    FB.setAccessToken('1188608174603743|uplLnN7Pm0WRhyadKtWTkrnS-64');
    const testUsers = await FB.api('app/accounts/test-users');
    const fbAccessToken = testUsers.data[0].access_token;
    const res = await request(server)
      .post(`${PATH}/facebook`)
      .send({ accessToken: fbAccessToken });

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
