const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const directMessageController = require('../controllers/DirectMessageController');
const path = require('path');
const jwt = require('jsonwebtoken');

const { authenticateToken, authenticateWorker } = require('../middleware/authenticateToken');
const passport = require('../middleware/passport').passport;
/** 
* @openapi
* tags:
 *   name: Users
 *   description: The Users managing API
*/
/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         role:
 *           type: string
 *           description: The role of the user
 *           enum: [user, worker]
 *           default: user
 *         favorites:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Cats'
 *           description: The favorite cats of the user
 *         googleId:
 *           type: string
 *           description: The Google ID of the user
 */

// User login
/**
 * @openapi
 * 
 * /login:
 *   post:
 *     tags: [Users]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login successful, return JWT token
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 token:
 *                   type: string
 */

router.post('/login', userController.login);
// Google login
/**
 * @openapi
 * 
 * /auth/google:
 *   get:
 *     tags: [Users]
 *     summary: Log in using a Google account
 *     parameters:
 *       - name: redirect_uri
 *         in: query
 *         schema:
 *           type: string
 *         example: https://example.com/auth/google/callback
 *         description: Redirect URI to receive authorization code
 *     responses:
 *       '302':
 *         description: Redirect to Google OAuth2 authorization page
 */
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
// Google login callback
/**
 * @openapi
 * 
 * /auth/google/callback:
 *   get:
 *     tags: [Users]
 *     summary: Google login callback
 *     parameters:
 *       - name: code
 *         in: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code to obtain access token
 *     responses:
 *       '302':
 *         description: Redirect to user homepage
 */
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const user = req.user;
    const secret = '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';
    const token = jwt.sign({ email: user.email, role: user.role }, secret, { algorithm: 'HS256' });
    const redirectUrl = `https://petshelterfrontend.qwe1qwe2.repl.co/user-homepage?token=${token}&code=${req.query.code}`;
    res.redirect(redirectUrl);
});

// User registration
/**
 * @openapi
 * 
 * /register:
 *   post:
 *     tags: [Users]
 *     summary: User registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Registration successful
 */


router.post("/register", userController.create);

// User favorites
/**
 * @openapi
 * 
 * /favorites:
 *   get:
 *     tags: [Users]
 *     summary: Get the favorite list of the current user
 *     responses:
 *       '200':
 *         description: Return the list of favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cat'
 *
 * /favorites/{catId}:
 *   put:
 *     tags: [Users]
 *     summary: Add the specified cat to the favorites list
 *     parameters:
 *       - name: catId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cat
 *     responses:
 *       '200':
 *         description: Added successfully
 *
 *   delete:
 *     tags: [Users]
 *     summary: Remove the specified cat from the favorites list
 *     parameters:
 *       - name: catId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cat
 *     responses:
 *       '200':
 *         description: Removed successfully
 */

router.get('/favorites', authenticateToken, userController.favourites);

router.put('/favorites/:catId', authenticateToken, userController.addToFavorites);

router.delete('/favorites/:catId', authenticateToken, userController.removeFromFavorites);

// User comments
/**
 * @openapi
 * 
 * /send-direct-message/{catId}:
 *   post:
 *     tags: [Users]
 *     summary: Send a direct message to the specified cat
 *     parameters:
 *       - name: catId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               message:
 *                 type: string
 *             required:
 *               - message
 *     responses:
 *       '200':
 *         description: Message sent successfully
 *
 * /direct-messages/{catId}:
 *   get:
 *     tags: [Users]
 *     summary: Get all direct message history for the specified cat
 *     parameters:
 *       - name: catId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cat
 *     responses:
 *       '200':
 *         description: Return the list of direct messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   author:
 *                     type: string
 *                   message:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *
 * /messages/{messageId}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete the specified direct message
 *     parameters:
 *       - name: messageId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the direct message
 *     responses:
 *       '200':
 *         description: Message deleted successfully
 */

router.post('/send-direct-message/:catId', authenticateToken, directMessageController.sendDirectMessage);

router.get('/direct-messages/:catId', directMessageController.getDirectMessagesForCat);

router.delete('/messages/:messageId', authenticateWorker, directMessageController.deleteDirectMessage);




module.exports = router;