const listingsRouter = require('express').Router();
const Listing = require('../models/listing');

listingsRouter.get('/', async (req, res) => {
	const listings = await Listing.find({});
	res.json(listings);
});

listingsRouter.get('/:id', async (req, res, next) => {
	const listing = await Listing.findById(req.params.id).populate('comments', { content: 1, user: 1 });

	if (listing) {
		res.json(listing);
	} else {
		res.status(404).end();
	}
});

listingsRouter.post('/', async (req, res, next) => {
	const body = req.body;

	const listing = new Listing(body);

	const savedListing = await listing.save();
	res.status(201).json(savedListing);
});

listingsRouter.put('/:id', async (req, res, next) => {
	Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(updatedListing => {
			res.json(updatedListing);
		})
		.catch(error => next(error));
});

listingsRouter.delete('/:id', async (req, res, next) => {
	await Listing.findByIdAndRemove(req.params.id);
	res.status(204).end();
});

module.exports = listingsRouter;