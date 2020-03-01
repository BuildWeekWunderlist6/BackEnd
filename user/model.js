const db = require('../data/db');

const get = () => {

};

const getById = () => {

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
