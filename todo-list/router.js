const TodoLists = require('./model');
const TodoItems = require('../todo-item/model');
const router = require('express').Router();

router.post('/', async (req, res) => {
    const todoList = req.body;
    if(!todoList.name) {
        res.status(400).json({ error: 'name is required' });
        return;
    }

    try {
        const createdList = await TodoLists.create(req.jwt.sub, todoList);
        res.status(201).json(createdList);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong creating this todo list' });
    }
});

/**
 * POST /todo-lists/:id/todo-items
 */
router.post('/:id/todo-items', async (req, res) => {
    const { id: todoListId } = req.params;
    const todoItem = req.body;
    if(!todoItem.todo) {
        res.status(400).json({ error: '"todo" is required' });
        return;
    }

    try {
        todoItem.todo_list_id = todoListId;
        const createdTodoItem = await TodoItems.create(todoItem);
        res.status(201).json(createdTodoItem);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong creating this todo item' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const todoList = await TodoLists.getById(id);
        res.status(200).json(todoList);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong getting this todo list' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedTodo = await TodoLists.update(id, updates);
        res.status(200).json(updatedTodo);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong updating this todo' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    // *!* Todo: should only be able to delete if this todo list belongs to you
    try {
        await TodoLists.remove(id);
        res.status(204).send();
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong deleting this todo' });
    }
});

module.exports = router;
