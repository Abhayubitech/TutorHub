const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token =
    req.headers[process.env.TOKEN_HEADER_KEY] ||
    req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
