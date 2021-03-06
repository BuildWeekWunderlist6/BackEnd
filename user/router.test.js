const request = require('supertest');
const server = require('../api/server');
const Users = require('./model');
const db = require('../data/db');
const truncateDb = require('../utils/truncateDb');

describe('/users routes', () => {

    const user = {
        first_name: 'Jim',
        last_name: 'Hopper',
        email: 'hopper@hawkinspd.gov',
        password: 'password123'
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

    describe('POST /users/register', () => {

        test('responds with 400 when body is invalid', async () => {
            await truncateDb();
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
            await truncateDb();
            await Users.create(user);
            const newUser = { ...user };

            const res = await request(server)
                .post('/api/users/register')
                .send(newUser);

            expect(res.status).toBe(409);
        });

        test('responds with 201', async () => {
            await truncateDb();
            const res = await request(server)
                .post('/api/users/register')
                .send(user);
            expect(res.status).toBe(201);
        });

        test('responds with token object', async () => {
            await truncateDb();
            const res = await request(server)
                .post('/api/users/register')
                .send(user);
            expect(res.type).toMatch(/json/i);
            expect(res.body.token).toBeDefined();
            expect(res.body.token.length > 0).toBe(true);
        });

    });

    describe('POST /users/login', () => {

        test('responds with 400 when body is invalid', async () => {
            await truncateDb();
            const res = await request(server)
                .post('/api/users/login')
                .send({
                    email: '',
                    password: ''
                });
            expect(res.status).toBe(400);
        });

        test('responds with 401 if credentials are invalid', async () => {
            await truncateDb();
            const res = await request(server)
                .post('/api/users/login')
                .send({
                    email: 'notauser@notawebsite.com',
                    password: 'password1234'
                });
                
                expect(res.status).toBe(401);
        });

        test('responds with 200', async () => {
            await truncateDb();
            // register a new user
            await request(server)
                .post('/api/users/register')
                .send(user);

            // login with the new user
            const res = await request(server)
                .post('/api/users/login')
                .send({
                    email: user.email,
                    password: user.password
                });
            expect(res.status).toBe(200);
        });

        test('responds with token object', async () => {
            await truncateDb();
            // register a new user
            await request(server)
                .post('/api/users/register')
                .send(user);

            // login with the new user
            const res = await request(server)
                .post('/api/users/login')
                .send({
                    email: user.email,
                    password: user.password
                });
            
            expect(res.type).toMatch(/json/i);
            expect(res.body.token).toBeDefined();
            expect(res.body.token.length > 0).toBe(true);
        });

    });

    describe('GET /users/:id', () => {
        test('responds with correct user', async () => {
            await truncateDb();
            // register a new user
            const registerRes = await request(server)
                .post('/api/users/register')
                .send(user);

            const targetUser = await Users.get();
            const id = targetUser[0].id;
            
            const res = await request(server)
                .get(`/api/users/${id}`)
                .set('Authorization', registerRes.body.token);

            expect(res.status).toBe(200);
            expect(res.type).toMatch(/json/i);
            expect(res.body.id).toBeDefined();

            // expect the id to be the id of user we're requesting
            expect(res.body.id).toBe(id);
            
        });
    });

    describe('PUT /users/:id', () => {
        test('responds with the updated user', async () => {
            await truncateDb();
            // register a new user
            const registerRes = await request(server)
                .post('/api/users/register')
                .send(user);

            const targetUser = await Users.get();
            const id = targetUser[0].id;

            const updates = {
                first_name: 'Jimmy'
            };

            const res = await request(server)
                .put(`/api/users/${id}`)
                .set('Authorization', registerRes.body.token)
                .send(updates);

            expect(res.status).toBe(200);
            expect(res.type).toMatch(/json/i);
            expect(res.body.first_name).toBe(updates.first_name);
        });
    });

});

// *!* TODO: Tests for GET/PUT /users/:id to ensure only the user who belongs to that ID can access