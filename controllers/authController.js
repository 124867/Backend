const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

// User registration
router.post('/user/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const user = new User({ username, password: hash, role: 'user' });
      try {
        await user.save();
        res.send('User registered successfully.');
      } catch (err) {
        res.status(500).send(err);
      }
    });
  });
});

// Charity worker registration
router.post('/charity-worker/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const user = new User({ username, password: hash, role: 'charity-worker' });
      try {
        await user.save();
        res.send('Charity worker registered successfully.');
      } catch (err) {
        res.status(500).send(err);
      }
    });
  });
});

// User login
router.post('/user/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, role: 'user' });

    if (!user) {
      return res.status(401).send('User not found.');
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).send('Incorrect password.');
    }

    const token = jwt.sign({ username, role: 'user' }, 'secret');
    res.json({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Charity worker login
router.post('/charity-worker/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, role: 'charity-worker' });

    if (!user) {
      return res.status(401).send('Charity worker not found.');
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).send('Incorrect password.');
    }

    const token = jwt.sign({ username, role: 'charity-worker' }, 'secret');
    res.json({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;