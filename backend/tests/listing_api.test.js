const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const Listing = require('../models/listing');

const initialListings = [
  {
    name: 'doc1',
    address: 'add1',
    description: 'desc1',
    website: 'site1',
    phone: 'num1'
  },
  {
    name: 'doc2',
    address: 'add2',
    description: 'desc2',
    website: 'site2',
    phone: 'num2'
  }
];

beforeEach(async () => {
  await Listing.deleteMany({});
  let listingObj = new Listing(initialListings[0]);
  await listingObj.save();

  listingObj = new Listing(initialListings[1]);
  await listingObj.save();
});

test('listings are returned as json', async () => {
	await api
		.get('/api/listings')
		.expect(200)
		.expect('Content-Type', /application\/json/);
});

test('all listings are returned', async () => {
	const res = await api.get('/api/listings');

	expect(res.body).toHaveLength(initialListings.length);
});

afterAll(async () => {
	await mongoose.connection.close();
});