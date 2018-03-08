/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const request = require('supertest');
const setupDatabase = require('../../../test/setup-database');
const { server } = require('../../../server');
const { Post } = require('../../../app/components/posts');
const { User } = require('../../components/users');

const PATH = '/posts';
const post = {
  title: 'Title post',
  category: 'Category post',
  body: 'Body post',
  tags: ['tag1', 'tag2', 'tag3'],
  image: '/path-to-image'
};

beforeEach(async () => setupDatabase());
afterEach(() => {
  server.close();
});

describe(`GET: ${PATH}`, () => {
  it('should return an array of posts', async () => {
    const user = await User.create({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
      gender: 'Male',
      birthdate: '1990/05/16'
    });
    await Post.create({
      ...post,
      user: user._id.toString()
    });
    const res = await request(server).get(PATH);

    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.posts).toHaveLength(1);
  });
});

describe(`GET: ${PATH}/:id`, () => {
  it('should return the requested post with incremented views', async () => {
    const user = await User.create({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
      gender: 'Male',
      birthdate: '1990/05/16'
    });
    const post1 = await Post.create({
      ...post,
      user: user._id.toString()
    });
    const res = await request(server).get(`${PATH}/${post1._id}`);

    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.post).toEqual(
      expect.objectContaining({
        _id: expect.stringContaining(post1._id.toString()),
        title: expect.any(String),
        body: expect.any(String),
        tags: expect.any(Array),
        image: expect.any(String),
        likes: expect.any(Number),
        views: 1,
        comments: expect.any(Array)
      })
    );
  });
});

describe(`POST: ${PATH}`, () => {
  it("should return an error when user isn't authenticated", async () => {
    const res = await request(server).post(PATH);

    expect(res.status).toEqual(401);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.error).toBeTruthy();
  });

  it('should return the newly added post', async () => {
    const user = await User.create({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
      gender: 'Male',
      birthdate: '1990/05/16'
    });
    const tags = ['tag1', 'tag2', 'tag3'];
    const res = await request(server)
      .post(PATH)
      .set('Authorization', `Bearer ${await user.authToken()}`)
      .field('user', user._id.toString())
      .field('title', 'Title post')
      .field('category', 'Category post')
      .field('body', 'Body post')
      .field('tags', tags.join(','))
      .attach('image', 'test/assets/images/post.jpeg');

    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.post).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        title: expect.any(String),
        category: expect.any(String),
        body: expect.any(String),
        image: expect.any(String),
        tags: expect.arrayContaining(tags)
      })
    );
  });
});
