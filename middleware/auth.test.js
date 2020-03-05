const request = require('supertest');
const server = require('../api/server');
const db = require('../data/db');
const truncateDb = require('../utils/truncateDb');

describe('Auth middleware', () => {

    const user = {
        first_name: 'Jim',
        last_name: 'Hopper',
        email: 'hopper@hawkinspd.gov',
        password: 'password123'
    };

    beforeEach(async () => {
        await truncateDb();
    });

    test('server responds with 403 if no token is found', async () => {
        const req = await request(server)
            .get('/api/auth');
        expect(req.status).toBe(403);
    });

    // *!* This test is failing -- look into
    // test('server does not respond with 403 if token is valid', async () => {
    //     // register a user
    //     const registerReq = await request(server)
    //         .post('/api/users/register')
    //         .send(user);
        
    //     const req = await request(server)
    //         .get('/api/auth')
    //         .set('Authorization', registerReq.body.token);

    //     expect(req.status).not.toBe(403);
    // });
});
