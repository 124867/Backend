const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const directMessageController = require('../controllers/DirectMessageController');
const path = require('path');
const { authenticateToken } = require('../middleware/authenticateToken');

/* user success login main page */

router.get('/home', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'user-home.html'));
});

/* user login */

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

router.post('/login', userController.login);

/* user register */

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
});

router.post("/register", userController.create);

/* user favorites */

router.get('/favorites', authenticateToken, userController.favourites);

router.put('/favorites/:catId', authenticateToken, userController.addToFavorites);

router.delete('/favorites/:catId', authenticateToken, userController.removeFromFavorites);

/* user comment */

router.post('/send-direct-message/:catId', authenticateToken, directMessageController.sendDirectMessage);

module.exports = router;