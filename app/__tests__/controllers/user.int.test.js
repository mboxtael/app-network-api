const request = require('supertest');
const setupDatabase = require('../../../test/setup-database');
const { server } = require('../../../server');
const { User } = require('../../components/users');
const { Post } = require('../../components/posts');
const { modelToJSON } = require('../../../test/helpers');

const PATH = '/user';
const PATH_POSTS_FAVORITES = `${PATH}/posts/favorites`;

beforeEach(() => setupDatabase());

afterEach(() => {
  server.close();
});

describe(`POST: ${PATH_POSTS_FAVORITES}`, () => {
  it("should return an error when user isn't authenticated", async () => {
    const res = await request(server).post(PATH_POSTS_FAVORITES);

    expect(res.status).toEqual(401);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.error).toBeTruthy();
  });

  it("should add post to user favorite's posts", async () => {
    const user = await User.create({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
      gender: 'Male',
      birthdate: '1990/05/16'
    });
    const post = await Post.create({
      title: 'Title post',
      category: 'Category post',
      body: 'Body post',
      tags: ['tag1', 'tag2', 'tag3'],
      image: '/path-to-image'
    });
    const res = await request(server)
      .post(PATH_POSTS_FAVORITES)
      .set('Authorization', `Bearer ${await user.authToken()}`)
      .send({ postId: post._id });

    const { status, type, body } = res;
    expect(status).toEqual(201);
    expect(type).toEqual('application/json');
    expect(body.data.posts).toContainEqual(modelToJSON(post));
  });
});
