const router = require('express').Router();
const Users = require('./model');

router.post('/register', async (req, res) => {
    const user = req.body;
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

    res.status(201).json({ token: '' });
});

module.exports = router;
