const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Bearer <token>'
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded; // Attach user info to request
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = auth;


