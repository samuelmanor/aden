const Listing = require('../models/listing');
const User = require('../models/user');

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

// const initialUsers = [
// 	{
// 		username: 'exampleuser',
// 		password: 'secret',
// 		name: 'test',
// 		bio: 'this is an example user.'
// 	},
// 	{
// 		username: 'smm',
// 		password: 'password',
// 		name: 'samuel',
// 		bio: 'hello :-)'
// 	}
// ];

const nonExistingId = async () => {
	const listing = new Listing({ name: 'test' });
	await listing.save();
	await listing.deleteOne();

	return listing._id.toString();
};

const listingsInDb = async () => {
	const listings = await Listing.find({});
	return listings.map(l => l.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map(u => u.toJSON());
};

module.exports = { initialListings, nonExistingId, listingsInDb, usersInDb };