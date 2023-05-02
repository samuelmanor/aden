const commentsRouter = require('express').Router();
const Comment = require('../models/comment');
const User = require('../models/user');
const Listing = require('../models/listing');

commentsRouter.get('/', async (req, res) => {
  const comments = await Comment.find({});
  res.json(comments);
});

commentsRouter.post('/', async (req, res, next) => { // listing ?
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
  listing.comments = listing.comments.concat(savedComment._id);
  
  res.status(201).json(savedComment);
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