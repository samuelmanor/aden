const commentsRouter = require('express').Router();
const Comment = require('../models/comment');
const User = require('../models/user');
const Listing = require('../models/listing');
const jwt = require('jsonwebtoken');

// commentsRouter.get('/', async (req, res) => { // not needed
//   const comments = await Comment.find({}).populate('user', { username: 1, name: 1 });
//   res.json(comments);
// });

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
    user: user.id,
    listing: listing.id
  });

  const savedComment = await comment.save();

  // user.comments = user.comments.concat(savedComment._id);
  // await user.save();

  listing.comments = listing.comments.concat(savedComment._id);
  await listing.save();

  res.json(savedComment);
});

commentsRouter.put('/:id', async (req, res, next) => {
  Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedComment => {
      res.json(updatedComment);
    })
    .catch(error => next(error));
});

commentsRouter.delete('/:id', async (req, res, next) => { // in body: listingId, userId
  const comment = await Comment.findById(req.params.id);
  const user = await User.findById(req.body.userId);
  const listing = await Listing.findById(req.body.listingId);

  user.comments = user.comments.filter(c => c._id.toString() !== comment._id.toString());
  listing.comments = listing.comments.filter(l => l._id.toString() !== comment._id.toString());

  await user.save();
  await listing.save();

  await Comment.findByIdAndRemove(req.params.id);
});

module.exports = commentsRouter;