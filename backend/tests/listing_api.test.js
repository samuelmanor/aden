const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

const Listing = require('../models/listing');
const helper = require('./listing_helper');

beforeEach(async () => {
	await Listing.deleteMany({});

	let listingObj = new Listing(helper.initialListings[0]);
	await listingObj.save();

	listingObj = new Listing(helper.initialListings[1]);
	await listingObj.save();
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

	test('a specific listing can be viewed', async () => {
		const listingsAtStart = await helper.listingsInDb();

		const listingToView = listingsAtStart[0];

		const resultListing = await api
			.get(`/api/listings/${listingToView.id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(resultListing.body).toEqual(listingToView);
	});

	test('a listing can be deleted', async () => {
		const listingsAtStart = await helper.listingsInDb();
		const listingToDelete = listingsAtStart[0];

		await api
			.delete(`/api/listings/${listingToDelete.id}`)
			.expect(204);

		const listingsAtEnd = await helper.listingsInDb();

		expect(listingsAtEnd).toHaveLength(helper.initialListings.length - 1);
	});
});

describe('adding a new listing', () => {
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

	test('an invalid listing cannot be added', async () => {
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

afterAll(async () => {
	await mongoose.connection.close();
});