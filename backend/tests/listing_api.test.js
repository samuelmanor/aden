const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

const Listing = require('../models/listing');
const User = require('../models/user');
const Comment = require('../models/comment');
const helper = require('./test_helper');

beforeEach(async () => {
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

describe('viewing all listings', () => {
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

	test('fails with invalid id', async () => {
		const validNonexistingId = await helper.nonExistingId();

		await api
			.get(`/api/listings/${validNonexistingId}`)
			.expect(404);
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
			.send(newUser);

		headers = {
			'Authorization': `Bearer ${result.body.token}`
		};
	});

	test('succeeds with valid user', async () => {
		const listingsAtStart = await helper.listingsInDb();

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
		expect(listingsAtEnd).toHaveLength(listingsAtStart.length + 1);

		const descriptions = listingsAtEnd.map(l => l.description);
		expect(descriptions).toContain(newListing.description);
	});

	test('fails with invalid data', async () => {
		const listingsAtStart = await helper.listingsInDb();

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
		expect(listingsAtEnd).toEqual(listingsAtStart);

		const descriptions = listingsAtEnd.map(l => l.description);
		expect(descriptions).not.toContain(newListing.description);
	});

	test('fails with invalid user', async () => {
		const listingsAtStart = await helper.listingsInDb();

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
			.expect(401);

		const listingsAtEnd = await helper.listingsInDb();
		expect(listingsAtEnd).toEqual(listingsAtStart);

		const descriptions = listingsAtEnd.map(l => l.description);
		expect(descriptions).not.toContain(newListing.description);
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
			.send(newUser);

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
			.set(headers);

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
			.expect('Content-Type', /application\/json/);


		const listingsAtEnd = await helper.listingsInDb();
		const savedListing = listingsAtEnd.find(l => l.name === newListing.name);
		expect(savedListing.description).toBe(updatedListing.description);
	});

	test('fails with invalid id', async () => {
		const listingsAtStart = await helper.listingsInDb();

		const updatedListing = {
			description: 'lorem ipsum'
		};

		await api
			.put(`/api/listings/${helper.nonExistingId}`)
			.send(updatedListing)
			.set(headers)
			.expect(400);

		const listingsAtEnd = await helper.listingsInDb();
		expect(listingsAtEnd).toEqual(listingsAtStart);
	});

	test('fails with invalid user', async () => {
		const listingsAtStart = await helper.listingsInDb();
		const listingToUpdate = listingsAtStart.find(l => l.name === newListing.name);

		const updatedListing = {
			description: 'lorem ipsum'
		};

		await api
			.put(`/api/listings/${listingToUpdate.id}`)
			.send(updatedListing)
			.expect(401);

		const listingsAtEnd = await helper.listingsInDb();
		expect(listingsAtEnd).toEqual(listingsAtStart);
	});
});

describe('deleting a specific listing', () => {
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
			.send(newUser);

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
			.set(headers);

		newListing = savedListing.body;
	});

	test('succeeds with valid id and user', async () => {
		const listingsAtStart = await helper.listingsInDb();
		const listingToDelete = listingsAtStart.find(l => l.name === newListing.name);

		await api
			.delete(`/api/listings/${listingToDelete.id}`)
			.set(headers)
			.expect(204);

		const listingsAtEnd = await helper.listingsInDb();
		expect(listingsAtEnd).toHaveLength(listingsAtStart.length - 1);

		const descriptions = listingsAtEnd.map(l => l.description);
		expect(descriptions).not.toContain(listingToDelete.description);
	});

	test('joined comments are also deleted', async () => {
		const listingsAtStart = await helper.listingsInDb();
		const listingToDelete = listingsAtStart.find(l => l.name === newListing.name);

		const commentsAtStart = await helper.commentsInDb();
		const newComment = { listingId: listingToDelete.id, content: 'to delete' };

		await api
			.post('/api/comments')
			.send(newComment)
			.set(headers);

		const commentsInMiddle = await helper.commentsInDb();
		expect(commentsInMiddle).toHaveLength(commentsAtStart.length + 1);

		await api
			.delete(`/api/listings/${listingToDelete.id}`)
			.set(headers)
			.expect(204);

		const listingsAtEnd = await helper.listingsInDb();
		expect(listingsAtEnd).toHaveLength(listingsAtStart.length - 1);

		const commentsAtEnd = await helper.commentsInDb();
		const contents = commentsAtEnd.map(c => c.content);
		expect(contents).not.toContain(newComment.content);
	});

	test('fails with invalid user', async () => {
		const listingsAtStart = await helper.listingsInDb();
		const listingToDelete = listingsAtStart.find(l => l.name === newListing.name);

		await api
			.delete(`/api/listings/${listingToDelete.id}`)
			.expect(401);

		const listingsAtEnd = await helper.listingsInDb();
		expect(listingsAtEnd).toEqual(listingsAtStart);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});