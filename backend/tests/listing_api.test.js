const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

const Listing = require('../models/listing');
const User = require('../models/user');
const Comment = require('../models/comment');
const helper = require('./test_helper');
const { JsonWebTokenError } = require('jsonwebtoken');

beforeEach(async () => { // npm run test listing_api.test.js
	await Listing.deleteMany({});
	await Comment.deleteMany({});
	await User.deleteMany({});

	const user = new User({ username: 'root', password: 'secret' });
	await user.save();

	const listingObjects = helper.initialListings
		.map(l => new Listing({ ...l, user: user.id }));

	const listingPromises = listingObjects.map(l => l.save());
	await Promise.all(listingPromises);
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

		expect(resultListing.body.name).toEqual(listingToView.name);

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
	let headers;

	beforeEach(async () => {
		const newUser = {
			username: 'username',
			password: 'password'
		};

		await api
			.post('/api/users')
			.send(newUser);

		const result = await api
			.post('/api/login')
			.send(newUser)

		headers = {
			'Authorization': `Bearer ${result.body.token}`
		};
	});

	test('a valid listing can be added by a valid user', async () => {
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
			.set(headers)
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
			.set(headers)
			.expect(400);

		const listingsAtEnd = await helper.listingsInDb();

		expect(listingsAtEnd).toHaveLength(helper.initialListings.length);
	});

	test('fails with statuscode 401 if token is invalid', async () => {
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
			.expect(401)

		const listingsAtEnd = await helper.listingsInDb();

		expect(listingsAtEnd).toHaveLength(helper.initialListings.length);
	});
});

describe('editing a specific listing', () => {
	let headers;
	let newListing;

	beforeEach(async () => {
		const newUser = {
			username: 'putuser',
			password: 'password'
		};

		await api
			.post('/api/users')
			.send(newUser);

		const result = await api
			.post('/api/login')
			.send(newUser)

		headers = {
			'Authorization': `Bearer ${result.body.token}`
		};

		const savedListing = await api
			.post('/api/listings')
			.send({
				name: 'doc4',
				address: 'add4',
				description: 'desc4',
				website: 'site4',
				phone: 'num4'
			})
			.set(headers)

		newListing = savedListing.body;
	});

	test('succeeds with valid user', async () => {
		const allListings = await helper.listingsInDb();
		const listingToUpdate = allListings.find(l => l.name === newListing.name);

		const updatedListing = {
			description: 'lorem ipsum'
		};

		await api
			.put(`/api/listings/${listingToUpdate.id}`)
			.send(updatedListing)
			.set(headers)
			.expect(200)
			.expect('Content-Type', /application\/json/)


		const listingsAtEnd = await helper.listingsInDb();
		const savedListing = listingsAtEnd.find(l => l.name === newListing.name);
		expect(savedListing.description).toBe('lorem ipsum');
	});

	test('fails with invalid user', async () => {
		const allListings = await helper.listingsInDb();
		const listingToUpdate = allListings.find(l => l.name === newListing.name);

		const updatedListing = {
			description: 'lorem ipsum'
		};

		await api
			.put(`/api/listings/${listingToUpdate.id}`)
			.send(updatedListing)
			.expect(401)

		const listingsAtEnd = await helper.listingsInDb();
		const savedListing = listingsAtEnd.find(l => l.name === newListing.name);
		expect(savedListing.description).toBe('desc4');
	});
});

// describe('deletion of a listing', () => {
// 	test('succeeds with status code 204 if id is valid', async () => {
// 		const listingsAtStart = await helper.listingsInDb();
// 		const listingToDelete = listingsAtStart[0];

// 		await api
// 			.delete(`/api/listings/${listingToDelete.id}`)
// 			.expect(204);

// 		const listingsAtEnd = await helper.listingsInDb();

// 		expect(listingsAtEnd).toHaveLength(helper.initialListings.length - 1);

// 		const descriptions = listingsAtEnd.map(l => l.description);

// 		expect(descriptions).not.toContain(listingToDelete.description);
// 	});
// });

afterAll(async () => {
	await mongoose.connection.close();
});