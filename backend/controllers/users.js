const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({});

  res.json(users);
});

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

usersRouter.post('/', async (req, res) => {
  const { username, password } = req.body
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
    name: 'newUser',
    bio: ''
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

usersRouter.patch('/:id', async (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    bio: req.body.bio
  }, { new: true })
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(error => next(error));
});

usersRouter.delete('/:id', async (req, res, next) => {
  await User.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = usersRouter;