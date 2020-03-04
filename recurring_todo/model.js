const db = require('../data/db');

const create = recurring_todo => {
    return db('recurring_todos').insert(recurring_todo);
};

const deleteByTodoItemId = todoItemId => {
    return db('recurring_todos')
        .where('todo_item_id', todoItemId)
        .delete();
};

module.exports = {
    create,
    deleteByTodoItemId
};
