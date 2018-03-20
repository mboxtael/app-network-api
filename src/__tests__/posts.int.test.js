const request = require('supertest');
const { prepareDB } = require('../../test/setup-database');
const app = require('../../app');
const { Post } = require('../components/posts');
const { User } = require('../components/users');

jest.unmock('mongoose');
const PATH = '/posts';
const postExample = {
  title: 'Title post',
  category: 'Category post',
  body: 'Body post',
  tags: ['tag1', 'tag2', 'tag3'],
  image: '/path-to-image',
  link: 'https://example.app'
};
const userExample = {
  username: 'johndoe',
  email: 'johndoe@example.com',
  password: '123456',
  gender: 'Male',
  birthdate: '1990/05/16'
};

beforeEach(async () => prepareDB());

describe(`GET: ${PATH}`, () => {
  it('should return an array of posts', async () => {
    const user = await User.create(userExample);
    await Post.create({
      ...postExample,
      user: user._id.toString()
    });
    const res = await request(app.listen()).get(PATH);

    const { status, type, body } = res;
    expect(status).toEqual(200);
    expect(type).toEqual('application/json');
    expect(body.data.posts).toHaveLength(1);
  });

  it('should indicate post by post if it is liked by the current user', async () => {
    const user = await User.create(userExample);
    const post = await Post.create({
      ...postExample,
      user: user._id.toString()
    });
    await User.likePost(user._id, post._id);
    const res = await request(app.listen())
      .get(PATH)
      .set('Authorization', `Bearer ${await user.authToken()}`);

    const { status, type, body } = res;
    expect(status).toEqual(200);
    expect(type).toEqual('application/json');
    expect(body.data.posts).toHaveLength(1);
    expect(body.data.posts[0].liked).toBeTruthy();
  });
});

describe(`GET: ${PATH}/:id`, () => {
  it('should return the requested post with incremented views', async () => {
    const user = await User.create(userExample);
    const post = await Post.create({
      ...postExample,
      user: user._id.toString()
    });
    const res = await request(app.listen()).get(`${PATH}/${post._id}`);

    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.post).toEqual(
      expect.objectContaining({
        _id: expect.stringMatching(post._id.toString()),
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

  it('should return liked true when requested post is in users liked posts', async () => {
    const user = await User.create(userExample);
    const post = await Post.create({
      ...postExample,
      user: user._id.toString()
    });
    await User.likePost(user._id, post._id);
    const res = await request(app.listen())
      .get(`${PATH}/${post._id}`)
      .set('Authorization', `Bearer ${await user.authToken()}`);

    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.post).toEqual(
      expect.objectContaining({
        _id: expect.stringMatching(post._id.toString()),
        title: expect.any(String),
        body: expect.any(String),
        tags: expect.any(Array),
        image: expect.any(String),
        likes: expect.any(Number),
        views: 1,
        comments: expect.any(Array),
        liked: true
      })
    );
  });
});

describe(`POST: ${PATH}`, () => {
  it("should return unauthorized error when user isn't authenticated", async () => {
    const res = await request(app.listen()).post(PATH);

    expect(res.status).toEqual(401);
    expect(res.type).toEqual('application/json');
    expect(res.body.error).toBeTruthy();
  });

  it('should fail when missing required fields', async () => {
    const user = await User.create(userExample);
    const res = await request(app.listen())
      .post(PATH)
      .set('Authorization', `Bearer ${await user.authToken()}`);

    expect(res.status).toEqual(422);
    expect(res.type).toEqual('application/json');
    expect(Object.keys(res.body.error)).toEqual(
      expect.arrayContaining(['title', 'category', 'body', 'image', 'link'])
    );
  });

  it('should return the newly added post', async () => {
    const user = await User.create(userExample);
    const res = await request(app.listen())
      .post(PATH)
      .set('Authorization', `Bearer ${await user.authToken()}`)
      .field('title', postExample.title)
      .field('category', postExample.category)
      .field('body', postExample.body)
      .field('tags', postExample.tags.join(','))
      .field('link', postExample.link)
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
        tags: expect.arrayContaining(postExample.tags)
      })
    );
  });
});

describe(`PUT: ${PATH}/:id`, () => {
  it("should return unauthorized error when user isn't authenticated", async () => {
    const res = await request(app.listen()).post(PATH);

    expect(res.status).toEqual(401);
    expect(res.type).toEqual('application/json');
    expect(res.body.error).toBeTruthy();
  });

  it('should return not found when trying to edit a nonexistent post', async () => {
    const user = await User.create(userExample);
    const post = new Post({ ...postExample });
    const res = await request(app.listen())
      .put(`${PATH}/${post._id}`)
      .set('Authorization', `Bearer ${await user.authToken()}`)
      .set('Content-Type', 'multipart/form-data');

    const { status, type, body } = res;
    expect(status).toEqual(404);
    expect(type).toEqual('application/json');
    expect(body.error).toBeTruthy();
  });

  it('should return the edited post', async () => {
    const postEdited = {
      title: 'Edited title post',
      category: 'Edited category post',
      body: 'Edited body post',
      tags: ['tag1'],
      link: 'https://edited-example.app'
    };
    const user = await User.create(userExample);
    const post = await Post.create({ ...postExample, user: user._id });
    const res = await request(app.listen())
      .put(`${PATH}/${post._id}`)
      .set('Authorization', `Bearer ${await user.authToken()}`)
      .field('title', postEdited.title)
      .field('category', postEdited.category)
      .field('body', postEdited.body)
      .field('tags', postEdited.tags.join(','))
      .field('link', postEdited.link)
      .attach('image', 'test/assets/images/post.jpeg');

    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.data.post).toEqual(
      expect.objectContaining({
        _id: post._id.toString(),
        title: postEdited.title,
        category: postEdited.category,
        body: postEdited.body,
        image: expect.any(String),
        tags: expect.arrayContaining(postEdited.tags)
      })
    );
  });
});

describe(`DELETE: ${PATH}/:id`, () => {
  it("should return unauthorized error when user isn't authenticated", async () => {
    const res = await request(app.listen()).post(PATH);

    expect(res.status).toEqual(401);
    expect(res.type).toEqual('application/json');
    expect(res.body.error).toBeTruthy();
  });

  it('should return not found when trying to delete a nonexistent post', async () => {
    const user = await User.create(userExample);
    const post = new Post({ ...postExample });
    const res = await request(app.listen())
      .delete(`${PATH}/${post._id}`)
      .set('Authorization', `Bearer ${await user.authToken()}`);

    const { status, type, body } = res;
    expect(status).toEqual(404);
    expect(type).toEqual('application/json');
    expect(body.error).toBeTruthy();
  });

  it('should delete the requested post', async () => {
    const user = await User.create(userExample);
    const post = await Post.create({ ...postExample, user: user._id });
    const res = await request(app.listen())
      .delete(`${PATH}/${post._id}`)
      .set('Authorization', `Bearer ${await user.authToken()}`);

    const { status, type, body } = res;
    expect(status).toEqual(200);
    expect(type).toEqual('application/json');
    expect(body.message).toBeTruthy();
  });
});
