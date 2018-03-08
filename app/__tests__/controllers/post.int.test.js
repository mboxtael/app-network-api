/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const request = require('supertest');
const setupDatabase = require('../../../test/setup-database');
const { server } = require('../../../server');
const { Post } = require('../../../app/components/posts');

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
    await Post.create(post);
    const res = await request(server).get(PATH);

    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.posts).toHaveLength(1);
  });
});

describe(`GET: ${PATH}/:id`, () => {
  it('should return the requested post with incremented views', async () => {
    const post1 = await Post.create(post);
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
  it('should return the newly added post', async () => {
    const tags = ['tag1', 'tag2', 'tag3'];
    const res = await request(server)
      .post(PATH)
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
