const db = require('../data/db');

const get = () => {
    return db('users');
};

const getById = id => {
    return db('users')
        .where({ id })
        .select('id', 'first_name', 'last_name', 'email')
        .first();
};

const getByEmail = email => {
    return db('users')
        .where({ email })
        .first();
};

const create = async user => {
    const [id] = await db('users').insert(user, 'id');
    return getById(id);
};

const update = async (id, updates) => {
    await db('users')
        .where({ id })
        .update(updates);
    return getById(id);
};

const remove = id => {
    return db('users')
        .where({ id })
        .delete()
        .returning('id');
};

module.exports = {
    get,
    getById,
    getByEmail,
    create,
    update,
    remove
};
