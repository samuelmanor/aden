const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	address: String,
	description: String,
	website: String,
	phone: String
});

listingSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Listing', listingSchema);