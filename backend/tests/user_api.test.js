const bcrypt = require('bcrypt');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');
const helper = require('./test_helper');

describe('when there is initially one user in db', () => {
	// beforeEach(async () => {
	// 	await User.deleteMany({});

	// 	const user = new User({ username: 'root', password: 'secret' });
	// 	await user.save();
	// });

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'test',
			password: 'password'
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

		const usernames = usersAtEnd.map(u => u.username);
		expect(usernames).toContain(newUser.username);
	});

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'root',
			password: 'password'
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('expected `username` to be unique');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toEqual(usersAtStart);
	});
});