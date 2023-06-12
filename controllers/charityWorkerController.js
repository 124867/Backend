const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const path = require('path');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send('User not found.');
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).send('Incorrect password.');
    }

    const token = jwt.sign({ email, role: user.role }, 'igotoschoolbus');
    if (user.role === 'user') {
      return res.redirect(`/user/home?token=${token}`);
    } else if (user.role === 'charity-worker') {
      return res.redirect(`/charity-worker/home?token=${token}`);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};