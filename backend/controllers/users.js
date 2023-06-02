const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = req => {
	const auth = req.get('authorization');

	if (auth && auth.startsWith('Bearer ')) {
		return auth.replace('Bearer ', '');
	}

	return null;
};

// usersRouter.get('/', async (req, res) => {
// 	const users = await User.find({});

// 	res.json(users);
// });

usersRouter.get('/:id', async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		res.json(user);
	} else {
		res.status(404).end();
	}
});

usersRouter.post('/', async (req, res) => {
	const { username, password } = req.body;
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

usersRouter.put('/:id', async (req, res, next) => {
	const body = req.body;

	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token invalid' });
	}

	const userToChange = await User.findById(req.params.id);
	const queryingUser = await User.findById(decodedToken.id);

	if (userToChange.id !== queryingUser.id) {
		return res.status(401).json({ error: 'unauthorized user' });
	}

	User.findByIdAndUpdate(req.params.id, body, { new: true })
		.then(updatedUser => {
			res.json(updatedUser);
		})
		.catch(error => next(error));
});

usersRouter.delete('/:id', async (req, res, next) => {
	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token invalid' });
	}

	const userToChange = await User.findById(req.params.id);
	const queryingUser = await User.findById(decodedToken.id);

	if (userToChange.id !== queryingUser.id) {
		return res.status(401).json({ error: 'unauthorized user' });
	}

	await User.findByIdAndRemove(req.params.id);
	res.status(204).end();
});

module.exports = usersRouter;