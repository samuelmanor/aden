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
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

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
	let user;

	beforeEach(async () => {
		const newUser = {
			username: 'username',
			password: 'password'
		};

		user = await api
			.post('/api/users')
			.send(newUser);

		const result = await api
			.post('/api/login')
			.send(newUser);

		headers = { 'Authorization': `Bearer ${result.body.token}` };
	});

	test('succeeds with valid id and user', async () => {
		const editedUser = { name: 'example user', bio: 'example user bio' };

		await api
			.patch(`/api/users/${user.body.id}`)
			.send(editedUser)
			.set(headers)
			.expect(200);

		const usersAtEnd = await helper.usersInDb();

		const names = usersAtEnd.map(u => u.name);
		expect(names).toContain(editedUser.name);
	});

	test('fails with invalid user', async () => {
		const usersAtStart = await helper.usersInDb();
		const editedUser = { name: 'example user', bio: 'example user bio' };

		await api
			.patch(`/api/users/${user.body.id}`)
			.send(editedUser)
			.expect(401);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toEqual(usersAtStart);

		const names = usersAtEnd.map(u => u.name);
		expect(names).not.toContain(editedUser.name);
	});
});

describe('deleting a specific user', () => {
	let headers;
	let user;

	beforeEach(async () => {
		const newUser = {
			username: 'username',
			password: 'password'
		};

		user = await api
			.post('/api/users')
			.send(newUser);

		const result = await api
			.post('/api/login')
			.send(newUser);

		headers = { 'Authorization': `Bearer ${result.body.token}` };
	});

	test('succeeds with valid user', async () => {
		const usersAtStart = await helper.usersInDb();

		await api
			.delete(`/api/users/${user.body.id}`)
			.set(headers)
			.expect(204);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length - 1);

		const usernames = usersAtEnd.map(u => u.username);
		expect(usernames).not.toContain(user.body.username);
	});

	test('fails with invalid user', async () => {
		const usersAtStart = await helper.usersInDb();

		await api
			.delete(`/api/users/${user.body.id}`)
			.expect(401);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toEqual(usersAtStart);

		const usernames = usersAtEnd.map(u => u.username);
		expect(usernames).toContain(user.body.username);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});