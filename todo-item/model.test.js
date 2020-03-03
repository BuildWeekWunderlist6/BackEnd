const db = require('../data/db');
const Users = require('../user/model');
const TodoLists = require('../todo-list/model');
const TodoItems = require('./model');
const truncateDb = require('../utils/truncateDb');

describe('todo-item model', () => {
    let user;
    let list;
    const todoItem = {
        todo: 'Make coffee',
        complete: false,
    };

    beforeEach(async done => {
        await truncateDb();

        user = await Users.create({
            first_name: 'Jim',
            last_name: 'Hopper',
            email: 'hopperbemad@hawkinspd.gov',
            password: 'password123'
        });

        list = await TodoLists.create(user.id, {
            name: 'Hawkins PD Todo'
        });

        done();
    });

    test('creating a todo returns a todo', async done => {
        const createdTodo = await TodoItems.create({ ...todoItem, todo_list_id: list.id });
        
        expect(createdTodo.id).toBeDefined();
        expect(createdTodo).toMatchObject(todoItem);
        done();
    });

    test('getting todos by user', async () => {
        const query = {
            todo_list_id: null,
            by_period: null,
            marked_as: null
        };

        const list1 = await TodoLists.create(user.id, {
            name: 'Hawkins PD Morning Todo'
        });

        const list2 = await TodoLists.create(user.id, {
            name: 'Hawkins PD Afternoon Todo'
        });

        const todoItem2 = {
            todo: 'Make more coffee',
            complete: false
        };

        await TodoItems.create({ ...todoItem, todo_list_id: list1.id });
        await TodoItems.create({ ...todoItem2, todo_list_id: list2.id });

        const todos = await TodoItems.getByQuery(query);

        expect(Array.isArray(todos)).toBe(true);
        expect(todos).toHaveLength(2);
        
    });

    test('getting todos by list id', async done => {
        const createdTodo = await TodoItems.create({ ...todoItem, todo_list_id: list.id });
        const todosByList = await TodoItems.getByList(list.id);

        expect(todosByList).toHaveLength(1);
        expect(todosByList[0]).toMatchObject(createdTodo);
        done();
    });

    test('updating a todo', async done => {
        const createdTodo = await TodoItems.create({ ...todoItem, todo_list_id: list.id });
        const updates = {
            complete: true
        };

        const updatedTodo = await TodoItems.update(createdTodo.id, updates);
        expect(updatedTodo.id).toBe(createdTodo.id);
        expect(updatedTodo).toMatchObject(updates);

        done();
    });

    test('removing a todo', async done => {
        const createdTodo = await TodoItems.create({ ...todoItem, todo_list_id: list.id });
        await TodoItems.remove(createdTodo.id);
        const removedTodo = await TodoItems.getById(createdTodo.id);
        expect(removedTodo).toBeUndefined();
        done();
    });

});