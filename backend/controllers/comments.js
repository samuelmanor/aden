const commentsRouter = require('express').Router();
const Comment = require('../models/comment');
const User = require('../models/user');
const Listing = require('../models/listing');
const jwt = require('jsonwebtoken');

const getTokenFrom = req => {
	const auth = req.get('authorization');
	if (auth && auth.startsWith('Bearer ')) {
		return auth.replace('Bearer ', '');
	}
	return null;
};

commentsRouter.post('/', async (req, res, next) => {
	const body = req.body;

	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token invalid' });
	}

	const user = await User.findById(decodedToken.id);
	const listing = await Listing.findById(body.listingId);

	const comment = new Comment({
		content: body.content,
		user: user._id,
		listing: listing._id
	});

	const savedComment = await comment.save();

	listing.comments = listing.comments.concat(savedComment._id);
	await listing.save();

  await savedComment.populate('user');

	res.json(savedComment);
});

commentsRouter.patch('/:id', async (req, res, next) => {
	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token invalid' });
	}

	const comment = await Comment.findById(req.params.id);
	const user = await User.findById(decodedToken.id);

	if (comment.user.toString() !== user.id) {
		return res.status(401).json({ error: 'unauthorized user' });
	}

	const updatedComment = Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })

  await updatedComment.populate('user');

  res.json(updatedComment);
});

commentsRouter.delete('/:id', async (req, res, next) => {
	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token invalid' });
	}

	const comment = await Comment.findById(req.params.id);
	const user = await User.findById(decodedToken.id);
	const listing = await Listing.findById(req.body.listingId);

	if (comment.user.toString() !== user.id) {
		return res.status(401).json({ error: 'unauthorized user' });
	}

	listing.comments = listing.comments.filter(l => l._id.toString() !== comment._id.toString());

	await listing.save();
	await Comment.findByIdAndRemove(req.params.id);

	res.status(204).end();
});

module.exports = commentsRouter;