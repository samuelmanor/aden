const express = require('express');
const cors = require('cors');
const app = express();

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

app.use(express.json());
app.use(cors);
app.use(requestLogger);

let listings = [
  {
    id: 1,
    name: 'doc1',
    address: 'address1',
    description: 'desc1',
    website: 'site1',
    phone: 'num1'
  },
  {
    id: 2,
    name: 'doc2',
    address: 'address2',
    description: 'desc2',
    website: 'site2',
    phone: 'num2'
  }
];

const generateId = () => {
  const maxId = listings.length > 0
    ? Math.max(...listings.map(l => l.id))
    : 0
  return maxId + 1;
};

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.get('/api/listings', (req, res) => {
  res.json(listings);
});

app.get('/api/listings/:id', (req, res) => {
  const id = Number(req.params.id);
  const listing = listings.find(l => l.id === id);
  
  if (listing) {
    res.json(listing);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/listings/:id', (req, res) => {
  const id = Number(req.params.id);
  listings = listings.filter(l => l.id !== id);

  res.status(204).end();
});

app.post('/api/listings', (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body.name) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  const listing = { id: generateId(), ...body };

  listings = listings.concat(listing);

  res.json(listing);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});