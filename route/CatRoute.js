const express = require('express');
const router = express.Router();
const Cats = require('../controllers/CatController');
const { authenticateToken, authenticateWorker } = require('../middleware/authenticateToken');

/**
 * @openapi
 * 
 * /cats/upload:
 *   post:
 *     summary: Upload information about a cat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: integer
 *               image:
 *                 type: string
 *             required:
 *               - name
 *               - breed
 *               - age
 *     responses:
 *       '200':
 *         description: Successfully uploaded information about a cat
 *         content:
 *           application/json:
 */
router.post('/upload', authenticateWorker, Cats.upload);

/**
 * @openapi
 * 
 * /cats/list:
 *   get:
 *     summary: Get information about all cats
 *     responses:
 *       '200':
 *         description: Successfully retrieved information about all cats
 *         content:
 *           application/json:
 */
router.get('/list', Cats.list);

/**
 * @openapi
 * 
 * /cats/{id}:
 *   delete:
 *     summary: Delete information about a cat with the specified ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cat
 *     responses:
 *       '200':
 *         description: Successfully deleted information about a cat
 */
router.delete('/:id', authenticateWorker, Cats.delete);

/**
 * @openapi
 * 
 * /cats/{id}:
 *   put:
 *     summary: Update information about a cat with the specified ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: integer
 *               image:
 *                 type: string
 *             example:
 *               name: Kitty
 *               breed: American Shorthair
 *               age: 2
 *     responses:
 *       '200':
 *         description: Successfully updated information about a cat
 */
router.put('/:id', authenticateWorker, Cats.update);

/**
 * @openapi
 * 
 * /cats/{catId}:
 *   get:
 *     summary: Get information about a cat with the specified ID
 *     parameters:
 *       - name: catId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cat
 *     responses:
 *       '200':
 *         description: Successfully retrieved information about a cat
 */
router.get('/:catId', Cats.get);

/**
 * @openapi
 * 
 * /cats/cat-images/{breed}:
 *   get:
 *     summary: Get a random image of a cat of the specified breed
 *     parameters:
 *       - name: breed
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Breed of the cat
 *     responses:
 *       '200':
 *         description: Successfully retrieved an image of a cat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/cat-images/:breed', async (req, res) => {
    const breed = req.params.breed;
    try {
        const images = await Cats.getCatImagesByBreed(breed);
        res.status(200).json({ images });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving cat images' });
    }
});

module.exports = router;