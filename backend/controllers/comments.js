const commentsRouter = require('express').Router();
const Comment = require('../models/comment');
const User = require('../models/user');
const Listing = require('../models/listing');

// commentsRouter.get('/', async (req, res) => { // not needed
//   const comments = await Comment.find({}).populate('user', { username: 1, name: 1 });
//   res.json(comments);
// });

commentsRouter.post('/', async (req, res, next) => {
  const body = req.body;

  const user = await User.findById(body.userId);
  const listing = await Listing.findById(body.listingId);

  const comment = new Comment({
    content: body.content,
    user: user.id,
    listing: listing.id
  });

  const savedComment = await comment.save();

  user.comments = user.comments.concat(savedComment._id);
  await user.save();

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

commentsRouter.delete('/:id', async (req, res, next) => {
  await Comment.findByIdAndRemove(req.params.id);
  res.status(204);
});

module.exports = commentsRouter;