const db = require('../data/db');
const Users = require('./model');

describe('Users model', () => {
    const user = {
        first_name: 'Jim',
        last_name: 'Hopper',
        email: 'hopper@hawkinspd.gov',
        password: 'password123'
    };

    beforeEach(async () => {
        await db('users').truncate();
    });

    test('creating a user', async () => {
        const createdUser = await Users.create(user);
        expect(createdUser).toMatchObject(user);
        expect(createdUser.id).toBeDefined();
    });

    test('getting users', async () => {
        const users = await Users.get();
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(0);
    });

    test('get users should include newly created user', async () => {
        const createdUser = await Users.create(user);
        const  users = await Users.get();
        expect(users).toHaveLength(1);
        expect(users.find(user => user.id === createdUser.id)).toBeDefined();
    });

    test('getting a user by id', async () => {
        const createdUser = await Users.create(user);
        const userById = await Users.getById(createdUser.id);
        expect(userById).toBeDefined();
        expect(userById.id).toBe(createdUser.id);
        expect(userById).toMatchObject(createdUser);
    });

    test('getting a user by email', async () => {
        const createdUser = await Users.create(user);
        const userByEmail = await Users.getByEmail(createdUser.email);
        expect(userByEmail).toBeDefined();
        expect(userByEmail.email).toBe(createdUser.email);
        expect(userByEmail).toMatchObject(createdUser);
    });
});