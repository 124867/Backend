const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());

let users = [];

const secretKey = 'mysecretkey';





app.post('/register', (req, res) => {
  const { username, password, role } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      const user = { username, password: hash, role };
      users.push(user);

      res.send('User registered successfully.');
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  const user = users.find(user => user.username === username);

  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ username, role }, secretKey);
        res.json({ token });
      } else {
        res.status(401).send('Invalid username or password.');
      }
    });
  } else {
    res.status(401).send('Invalid username or password.');
  }
});

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

app.get('/charity-worker-only', authenticateToken, (req, res) => {
  if (req.user.role === 'charity-worker') {
    res.send('Welcome, charity worker!');
  } else {
    res.status(403).send('Access denied.');
  }
});

app.get('/public', (req, res) => {
  res.send('Welcome, public user!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});