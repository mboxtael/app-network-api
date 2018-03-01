const request = require('supertest');
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
    const fbAccessToken =
      'EAAQ5CGgGPd8BAJGJq3D7k95w5KjHmPLnX1WY6o5oqyClEmdKJ0usAMe0oWDcmliTP2Jkag3CGdMEcVPnXilC1CipB4bZCwdt0OyMAl2vflGZC3jfwbbCHRd691nGUsOkisgFRVKProZC3PrYRZAVmM1LwuzR1DJ2U7308ZAVBLNjM3GaRgKT5oDN1hhdUq1VcKJV2wJTZBO0ZAearv595ZCHxDhZAI3B8el4Os5OQNMZCIdQZDZD';
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
