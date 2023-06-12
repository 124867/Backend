const express = require('express');
const router = express.Router();
const charityWorkerController = require('../controllers/charityWorkerController');
const path = require('path');

const authenticateToken = require('../middleware/authenticateToken');

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
router.post('/login', charityWorkerController.login)

module.exports = router;