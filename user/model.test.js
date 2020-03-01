const db = require('../data/db');
const Users = require('./model');

describe('Users model', () => {

    beforeEach(async () => {
        await db('users').truncate();
    });

    test('creating a user', async () => {
        const user = {
            first_name: 'Jim',
            last_name: 'Hopper',
            email: 'hopper@hawkinspd.gov',
            password: 'password123'
        };

        const [createdUser] = await Users.create(user);
        expect(createdUser).toMatchObject(user);
        expect(createdUser.id).toBeDefined();
    });
});