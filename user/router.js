const router = require('express').Router();
const Users = require('./model');
const bcrypt = require('bcryptjs');
const createJwt = require('../utils/createJwt');
const auth = require('../middleware/auth');

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
        const jwt = createJwt(createdUser);
        res.status(201).json({
            message: 'Success',
            token: jwt
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong creating this user' });
    }

});

router.post('/login', async (req, res) => {
    const credentials = req.body;

    // ensure credentials are in body
    if(!credentials.email || !credentials.password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    // ensure credentials are valid
    const userWithThisEmail = await Users.getByEmail(credentials.email);
    if(userWithThisEmail && bcrypt.compareSync(credentials.password, userWithThisEmail.password)) {

        // user is valid, respond with token
        const jwt = createJwt(userWithThisEmail);
        res.status(200).json({
            message: 'Success',
            token: jwt
        });

    }
    else {
        // user credentials are not valid
        res.status(401).json({ error: 'Credentials are invalid' });
    }

});

router.get('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const userById =  await Users.getById(id);
        res.status(200).json(userById);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong getting this user' });
    }
});

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const  updatedUser = await Users.update(id, updates);

    res.status(200).json(updatedUser);
});

module.exports = router;
