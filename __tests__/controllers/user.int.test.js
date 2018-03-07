const request = require('supertest');
const setupDatabase = require('../../test/setup-database');
const { server } = require('../../server');

const PATH = '/user';
const PATH_POSTS_FAVORITES = `${PATH}/posts/favorites`;

beforeEach(() => setupDatabase());

afterEach(() => {
  server.close();
});

describe(`POST: ${PATH_POSTS_FAVORITES}`, () => {
  it("should return an error when user isn't authenticated", async () => {
    const res = await request(server)
      .post(PATH_POSTS_FAVORITES);

    expect(res.status).toEqual(401);
    expect(res.type).toEqual('application/json');
  });

  // it("should add post to user favorite's posts", async () => {
  //   const res = await request(server)
  //     .post(PATH_POSTS_FAVORITES)
  //     .send({ postId: 'post_id' });

  //   expect(res.status).toEqual(201);
  //   expect(res.type).toEqual('application/json');
  // });
});
