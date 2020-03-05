const db = require('../data/db');
const knexCleaner = require('knex-cleaner');

module.exports = () => {
    try {
        const options = {
            mode: 'truncate', // Valid options 'truncate', 'delete'
            restartIdentity: true, // Used to tell PostgresSQL to reset the ID counter
          }

        return knexCleaner.clean(db, options);
        // await db('todo_items').del();
        // await db('user_todo_lists').del();
        // await db('todo_lists').del();
        // await db('users').del();
    }
    catch(err) {
        console.log('error when truncating database', err);
    }
};


// SELECT * FROM todo_items;
// SELECT * FROM user_todo_lists;
// SELECT * FROM todo_lists;
// SELECT * FROM users;
