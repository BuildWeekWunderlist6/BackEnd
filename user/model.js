const db = require('../data/db');

const get = () => {
    return db('users');
};

const getById = (id) => {
    return db('users')
        .where({ id })
        .first();
};

const getByEmail = () => {

};

const create = user => {
    return db('users').insert(user, '*');
};

const update = (id, updates) => {

};

const remove = id => {

};

module.exports = {
    get,
    getById,
    getByEmail,
    create,
    update,
    remove
};
