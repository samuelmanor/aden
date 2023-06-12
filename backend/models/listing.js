const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	address: String,
	description: String,
	website: String,
	phone: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	],
	identity: {
		type: String,
		required: true
	},
	service: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	}
});

listingSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;