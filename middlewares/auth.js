const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // decoded = { id, email, role, etc. }
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' }); // use 403 for invalid auth
  }
};

module.exports = auth;

