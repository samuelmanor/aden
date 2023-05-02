const listingsRouter = require('express').Router();
const Listing = require('../models/listing');

listingsRouter.get('/', (req, res) => {
	Listing.find({}).then(listings => res.json(listings));
});

listingsRouter.get('/:id', (req, res, next) => {
	Listing.findById(req.params.id).then(listing => {
		if (listing) {
			res.json(listing);
		} else {
			res.status(404).end();
		}
	})
		.catch(error => {
			console.log(error);
			next(error);
		});
});

listingsRouter.post('/', (req, res) => {
	const body = req.body;

	if (body.name === undefined) {
		return res.status(400).json({ error: 'content missing' });
	}

	const listing = new Listing(body);

	listing.save().then(savedListing => {
		res.json(savedListing);
	});
});

listingsRouter.put('/:id', (req, res, next) => {

	Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then(updatedListing => {
			res.json(updatedListing);
		})
		.catch(error => next(error));
});

listingsRouter.delete('/:id', (req, res, next) => {
	Listing.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end();
		})
		.catch(error => next(error));
});

module.exports = listingsRouter;