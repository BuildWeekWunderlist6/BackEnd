const db = require('../data/db');
const moment = require('moment');
const RecurringTodos = require('../recurring_todo/model');

const getByList = todoListId => {
    return db('todo_items')
        .where('todo_list_id', todoListId);
};

const getByQuery = (userId, query) => {
    const { todo_list_id, by_period, marked_as } = query;

    // gets todos by list id
    const withTodoList = (queryBuilder, todo_list_id) => {
        if(todo_list_id) {
            queryBuilder.andWhere('l.id', todo_list_id);
        }
    };

    // gets todos by period (for the day, for the month)
    const withByPeriod = (queryBuilder, by_period) => {
        if(by_period === 'month') {
            queryBuilder.andWhere(db.raw("i.complete_by <= CURRENT_DATE + INTERVAL '30 day'"));
        }
        else if(by_period === 'day') {
            queryBuilder.andWhere(db.raw("i.complete_by <= CURRENT_DATE + INTERVAL '1 day'"));
        }
    }

    // gets todos that are marked as complete or deleted,
    // also ensures that deleted todos don't show up otherwise
    const withMarkedAs = (queryBuilder, marked_as) => {
        if(marked_as === 'complete') {
            queryBuilder
                .andWhere('i.complete', true)
                .andWhere('i.deleted_at', null);
        }
        else if(marked_as === 'deleted') {
            queryBuilder.whereNotNull('i.deleted_at');
        }
        else {
            queryBuilder.andWhere('i.deleted_at', null);
        }
    };

    return db('todo_items as i')
        .innerJoin('todo_lists as l', 'i.todo_list_id', 'l.id')
        .innerJoin('user_todo_lists as u', 'l.id', 'u.todo_list_id')
        .where('u.user_id', userId)
        .modify(withTodoList, todo_list_id)
        .modify(withMarkedAs, marked_as)
        .modify(withByPeriod, by_period)
        .select('i.*');
};

const getById = id => {
    return db('todo_items')
        .where({ id })
        .first();
};

const create = async todoItem => {
    const [id] = await db('todo_items')
        .insert(todoItem, 'id');
    return getById(id);
};

const update = async (id, updates) => {
    await db('todo_items')
        .where({ id })
        .update(updates);
    return getById(id);
};

/**
 * Completes a todo by its ID. Works with recurring and non-recurring
 * @param {int} id - id of the todo 
 */
const complete = async id => {
    const completedAt = moment().format('YYYY-MM-DD h:mm:ss a');

    const thisTodo = await getById(id);
    if(thisTodo.recur_interval && thisTodo.recur_unit) {
        // this todo is recurring
        const recurringTodo = {
            todo_item_id: id,
            completed_at: completedAt
        };

        await RecurringTodos.create(recurringTodo);

        // calculate what the next date should be based on the created date of the task

        // get the complete by date or the date that this todo was created,
        // and use it to increment up to the next completion date
        let dateIncr = moment(thisTodo.complete_by || thisTodo.created_at);
        const now = moment();
        let timeUnit;

        switch(thisTodo.recur_unit.toLowerCase()) {
            case 'd':
                timeUnit = 'days';
                break;
            case 'w':
                timeUnit = 'weeks';
                break;
            case 'm':
                timeUnit = 'months';
                break;
        }

        // while the incremented date is before today
        while(dateIncr.isBefore(now)) {
            dateIncr = dateIncr.add(thisTodo.recur_interval, timeUnit); // <-- 3 'days', 2 'weeks', 4 'months', etc.
            break;
        }
        // if the date has not incremented, it means the user is ahead of schedule in completing
        // the recurring task, and we need to manually increment
        if(!dateIncr.isAfter(moment(thisTodo.complete_by || thisTodo.created_at))) {
            dateIncr = dateIncr.add(thisTodo.recur_interval, timeUnit); // <-- 3 'days', 2 'weeks', 4 'months', etc.
        }

        const updates = {
            complete_by: dateIncr.format('YYYY-MM-DD h:mm:ss a')
        };
        
        return update(id, updates);

    }
    else {
        // this todo is not recurring
        const updates = {
            complete: !thisTodo.complete,
            completed_at: thisTodo.complete ? null : completedAt
        };
        
        return update(id, updates);
    }
};

const remove = id => {
    return db('todo_items')
        .where({ id })
        .update('deleted_at', db.raw('CURRENT_DATE'));
};

module.exports = {
    getByList,
    getByQuery,
    getById,
    create,
    update,
    complete,
    remove
};
