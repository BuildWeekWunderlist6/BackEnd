const request = require('supertest');
const server = require('../api/server');
const Users = require('./model');
const db = require('../data/db');

describe('/users routes', () => {

    describe('POST /users/register', () => {

        const user = {
            first_name: 'Jim',
            last_name: 'Hopper',
            email: 'hopper@hawkinspd.gov',
            password: 'password123'
        };

        beforeEach(async () => {
            await db('users').truncate();
        });

        test('responds with 400 when body is invalid', async () => {
            const invalidUser = {
                email: '',
                password: ''
            };
            const res = await request(server)
                .post('/api/users/register')
                .send(invalidUser);
            expect(res.status).toBe(400);
        });

        test('responds with 409 when email is already in use', async () => {
            await Users.create(user);
            const newUser = { ...user };

            const res = await request(server)
                .post('/api/users/register')
                .send(newUser);

            expect(res.status).toBe(409);
        });

        test('responds with 201', async () => {
            const res = await request(server)
                .post('/api/users/register')
                .send(user);
            expect(res.status).toBe(201);
        });

        test('responds with token object', async () => {
            const res = await request(server)
                .post('/api/users/register')
                .send(user);
            expect(res.type).toMatch(/json/i);
            expect(res.body.token).toBeDefined();
            expect(res.body.token.length > 0).toBe(true);
        });

    });

});