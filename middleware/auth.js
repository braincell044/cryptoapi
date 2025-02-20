const jwt = require('jsonwebtoken');
const config = require('config');


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error); // <-- Log the token error
        res.status(403).json({ message: "Invalid token" });
    }
};


module.exports = authenticateToken;
