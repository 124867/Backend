const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('./app');
const User = require('../model/userModel');
const Cat = require('../model/catsModel');
const db = require('./util/db.js');
const jwt = require('jsonwebtoken');

describe('user routes', () => {
    let token;
    const saltRounds = 10;

    beforeAll(async () => {
        await db.connect();
        const secret = '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';
        const password = '123456';
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ email: 'testuser@test.com', password: hashedPassword });
        token = jwt.sign({ email: user.email, role: user.role }, secret, { algorithm: 'HS256' });
        const CorrectToken = "";
        const catId = "";
    });

    afterAll(async () => {
        await db.closeDatabase();
    });

    beforeEach(async () => {
        await db.clearDatabase();
    });

    describe('POST /user/register', () => {
        it('should return 200 and create a new user', async () => {

            const res = await request(app)
                .post('/user/register')
                .send({ email: 'testuser@test.com', password: '123456' })
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(200);
            expect(res.text).toBe('User registered successfully.');
        });
    });

    describe('POST /user/login', () => {
        it('should return 200 and a token with valid credentials', async () => {
            const password = '123456';
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await User.create({ email: 'testuser@test.com', password: hashedPassword });
            const res = await request(app)
                .post('/user/login')
                .send({ email: 'testuser@test.com', password: '123456' })
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            CorrectToken = res.body.token; // Update the token variable with the newly generated token
        });

        it('should return 401 with invalid credentials', async () => {
            const res = await request(app)
                .post('/user/login')
                .send({ email: 'testuser@test.com', password: 'wrongpassword' })
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(401);
        });
    });

    describe('GET /user/favorites', () => {

        it('should return 401 without auth token', async () => {
            const res = await request(app).get('/user/favorites');

            expect(res.status).toBe(401);
        });
    });
});
