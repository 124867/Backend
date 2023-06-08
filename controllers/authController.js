const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

router.post('/register', (req, res) => {
  const { username, password, role } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const user = new User({ username, password: hash, role });
      try {
        await user.save();
        res.send('User registered successfully.');
      } catch (err) {
        res.status(500).send(err);
      }
    });
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).send('User not found.');
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).send('Incorrect password.');
    }

    const token = jwt.sign({ username, role: user.role }, 'secret');
    res.json({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;