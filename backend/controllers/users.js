const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

// usersRouter.get :id + populate with comments
// also populate listings

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

module.exports = usersRouter;