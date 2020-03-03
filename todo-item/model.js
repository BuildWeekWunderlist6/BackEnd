const db = require('../data/db');

const getByList = todoListId => {
    return db('todo_items')
        .where('todo_list_id', todoListId);
};

const getByQuery = (userId, query) => {
    const { todo_list_id, by_period, marked_as } = query;

    const withTodoList = (queryBuilder, todo_list_id) => {
        if(todo_list_id) {
            queryBuilder.andWhere('l.id', todo_list_id);
        }
    };

    const withMarkedAs = (queryBuilder, marked_as) => {
        if(marked_as === 'complete') {
            queryBuilder.andWhere('i.complete', true);
        }
        else if(marked_as === 'deleted') {
            queryBuilder.whereNotNull('i.deleted_at');
        }
    };

    return db('todo_items as i')
        .innerJoin('todo_lists as l', 'i.todo_list_id', 'l.id')
        .innerJoin('user_todo_lists as u', 'l.id', 'u.todo_list_id')
        .where('u.user_id', userId)
        .modify(withTodoList, todo_list_id)
        .modify(withMarkedAs, marked_as)
        .select('i.*');
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
    getByQuery,
    getById,
    create,
    update,
    remove
};
