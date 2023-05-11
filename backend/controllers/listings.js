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

listingsRouter.get('/', async (req, res) => { // in body: type, service, location
	const listings = await Listing.find({ type: req.body.type, service: req.body.service, location: req.body.location });
	res.json(listings);
});

listingsRouter.get('/:id', async (req, res) => {
	const listing = await Listing.findById(req.params.id).populate('comments', { content: 1, user: 1 });

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

listingsRouter.put('/:id', async (req, res, next) => {
	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token invalid' });
	}

	const listing = await Listing.findById(req.params.id);
	const user = await User.findById(decodedToken.id);

	if (listing.user.toString() !== user.id) {
		return res.status(401).json({ error: 'unauthorized user' });
	}

	Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(updatedListing => {
			res.json(updatedListing);
		})
		.catch(error => next(error));
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