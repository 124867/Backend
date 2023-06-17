const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../routes/catRoutes');

app.use(express.json());
app.use('/api', router);

describe('GET /cats/list', () => {
    it('should return a list of cats', async () => {
        const res = await request(app).get('/api/cats/list');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                name: expect.any(String),
                breed: expect.any(String),
                age: expect.any(Number),
                image: expect.any(String)
            })
        ]));
    });
});
describe('POST /cats/upload', () => {
    it('should upload information about a cat', async () => {
        const res = await request(app)
            .post('/api/cats/upload')
            .set('Authorization', 'Bearer <access_token>')
            .field('name', 'Fluffy')
            .field('breed', 'Persian')
            .field('age', '3')
            .attach('image', 'test/cat.jpg');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({
            name: 'Fluffy',
            breed: 'Persian',
            age: 3,
            image: expect.any(String)
        }));
    });
});


describe('GET /cats/cat-images/:breed', () => {
    it('should return a list of cat images for a valid breed', async () => {
        const res = await request(app)
            .get('/cats/cat-images/American%20Shorthair'); // Replace with a valid cat breed

        expect(res.status).toBe(200);
        expect(res.body.images).toBeDefined();
        expect(Array.isArray(res.body.images)).toBe(true);
        expect(res.body.images.length).toBeGreaterThan(0);
    });

    it('should return an error message for an invalid breed', async () => {
        const res = await request(app)
            .get('/cats/cat-images/Invalid%20Breed'); // Replace with an invalid cat breed

        expect(res.status).toBe(500);
        expect(res.body.message).toBeDefined();
        expect(res.body.message).toContain('Error retrieving cat images');
    });