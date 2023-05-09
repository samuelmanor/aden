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

  const user = new User({ username: 'username', password: 'password' });
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
    const commentsAtStart = await helper.commentsInDb();
    const newComment = { listingId: listing.id, content: 'lorem ipsum' };

    await api
      .post('/api/comments')
      .send(newComment)
      .set(headers)
      .expect(200)

    const commentsAtEnd = await helper.commentsInDb();
    expect(commentsAtEnd).toHaveLength(commentsAtStart.length + 1);

    const contents = commentsAtEnd.map(c => c.content);
    expect(contents).toContain(newComment.content);
  });

  test('rejects invalid user', async () => {
    const commentsAtStart = await helper.commentsInDb();
    const newComment = { listingId: listing.id, content: 'lorem ipsum' };

    await api
      .post('/api/comments')
      .send(newComment)
      .expect(401)

    const commentsAtEnd = await helper.commentsInDb();
    expect(commentsAtEnd).toHaveLength(commentsAtStart.length);

    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).not.toContain(newComment.content);
  });

  test('rejects invalid comment id', async () => {
    const commentsAtStart = await helper.commentsInDb();
    const newComment = { listingId: listing.id, content: 'lorem ipsum' };

    await api
      .post(`/api/comments/${helper.nonExistingId}`)
      .send(newComment)
      .set(headers)
      .expect(404)

    const commentsAtEnd = await helper.commentsInDb();
    expect(commentsAtEnd).toHaveLength(commentsAtStart.length);

    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).not.toContain(newComment.content);
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
      .send({ listingId: listing.id, content: 'lorem ipsum' })
      .set(headers)

    comment = commentResult.body;
  });

  test('succeeds with valid id and user', async () => {
    const newContent = 'dolor sit amet'

    await api
      .put(`/api/comments/${comment.id}`)
      .send({ content: newContent })
      .set(headers)
      .expect(200)

    const commentsAtEnd = await helper.commentsInDb();
    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).toContain(newContent);
  });

  test('rejects invalid user', async () => {
    const newContent = 'dolor sit amet'

    await api
      .put(`/api/comments/${comment.id}`)
      .send({ content: newContent })
      .expect(401)

    const commentsAtEnd = await helper.commentsInDb();
    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).not.toContain(newContent);
  });

  test('rejects invalid comment id', async () => {
    const newContent = 'dolor sit amet';

    await api
      .put(`/api/comments/${helper.nonExistingId}`)
      .send({ content: newContent })
      .set(headers)
      .expect(400)

    const commentsAtEnd = await helper.commentsInDb();
    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).not.toContain(newContent);
  });
});

describe('deleting a comment', () => {
  let headers;
  let listing;
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
    listing = listingsInDb[0];

    const commentResult = await api
      .post('/api/comments')
      .send({ listingId: listing.id, content: 'unique comment' })
      .set(headers)

    comment = commentResult.body;
  });

  test('succeeds with valid id and user', async () => {
    const allComments = await helper.commentsInDb();
    const commentToDelete = allComments.find(c => c.content === comment.content);

    await api
      .delete(`/api/comments/${commentToDelete.id}`)
      .send({ listingId: listing.id })
      .set(headers)
      .expect(204)

    const commentsAtEnd = await helper.commentsInDb();
    expect(commentsAtEnd).toHaveLength(allComments.length - 1);

    const contents = commentsAtEnd.map(c => c.content)
    expect(contents).not.toContain(commentToDelete.content);
  });

  test('rejects invalid user', async () => {
    const allComments = await helper.commentsInDb();
    const commentToDelete = allComments.find(c => c.content === comment.content);

    await api
      .delete(`/api/comments/${commentToDelete.id}`)
      .send({ listingId: listing.id })
      .expect(401)

    const commentsAtEnd = await helper.commentsInDb();
    const contents = commentsAtEnd.map(c => c.content);

    expect(contents).toContain(commentToDelete.content);
  });

  test('rejects invalid comment id', async () => {
    const allComments = await helper.commentsInDb();

    await api
      .delete(`/api/comments/${helper.nonExistingId}`)
      .send({ listingId: listing.id })
      .set(headers)

    const commentsAtEnd = await helper.commentsInDb();
    expect(commentsAtEnd).toHaveLength(allComments.length);
  });
})