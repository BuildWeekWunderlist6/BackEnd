const db = require('../data/db');
const TodoLists = require('./model');
const Users = require('../user/model');
const truncateDb = require('../utils/truncateDb');

describe('todo-list model', () => {

    const user = {
        first_name: 'Jim',
        last_name: 'Hopper',
        email: 'hopperbemad@hawkinspd.gov',
        password: 'password123'
    };

    const list = {
        name: 'Hawkins PD Todo'
    };

    beforeEach(async () => {
        await truncateDb();
    });

    test('creating a user returns new user', async () => {
        const createdUser = await Users.create(user);
        const createdList = await TodoLists.create(createdUser.id, list);

        expect(createdList).toBeDefined();
        expect(createdList.created_at).toBeDefined();
        expect(createdList.name).toBe(list.name);
    });

    test('getting a list by id', async () => {
        const [id] = await db('todo_lists').insert(list, 'id');
        const listById = await TodoLists.getById(id);

        expect(listById).toMatchObject(list);
        expect(listById.id).toBe(id);
    });

    test("getting a user's list of todo lists", async () => {
        const createdUser = await Users.create(user);

        const list1 = {
            name: 'Hawkins PD Morning Todo'
        };

        const list2 = {
            name: 'Hawkins PD Afternoon Todo'
        };

        await TodoLists.create(createdUser.id, list1);
        await TodoLists.create(createdUser.id, list2);

        const lists = await TodoLists.getByUser(createdUser.id);

        expect(Array.isArray(lists)).toBe(true);
        expect(lists).toHaveLength(2);

    });

    test('updating a list', async () => {
        const [id] = await db('todo_lists').insert(list, 'id');
        const updates = {
            name: "Hopper's Shopping List"
        };
        const updatedList = await TodoLists.update(id, updates);

        expect(updatedList).toMatchObject(updates);
        expect(updatedList.id).toBe(id);
    });

    test('removing a list', async () => {
        const [id] = await db('todo_lists').insert(list, 'id');
        await TodoLists.remove(id);
        const listById = await TodoLists.getById(id);

        expect(listById).toBeUndefined();
    });
});
