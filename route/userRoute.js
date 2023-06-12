const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const path = require('path');
const { authenticateToken } = require('../middleware/authenticateToken');

router.get('/home', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'user-home.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

router.post('/login', userController.login);

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
});

router.post("/register", userController.create);

router.get('/favorites', authenticateToken, userController.favourites);

router.put('/favorites/:catId', authenticateToken, userController.addToFavorites);


module.exports = router;