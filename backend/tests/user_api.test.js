const bcrypt = require('bcrypt');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');
const helper = require('./test_helper');

beforeEach(async () => {
	await User.deleteMany({});

	const user = new User({ username: 'root', password: 'secret' });
	await user.save();
});

describe('creating a user', () => {
	test('succeeds with unique username', async () => {
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

	test('fails if username is already taken', async () => {
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

describe('editing a user', () => {
	let headers;
	let validUser;

	beforeEach(async () => {
		const newUser = {
			username: 'username',
			password: 'password'
		};

		validUser = await api
			.post('/api/users')
			.send(newUser);

		const result = await api
			.post('/api/login')
			.send(newUser);

		headers = { 'Authorization': `Bearer ${result.body.token}` };
	});

	test('succeeds with valid user', async () => {
		await api
			.patch(`/api/users/${validUser.body.id}`, { name: 'example user', bio: 'example user bio' })
			.set(headers)
			.expect(200);
	});

	test('rejects invalid user', async () => {
		const invalidUser = {
			username: 'name',
			password: 'password'
		};

		await api
			.post('/api/users')
			.send(invalidUser);

		const result = await api
			.post('/api/login')
			.send(invalidUser);

		headers = { 'Authorization': `Bearer ${result.body.token}` };

		await api
			.patch(`/api/users/${validUser.body.id}`, { name: 'example name', bio: 'example user bio' })
			.set(headers)
			.expect(401);
	});
});

describe('deleting a specific user', () => {
	let headers;
	let validUser;

	beforeEach(async () => {
		const newUser = {
			username: 'username',
			password: 'password'
		};

		validUser = await api
			.post('/api/users')
			.send(newUser);

		const result = await api
			.post('/api/login')
			.send(newUser);

		headers = { 'Authorization': `Bearer ${result.body.token}` };
	});

	test('a valid user can delete themselves', async () => {
		await api
			.delete(`/api/users/${validUser.body.id}`)
			.set(headers)
			.expect(204);
	});

	test('an invalid user cannot delete a user', async () => {
		const invalidUser = {
			username: 'name',
			password: 'password'
		};

		await api
			.post('/api/users')
			.send(invalidUser);

		const result = await api
			.post('/api/login')
			.send(invalidUser);

		headers = { 'Authorization': `Bearer ${result.body.token}` };

		await api
			.delete(`/api/users/${validUser.body.id}`)
			.set(headers)
			.expect(401);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});