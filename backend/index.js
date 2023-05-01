require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const Listing = require('./models/listing');

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get('/api/listings', (req, res) => {
  Listing.find({}).then(listings => res.json(listings));
});

app.get('/api/listings/:id', (req, res, next) => {
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

app.delete('/api/listings/:id', (req, res, next) => {
  Listing.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/listings', (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: 'content missing' });
  }

  const listing = new Listing(body);

  listing.save().then(savedListing => {
    res.json(savedListing);
  });
});

app.put('/api/listings/:id', (req, res, next) => {

  Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedListing => {
      res.json(updatedListing);
    })
    .catch(error => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});