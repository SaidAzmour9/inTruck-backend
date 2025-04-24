const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // decoded = { userId, role, etc. }

    console.log('Decoded user:', req.user); // سجل بيانات المستخدم هنا

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};


module.exports = auth;

