require('express-async-errors');

const express = require('express');
const app = express();

const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const listingsRouter = require('./controllers/listings');
const usersRouter = require('./controllers/users');
const commentsRouter = require('./controllers/comments');

mongoose.set('strictQuery', false);

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB');
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message);
	});

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/listings', listingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/comments', commentsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;