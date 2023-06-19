const FormData = require('form-data');
const fs = require('fs');
const request = require('supertest');
const path = require('path');
const app = require('./app');
const Cat = require('../model/catsModel');
const catRoute = require('../route/CatRoute');
const db = require('./util/db.js');

describe('Cat routes', () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEyM0BhZG1pbi5jb20iLCJyb2xlIjoid29ya2VyIiwiaWF0IjoxNjg3MDY2NzM1fQ.tIK964WJsvke6992OUJGiOJ7fTN24-UFZudPW0O9ZpQ";

    beforeAll(async () => {
        await db.connect();
        console.log(token);
    });

    afterAll(async () => {
        await db.closeDatabase();
    });

    beforeEach(async () => {
        await db.clearDatabase();
    });




    describe('GET /cats/list', () => {
        it('should get information about all cats', async () => {
            // Add test data to the database
            await Cat.create([
                { name: 'Garfield', age: 3, breed: 'Persian', image: 'garfield.jpg' },
                { name: 'Sylvester', age: 5, breed: 'Siamese', image: 'sylvester.jpg' },
                { name: 'Tom', age: 2, breed: 'Tabby', image: 'tom.jpg' },
            ]);

            const response = await request(app).get('/cats/list');

            // Check that the response has a status code of 200
            expect(response.statusCode).toBe(200);

            // Check that the response body is an array
            expect(response.body).toBeInstanceOf(Array);

            // Check that each object in the response has the expected properties
            const cat = response.body[0];
            expect(cat).toHaveProperty('_id');
            expect(cat).toHaveProperty('name');
            expect(cat).toHaveProperty('age');
            expect(cat).toHaveProperty('breed');
            expect(cat).toHaveProperty('image');

            // Check that the image property is a base64-encoded string
            expect(cat.image).toMatch(/^data:image\/jpeg;base64,/);
        });
    });

});






