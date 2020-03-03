
exports.up = function(knex) {
    return knex.schema
        .createTable('todo_lists', tbl => {
            tbl.increments();
            tbl.string('name', 255)
                .notNullable()
                .index();
            tbl.datetime('created_at', { precision: 6 })
                .notNullable()
                .defaultTo(knex.fn.now(6));
        })
        .createTable('user_todo_lists', tbl => {
            tbl.integer('user_id')
                .unsigned()
                .index()
                .references('id')
                .inTable('users')
                .onUpdate('CASCADE');
            tbl.integer('todo_list_id')
                .unsigned()
                .index()
                .references('id')
                .inTable('todo_lists')
                .onUpdate('CASCADE');
            tbl.boolean('owner')
                .notNullable()
                .defaultTo(true);

            // set primary keys
            tbl.primary(['user_id', 'todo_list_id']);
            
        })
        .createTable('todo_items', tbl => {
            tbl.increments();
            tbl.integer('todo_list_id')
                .unsigned()
                .index()
                .references('id')
                .inTable('todo_lists')
                .onUpdate('CASCADE');
            tbl.string('todo', 255)
                .notNullable()
                .index();
            tbl.boolean('complete')
                .notNullable()
                .defaultTo(false);
            tbl.datetime('complete_by', { precision: 6 })
                .nullable();
            tbl.datetime('completed_at', { precision: 6 })
                .nullable();
            tbl.datetime('deleted_at', { precision: 6 })
                .nullable();
            tbl.datetime('created_at', { precision: 6 })
                .notNullable()
                .defaultTo(knex.fn.now(6));
            tbl.integer('recur_interval')
                .nullable();
            tbl.string('recur_unit', 1)
                .nullable();
        })
        .createTable('recurring_todos', tbl => {
            tbl.increments();
            tbl.integer('todo_item_id')
                .unsigned()
                .index()
                .references('id')
                .inTable('todo_items')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.boolean('complete')
                .notNullable()
                .defaultTo(false);
            tbl.datetime('complete_by', { precision: 6 })
                .notNullable();
            tbl.datetime('completed_at', { precision: 6 })
                .nullable();
            
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('recurring_todos')
        .dropTableIfExists('todo_items')
        .dropTableIfExists('user_todo_lists')
        .dropTableIfExists('todo_lists');
};
