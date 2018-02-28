const request = require('supertest');
const setupDatabase = require('../../test/setup-database');
const { server } = require('../../server');
const PATH = '/users';

beforeEach(() => {
  return setupDatabase();
});

afterEach(() => {
  server.close();
});

describe(`POST: ${PATH}`, () => {
  it('should fail when missing required fields', async () => {
    const res = await request(server)
      .post(PATH)
      .send({});

    expect(res.status).toEqual(422);
    expect(res.type).toEqual('application/json');
    expect(Object.keys(res.body.data)).toEqual(
      expect.arrayContaining([
        'username',
        'email',
        'password',
        'gender',
        'birthdate'
      ])
    );
  });

  it('should return the newly added user alongside their id', async () => {
    const user = {
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
      gender: 'Male',
      birthdate: '1990/05/16'
    };
    const res = await request(server)
      .post(PATH)
      .send(user);

    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body.data).toMatchObject(user);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        _id: expect.any(String)
      })
    );
  });
});
