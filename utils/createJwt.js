const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets');

module.exports = user => {
    const payload = {
        sub: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
    };

    const options = {
        expires: '1d'
    };

    return jwt.sign(payload, jwtSecret, options);
};
