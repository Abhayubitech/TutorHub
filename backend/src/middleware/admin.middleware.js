module.exports = function (req, res, next) {
    
    if (!req.user) {
        return res.status(401).json({ message: "Authorization required" });
    }
    
    if (req.user.role === 'admin') {
        next(); 
    } else {
        return res.status(403).json({ message: "Access Denied! Admins only." });
    }
};