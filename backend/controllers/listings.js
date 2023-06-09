const listingsRouter = require('express').Router();
const Listing = require('../models/listing');
const Comment = require('../models/comment');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = req => {
	const auth = req.get('authorization');
	if (auth && auth.startsWith('Bearer ')) {
		return auth.replace('Bearer ', '');
	}
	return null;
};

listingsRouter.get('/filters', async (req, res) => {
	const listings = await Listing.find({});

	const identities = listings.map(l => l.identity);
	const services = listings.map(l => l.service);
	const locations = listings.map(l => l.location);

	const findDuplicates = (val, index, arr) => {
		return arr.indexOf(val) === index && val !== 'both';
	};

	const filters = {
		identities: identities.filter(findDuplicates),
		services: services.filter(findDuplicates),
		locations: locations.filter(findDuplicates)
	};
	res.json(filters);
});

listingsRouter.post('/search', async (req, res) => {
	const listings = await Listing.find(
		{ identity: { $in: [ 'both', req.body.identity ] }, 
			service: req.body.service, 
			location: req.body.location })
		.populate('user') // <- user who posted the listing itself
		.populate({
			path: 'comments',
			// model: 'Comment',
			populate: { path: 'user' } // <- user who posted comment under listing
		})

	res.json(listings);
});

listingsRouter.get('/:id', async (req, res) => {
	const listing = await Listing.findById(req.params.id);

	if (listing) {
		res.json(listing);
	} else {
		res.status(404).end();
	}
});

listingsRouter.post('/', async (req, res) => {
	const body = req.body;

	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token invalid' });
	}

	const user = await User.findById(decodedToken.id);
	const listing = new Listing({ ...body, user: user.id });

	const savedListing = await listing.save();
	res.status(201).json(savedListing);
});

listingsRouter.delete('/:id', async (req, res) => {
	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token invalid' });
	}

	const listing = await Listing.findById(req.params.id);
	const user = await User.findById(decodedToken.id);

	if (listing.user.toString() !== user.id) {
		return res.status(401).json({ error: 'unauthorized user' });
	}

	const commentIds = listing.comments.map(c => c._id.toString());

	const delComment = async (id) => {
		await Comment.findByIdAndRemove(id);
	};

	commentIds.forEach(id => delComment(id));

	await Listing.findByIdAndRemove(req.params.id);
	res.status(204).end();
});

module.exports = listingsRouter;