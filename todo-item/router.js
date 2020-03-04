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

router.post('/:id/complete', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedTodo = await TodoItems.complete(id);
        res.status(200).json(updatedTodo);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong completing this todo' });
    }

});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    // *!* TODO - Ensure this todo belongs to this user
    try {
        const updatedTodo = await TodoItems.update(id, updates);
        res.status(200).json(updatedTodo);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong updating this todo item' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    // *!* TODO - Ensure this todo belongs to this user
    try {
        await TodoItems.remove(id);
        res.status(204).send();
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong deleting this todo item' });
    }
});

module.exports = router;
