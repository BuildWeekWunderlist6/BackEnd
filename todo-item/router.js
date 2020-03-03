const TodoItems = require('./model');
const router = require('express').Router();

router.get('/', async (req, res) => {
    const userId = req.jwt.sub;
    const query = req.query;
    try {
        const todos = await TodoItems.getByQuery(userId, query);
        res.status(200).json(todos);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong getting todos' });
    }
    
});

module.exports = router;
