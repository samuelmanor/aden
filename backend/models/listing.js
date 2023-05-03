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
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

// listingSchema.pre('deleteMany', function() {
//   // let listing = this;
//   // listing.model('Comment').deleteOne({ comment: comment._id });
// });

listingSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;