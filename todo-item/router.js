const TodoItems = require('./model');
const moment = require('moment');
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

// completes a todo, and does crazy stuff if it's a recurring todo
router.post('/:id/complete', async (req, res) => {
    const { id } = req.params;
    const thisTodo = await TodoItems.getById(id);
    if(thisTodo.recur_interval && thisTodo.recur_unit) {
        // this todo is recurring
    }
    else {
        // this todo is not recurring
        const updates = {
            complete: !thisTodo.complete,
            completed_at: thisTodo.complete ? null : moment().format('YYYY-MM-DD h:mm:ss a')
        };

        try {
            const updatedTodo = await TodoItems.update(id, updates);
            res.status(200).json(updatedTodo);
        }
        catch(err) {
            console.log(err);
            res.status(500).json({ error: 'Something went wrong completing this todo item' });
        }
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
