const db = require('../data/db');
const Users = require('./model');
const truncateDb = require('../utils/truncateDb');

describe('Users model', () => {
    const user = {
        first_name: 'Jim',
        last_name: 'Hopper',
        email: 'hopper@hawkinspd.gov',
        password: 'password123'
    };

    const userWithoutPwd = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
    };

    // beforeEach(async done => {
    //     try {
    //         await truncateDb();
    //         done();
    //     }
    //     catch(err) {
    //         console.log(err);
    //     }
    // });

    test('creating a user', async done => {
        await truncateDb();
        const createdUser = await Users.create(user);
        expect(createdUser).toMatchObject(userWithoutPwd);
        expect(createdUser.id).toBeDefined();
        done();
    });

    test('getting users', async done => {
        await truncateDb();
        const users = await Users.get();
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(0);
        done();
    });

    test('get users should include newly created user', async done => {
        await truncateDb();
        const createdUser = await Users.create(user);
        const  users = await Users.get();
        expect(users.find(user => user.id === createdUser.id)).toBeDefined();
        done();
    });

    test('getting a user by id', async done => {
        await truncateDb();
        const createdUser = await Users.create(user);
        const userById = await Users.getById(createdUser.id);
        expect(userById).toBeDefined();
        expect(userById.id).toBe(createdUser.id);
        expect(userById).toMatchObject(createdUser);
        done();
    });

    test('getting a user by email', async done => {
        await truncateDb();
        const createdUser = await Users.create(user);
        const userByEmail = await Users.getByEmail(createdUser.email);
        expect(userByEmail).toBeDefined();
        expect(userByEmail.email).toBe(createdUser.email);
        expect(userByEmail).toMatchObject(createdUser);
        done();
    });

    test('updating a user', async done => {
        await truncateDb();
        const createdUser = await Users.create(user);
        const updates = {
            first_name: 'Jimmy'
        };
        const updatedUser = await Users.update(createdUser.id, updates);
        expect(updatedUser).toBeDefined();
        expect(updatedUser.first_name).toBe(updates.first_name);
        done();
    });

    test('removing a user', async done => {
        await truncateDb();
        const createdUser = await Users.create(user);
        let users = await Users.get();
        expect(users).toHaveLength(1);

        // ensure correct return
        const [removed] = await Users.remove(createdUser.id);
        expect(removed > 0).toBe(true);
        
        // ensure user was actually removed
        users = await Users.get();
        expect(users).toHaveLength(0);
        done();
    });
});