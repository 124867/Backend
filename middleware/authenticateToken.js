const jwt = require('jsonwebtoken');

function authenticateWorker(req, res, next) {
  // Call the existing authenticateToken middleware to verify the token
  authenticateToken(req, res, () => {
    // Check if the authenticated user is a worker
    if (req.user.role === 'worker') {
      // If the user is a worker, call the next middleware in the chain
      next();
    } else {
      // If the user is not a worker, return a "Not authorized" response with a 403 status code
      return res.status(403).json({ message: 'Not authorized' });
    }
  });
}

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
  authenticateToken,
  authenticateWorker
};
