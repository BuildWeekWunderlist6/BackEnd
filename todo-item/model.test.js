const db = require('../data/db');

describe('todo-item model', () => {
    beforeEach(async () => {
        await db.raw('TRUNCATE TABLE user_todo_lists, todo_items, todo_lists, users CASCADE');
    });

    test('creating a todo returns a todo', async () => {

    });
});