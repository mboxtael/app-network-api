const request = require('supertest');
const app = require('../../app');
const setupDatabase = require('../../test/setup-database');
const { User } = require('../components/users');
const { Post } = require('../components/posts');

const PATH = '/posts/:id/comments';

beforeEach(async () => setupDatabase());

describe(`POST: ${PATH}`, () => {
  it("should return an error when user isn't authenticated", async () => {
    const res = await request(app.listen()).post(PATH);

    expect(res.status).toEqual(401);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.error).toBeTruthy();
  });

  it("should create a post's comment", async () => {
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
      image: '/path-to-image',
      link: 'https://example.app',
      user: user._id
    });
    const res = await request(app.listen())
      .post(`/posts/${post._id}/comments`)
      .set('Authorization', `Bearer ${await user.authToken()}`)
      .send({ body: 'Post comment' });

    const { status, type, body } = res;
    expect(status).toEqual(201);
    expect(type).toEqual('application/json');
    expect(Object.keys(body.data.comment)).toEqual(
      expect.arrayContaining(['_id', 'body', 'createdAt', 'user'])
    );
    expect(body.data.comment.user).toEqual(
      expect.objectContaining({
        _id: user._id.toString()
      })
    );
  });
});
