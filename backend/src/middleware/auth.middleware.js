const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    
    if (!token) 
      return res.status(403).send({ status: false, msg: 'Access Denied: No Token Provided!' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    req.user = decoded;
    next();
    
  } catch (error) {
    res.status(400).send({ status: false, msg: 'Invalid Token' });
  }
};