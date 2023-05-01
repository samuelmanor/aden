const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

console.log('connecting to', url);
mongoose.connect(url)
  .then(res => {
    console.log('connected to mongodb');
  })
  .catch((error) => {
    console.log('error connecting to mongodb:', error.message);
  })

const listingSchema = new mongoose.Schema({
  name: String,
  address: String,
  description: String,
  website: String,
  phone: String
});

listingSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Listing', listingSchema);