const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

const Listing = require('../models/listing');
const helper = require('./listing_helper');

beforeEach(async () => {
  await Listing.deleteMany({});

  const listingObjects = helper.initialListings
    .map(l => new Listing(l));

  const promiseArray = listingObjects.map(l => l.save());
  await Promise.all(promiseArray);
});

describe('when there are initially some listings saved', () => {
	test('listings are returned as json', async () => {
		await api
			.get('/api/listings')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('all listings are returned', async () => {
		const res = await api.get('/api/listings');

		expect(res.body).toHaveLength(helper.initialListings.length);
	});

	test('a specific listing is within the returned listings', async () => {
		const res = await api.get('/api/listings');

		const descriptions = res.body.map(l => l.description);

		expect(descriptions).toContain('desc2');
	});
});

describe('viewing a specific listing', () => {
	test('succeeds with a valid id', async () => {
		const listingsAtStart = await helper.listingsInDb();

		const listingToView = listingsAtStart[0];

		const resultListing = await api
			.get(`/api/listings/${listingToView.id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(resultListing.body).toEqual(listingToView);
	});

  test('fails with statuscode 404 if listing does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api
      .get(`/api/listings/${validNonexistingId}`)
      .expect(404);
  });

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = 'dshljahflasjh';

    await api
      .get(`/api/listings/${invalidId}`)
      .expect(400);
  });
});

describe('addition of a new listing', () => {
	test('a valid listing can be added', async () => {
		const newListing = {
			name: 'doc3',
			address: 'add3',
			description: 'desc3',
			website: 'site3',
			phone: 'num3'
		};

		await api
			.post('/api/listings')
			.send(newListing)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const listingsAtEnd = await helper.listingsInDb();
		expect(listingsAtEnd).toHaveLength(helper.initialListings.length + 1);

		const descriptions = listingsAtEnd.map(l => l.description);
		expect(descriptions).toContain('desc3');
	});

  test('fails with statuscode 400 if data is invalid', async () => {
    const newListing = {
			address: 'add3',
			description: 'desc3'
		};

		await api
			.post('/api/listings')
			.send(newListing)
			.expect(400);

		const listingsAtEnd = await helper.listingsInDb();

		expect(listingsAtEnd).toHaveLength(helper.initialListings.length);
  });
});

describe('deletion of a listing', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const listingsAtStart = await helper.listingsInDb();
    const listingToDelete = listingsAtStart[0];

    await api
      .delete(`/api/listings/${listingToDelete.id}`)
      .expect(204);

    const listingsAtEnd = await helper.listingsInDb();

    expect(listingsAtEnd).toHaveLength(helper.initialListings.length - 1);

    const descriptions = listingsAtEnd.map(l => l.description);

    expect(descriptions).not.toContain(listingToDelete.description);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});