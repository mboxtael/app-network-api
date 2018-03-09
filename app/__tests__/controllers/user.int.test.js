const request = require('supertest');
const setupDatabase = require('../../../test/setup-database');
const { server } = require('../../../server');
const { User } = require('../../components/users');
const { Post } = require('../../components/posts');
const { modelToJSON } = require('../../../test/helpers');

const PATH = '/user';
const PATH_POSTS_FAVORITES = `${PATH}/posts/favorites`;
const userExample = {
  username: 'johndoe',
  email: 'johndoe@example.com',
  password: '123456',
  gender: 'Male',
  birthdate: '1990/05/16'
};
const postExample = {
  title: 'Title post',
  category: 'Category post',
  body: 'Body post',
  tags: ['tag1', 'tag2', 'tag3'],
  image: '/path-to-image',
  link: 'https://example.app'
};

afterEach(() => {
  server.close();
});

describe(`POST: ${PATH_POSTS_FAVORITES}`, () => {
  let user = null;
  let post = null;

  beforeAll(() => setupDatabase());

  it("should return an error when user isn't authenticated", async () => {
    const res = await request(server).post(PATH_POSTS_FAVORITES);

    expect(res.status).toEqual(401);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.error).toBeTruthy();
  });

  it('should add post to user favorites posts', async () => {
    user = await User.create(userExample);
    post = await Post.create({
      ...postExample,
      user: user._id.toString()
    });
    const res = await request(server)
      .post(PATH_POSTS_FAVORITES)
      .set('Authorization', `Bearer ${await user.authToken()}`)
      .send({ postId: post._id });

    const { status, type, body } = res;
    expect(status).toEqual(201);
    expect(type).toEqual('application/json');
    expect(body.data.posts).toContainEqual({
      ...post.toJSON(),
      _id: post._id.toString(),
      user: post.user.toString()
    });
  });

  it('should remove post from user favorites posts', async () => {
    const res = await request(server)
      .delete(`${PATH_POSTS_FAVORITES}/${post._id}`)
      .set('Authorization', `Bearer ${await user.authToken()}`);

    const { status, type, body } = res;
    expect(status).toEqual(200);
    expect(type).toEqual('application/json');
    expect(body.data.posts).toHaveLength(0);
  });
});
