const db = require('../data/db');
module.exports = async () => {
    try {
        await db('todo_items').del();
        await db('user_todo_lists').del();
        await db('todo_lists').del();
        await db('users').del();
    }
    catch(err) {
        console.log('error when truncating database', err);
    }
};


// SELECT * FROM todo_items;
// SELECT * FROM user_todo_lists;
// SELECT * FROM todo_lists;
// SELECT * FROM users;
