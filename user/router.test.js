const request = require('supertest');
const server = require('../api/server');

describe('/users routes', () => {

    describe('POST /users/register', () => {

        const user = {
            first_name: 'Jim',
            last_name: 'Hopper',
            email: 'hopper@hawkinspd.gov',
            password: 'password123'
        };

        test('responds with 201', async () => {
            const res = await request(server)
                .post('/api/users/register')
                .send(user);
            expect(res.status).toBe(201);
        });

    });

});