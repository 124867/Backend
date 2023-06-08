/* the protectedController handles the protected endpoints (/public and /charity-worker-only).
 */

const express = require('express');
const jwt = require('jsonwebtoken');
  
const router = express.Router();

const secretKey = 'mysecretkey';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.get('/charity-worker-only', authenticateToken, (req, res) => {
  if (req.user.role === 'charity-worker') {
    res.send('Welcome, charity worker!');
  } else {
    res.status(403).send('Access denied.');
  }
});

router.get('/public', (req, res) => {
  res.send('Welcome, public user!');
});

module.exports = router;