const db = require('../data/db');

const getByUser = userId => {
    return db('todo_lists as l')
        .innerJoin('user_todo_lists as u', 'l.id', 'u.todo_list_id')
        .where('u.user_id', userId);
};

const getById = id => {
    return db('todo_lists')
        .where({ id })
        .first();
};

const create = async (userId, list) => {
    const [id] = await db('todo_lists').insert(list, 'id');

    const todoListUser = {
        user_id: userId,
        todo_list_id: id,
        owner: true
    };

    await db('user_todo_lists').insert(todoListUser);

    return getById(id);
};

const update = async (id, updates) => {
    await db('todo_lists')
        .where({ id })
        .update(updates);
    return getById(id);
};

const remove = id => {
    return db('todo_lists')
        .where({ id })
        .del();
};

const addUserToList = (userId, id) => {
    // *!* STRETCH Todo
};

module.exports = {
    getByUser,
    getById,
    create,
    update,
    remove
};