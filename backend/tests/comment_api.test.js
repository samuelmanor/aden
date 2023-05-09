const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

const Listing = require('../models/listing');
const User = require('../models/user');
const Comment = require('../models/comment');
const helper = require('./test_helper');

beforeEach(async () => {
  await Comment.deleteMany({});
  await Listing.deleteMany({});
  await User.deleteMany({});

  const user = new User({ username: 'username', password: 'password' }); // npm run test comment_api.test.js
  await user.save();

  const listingObjects = helper.initialListings
    .map(l => new Listing({ ...l, user: user.id }));

  const listingPromises = listingObjects.map(l => l.save());
  await Promise.all(listingPromises);
});

describe('addition of a new comment', () => {
  let headers;
  let listing;

  beforeEach(async () => {
    const newUser = {
      username: 'commentUser',
      password: 'password'
    };

    await api
      .post('/api/users')
      .send(newUser)

    const userResult = await api
      .post('/api/login')
      .send(newUser)

    headers = { 'Authorization': `Bearer ${userResult.body.token}` };

    const listings = await helper.listingsInDb();
    listing = listings[0];
  });

  test('succeeds with valid id and user', async () => {
    await api
      .post('/api/comments')
      .send({ listingId: listing.id, content: 'lorem ipsum' })
      .set(headers)
      .expect(200)

    const commentsAtEnd = await helper.commentsInDb();
    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).toContain('lorem ipsum');
  });

  test('rejects invalid user', async () => {
    await api
      .post('/api/comments')
      .send({ listingId: listing.id, content: 'lorem ipsum' })
      .expect(401)

    const commentsAtEnd = await helper.commentsInDb();
    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).not.toContain('lorem ipsum');
  });

  test('rejects invalid comment id', async () => {
    await api
      .post(`/api/comments/${helper.nonExistingId}`)
      .send({ listingId: listing.id, content: 'lorem ipsum' })
      .set(headers)
      .expect(404)

    const commentsAtEnd = await helper.commentsInDb();
    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).not.toContain('lorem ipsum');
  });
});

describe('editing a comment', () => {
  let headers;
  let comment;

  beforeEach(async () => {
    const newUser = {
      username: 'commentUser',
      password: 'password'
    };

    await api
      .post('/api/users')
      .send(newUser)

    const userResult = await api
      .post('/api/login')
      .send(newUser)

    headers = { 'Authorization': `Bearer ${userResult.body.token}` };

    const listingsInDb = await helper.listingsInDb();
    const listing = listingsInDb[0];

    const commentResult = await api
      .post('/api/comments')
      .send({ listingId: listing.id, content: 'dolor sit amet' })
      .set(headers)

    comment = commentResult.body;
  });

  test('succeeds with valid id and user', async () => {
    await api
      .put(`/api/comments/${comment.id}`)
      .send({ content: 'dolor sit amet' })
      .set(headers)
      .expect(200)

    const commentsAtEnd = await helper.commentsInDb();
    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).toContain('dolor sit amet');
  });

  test('rejects invalid user', async () => {
    await api
      .put(`/api/comments/${comment.id}`)
      .send({ content: 'hello' })
      .expect(401)

    const commentsAtEnd = await helper.commentsInDb();
    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).not.toContain('hello');
  });

  test('rejects invalid comment id', async () => {
    await api
      .put(`/api/comments/${helper.nonExistingId}`)
      .send({ content: 'lorem ipsum' })
      .set(headers)
      .expect(400)

    const commentsAtEnd = await helper.commentsInDb();
    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).not.toContain('lorem ipsum');
  });
});

// describe('deleting a comment', async () => {
//   let headers;
//   let comment;

//   beforeEach(async () => {
//     const newUser = {
//       username: 'commentUser',
//       password: 'password'
//     };

//     await api
//       .post('/api/users')
//       .send(newUser)

//     const userResult = await api
//       .post('/api/login')
//       .send(newUser)

//     headers = { 'Authorization': `Bearer ${userResult.body.token}` };

//     const listingsInDb = await helper.listingsInDb();
//     const listing = listingsInDb[0];

//     const commentResult = await api
//       .post('/api/comments')
//       .send({ listingId: listing.id, content: 'dolor sit amet' })
//       .set(headers)

//     comment = commentResult.body;
//   });

//   test('succeds with valid id and user')
// })