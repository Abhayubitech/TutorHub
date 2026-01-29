const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        // Handle Bearer token format
        const bearerToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY || "gfg_jwt_secret_key");
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;