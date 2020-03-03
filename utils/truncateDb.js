const db = require('../data/db');
module.exports = () => {
    try {
    return db.raw(`
    TRUNCATE TABLE
        user_todo_lists,
        recurring_todos,
        todo_items,
        todo_lists,
        users
        CASCADE`);
    }
    catch(err) {
        console.log('error when truncating database', err);
    }
};

