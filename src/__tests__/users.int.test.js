const request = require('supertest');
const setupDatabase = require('../../test/setup-database');
const app = require('../../app');
const { verify } = require('../utils/jwt');
const { User } = require('../components/users');

const PATH = '/users';

beforeEach(() => setupDatabase());

describe(`POST: ${PATH}`, () => {
  it('should fail when missing required fields', async () => {
    const res = await request(app.listen())
      .post(PATH)
      .send({});

    expect(res.status).toEqual(422);
    expect(res.type).toEqual('application/json');
    expect(Object.keys(res.body.data.errors)).toEqual(
      expect.arrayContaining(['username', 'email'])
    );
  });

  it('should return the newly added user alongside their auth token', async () => {
    const user = {
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
      gender: 'Male',
      birthdate: '1990/05/16'
    };
    const res = await request(app.listen())
      .post(PATH)
      .send(user);

    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    await expect(verify(res.body.data.token)).resolves.toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        iat: expect.any(Number)
      })
    );
    expect(res.body.data.user).toEqual(
      expect.objectContaining({
        _id: expect.any(String)
      })
    );
    expect(res.body.data.user).not.toHaveProperty('password');
  });

  it('should return an error when try to register duplicate user', async () => {
    const user = {
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
      gender: 'Male',
      birthdate: '1990/05/16'
    };
    await User.create(user);
    const res = await request(app.listen())
      .post(PATH)
      .send(user);

    expect(res.status).toEqual(422);
    expect(res.type).toEqual('application/json');
    expect(Object.keys(res.body.data.errors)).toEqual(
      expect.arrayContaining(['username', 'email'])
    );
  });
});

