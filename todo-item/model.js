const db = require('../data/db');

const getByList = todoListId => {
    return db('todo_items')
        .where('todo_list_id', todoListId);
};

const getByQuery = (userId, query) => {
    const { todo_list_id, by_period, marked_as } = query;
    return db('todo_items as i')
        .innerJoin('todo_lists as l', 'i.todo_list_id', 'l.id')
        .innerJoin('user_todo_lists as u', 'l.id', 'u.todo_list_id')
        .where('u.user_id', userId)
        .select('i.*');

    // var withUserName = function(queryBuilder, foreignKey) {
    //     queryBuilder.leftJoin('users', foreignKey, 'users.id').select('users.user_name');
    //   };
    //   knex.table('articles').select('title', 'body').modify(withUserName, 'articles_user.id').then(function(article) {
    //     console.log(article.user_name);
    //   });
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
