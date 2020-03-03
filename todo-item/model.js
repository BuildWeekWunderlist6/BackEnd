const db = require('../data/db');

const getByList = todoListId => {
    return db('todo_items')
        .where('todo_list_id', todoListId);
};

const getById = id => {
    return db('todo_items')
        .where({ id })
        .first();
};

const create = async todoItem => {
    const [id] = await db('todo_items')
        .insert(todoItem, 'id');
    return getById(id);
};

const update = async (id, updates) => {
    await db('todo_items')
        .where({ id })
        .update(updates);
    return getById(id);
};

const remove = id => {
    return db('todo_items')
        .where({ id })
        .delete();
};

module.exports = {
    getByList,
    getById,
    create,
    update,
    remove
};
