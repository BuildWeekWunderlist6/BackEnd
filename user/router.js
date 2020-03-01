const router = require('express').Router();
const Users = require('./model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const user = req.body;

    // ensure user data is valid
    if(!user.first_name
        || !user.last_name
        || !user.email
        || !user.password) {
            // *!* Need some better validation ^^^
            res.status(400).json({ error: 'First & last name, email, and password are required' });
            return;
        }

    // ensure email is not taken
    const userWithEmail = await Users.getByEmail(user.email);

    if(userWithEmail && userWithEmail.id) {
        // user already exists with this email
        res.status(409).json({ error: 'This email is already in use' });
        return;
    }

    // create user and send token
    try {
        user.password = bcrypt.hashSync(user.password, 12);
        const createdUser = await Users.create(user);
        res.status(201).json({ token: '' });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong creating this user' });
    }

});

module.exports = router;
