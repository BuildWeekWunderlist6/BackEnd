const db = require('../db');
const dbUsers = require('../../user/model');
const dbTodoLists = require('../../todo-list/model');
const dbTodoItems = require('../../todo-item/model');
const user = require('../user');
const todoLists = require('../todo-lists');
const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  // Delete seed data
  const userToDelete = await dbUsers.getByEmail(user.email);

  if (userToDelete && userToDelete.id) {

    // Delete user's todos
    const todosToDelete = await dbTodoItems.getByQuery(userToDelete.id, {});
    const listsToDelete = await dbTodoLists.getByUser(userToDelete.id);
    await asyncForEach(todosToDelete, async todo => {
      await db('todo_items')
        .where('id', todo.id)
        .del();
    });

    // delete user's user_todo_list
    await db('user_todo_lists')
      .where('user_id', userToDelete.id)
      .del();

    // delete user's lists
    await asyncForEach(listsToDelete, async list => {
      await db('todo_lists')
        .where('id', list.id)
        .del();
    });

    // delete user
    await dbUsers.remove(userToDelete.id);
  }

  // **** INSERT DATA ****

  // create user
  user.password = bcrypt.hashSync(user.password, 12);
  const createdUser = await dbUsers.create(user);

  //const todoItemPromises = [];

  // create todo lists
  await asyncForEach(todoLists, async list => {
    const createdList = await dbTodoLists.create(createdUser.id, { name: list.name, created_at: list.created_at });

    // create todo items
    await asyncForEach(list.todos, async todo => {
      await dbTodoItems.create({ ...todo, todo_list_id: createdList.id });
    });
  });
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
