const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const secret = 'igotoschoolbybus';
  const decoded = jwt.verify(token, secret);
  req.user = decoded;
  next();
  } catch (error) {
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
}

module.exports = {
  authenticateToken
};