const request = require('supertest');
const app = require('../route/CatRoute');
// assuming the app is defined in a separate file

describe('Cat routes', () => {
    let token;

    beforeAll(async () => {

        const response = await request(app)
            .post('/login')
            .send({ username: '123@a.com', password: 'igotoschoolbybus' });
        token = response.body.token;
    });

    /* describe('POST /cats/upload', () => {
        it('should upload information about a cat', async () => {
            const response = await request(app)
                .post('/cats/upload')
                .set('Authorization', `Bearer ${token}`)
                .field('name', 'Garfield')
                .field('breed', 'Persian')
                .field('age', 5)
                .attach('image', 'test/cat.jpg');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Successfully uploaded information about a cat');
        });
    }); */

    describe('GET /cats/list', () => {
        it('should get information about all cats', async () => {
            const response = await request(app)
                .get('/cats/list');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('cats');
            expect(response.body.cats).toBeInstanceOf(Array);
        });
    });

    describe('DELETE /cats/:id', () => {
        let catId;

        beforeAll(async () => {
            // create a cat to delete
            const response = await request(app)
                .post('/cats/upload')
                .set('Authorization', `Bearer ${token}`)
                .field('name', 'Whiskers')
                .field('breed', 'Siamese')
                .field('age', 3)
                .attach('image', 'test/cat.jpg');
            catId = response.body.catId;
        });

        it('should delete information about a cat with the specified ID', async () => {
            const response = await request(app)
                .delete(`/cats/${catId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Successfully deleted information about a cat');
        });
    });

    describe('PUT /cats/:id', () => {
        let catId;

        beforeAll(async () => {
            // create a cat to update
            const response = await request(app)
                .post('/cats/upload')
                .set('Authorization', `Bearer ${token}`)
                .field('name', 'Socks')
                .field('breed', 'Calico')
                .field('age', 2)
                .attach('image', 'test/cat.jpg');
            catId = response.body.catId;
        });

        it('should update information about a cat with the specified ID', async () => {
            const response = await request(app)
                .put(`/cats/${catId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Mittens',
                    breed: 'Tabby',
                    age: 3,
                });
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Successfully updated information about a cat');
        });
    });

    describe('GET /cats/:catId', () => {
        let catId;

        beforeAll(async () => {
            // create a cat to get information about
            const response = await request(app)
                .post('/cats/upload')
                .set('Authorization', `Bearer ${token}`)
                .field('name', 'Fluffy')
                .field('breed', 'Maine Coon')
                .field('age', 4)
                .attach('image', 'test/cat.jpg');
            catId = response.body.catId;
        });

        it('should get information about a cat with the specified ID', async () => {
            const response = await request(app)
                .get(`/cats/${catId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('cat');
            expect(response.body.cat).toHaveProperty('name', 'Fluffy');
            expect(response.body.cat).toHaveProperty('breed', 'Maine Coon');
            expect(response.body.cat).toHaveProperty('age', 4);
        });
    });

    describe('GET /cats/cat-images/:breed', () => {
        it('should get a random image of a cat of the specified breed', async () => {
            const response = await request(app)
                .get('/cats/cat-images/Persian');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('images');
            expect(response.body.images).toBeInstanceOf(Array);
        });
    });
});
