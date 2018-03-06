const request = require('supertest');
const setupDatabase = require('../../test/setup-database');
const { server } = require('../../server');

const PATH = '/posts';
beforeEach(async () => setupDatabase());
afterEach(() => {
  server.close();
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
