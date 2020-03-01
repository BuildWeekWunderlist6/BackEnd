const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if(!err) {
            req.jwt = decoded;
            next();
        }
        else {
            res.status(403).json({ error: 'User is not authorized for this resource' });
        }
    });
};
