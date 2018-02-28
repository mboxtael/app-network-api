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
  it('should return a valid access token', async () => {
    const user = await User.create({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
      gender: 'Male',
      birthdate: '1990/05/16'
    });
    const res = await request(server)
      .post(PATH)
      .send({ username: user.username, password: user.password });

    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body.data).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    );
    expect(verify(res.body.data.token)).not.toThrow();
  });
});
