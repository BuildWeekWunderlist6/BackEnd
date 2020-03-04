
exports.up = function(knex) {
    return knex.schema
        .dropTableIfExists('recurring_todos')
        .createTable('recurring_todos', tbl => {
            tbl.increments();
            tbl.integer('todo_item_id')
                .unsigned()
                .index()
                .references('id')
                .inTable('todo_items')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            tbl.datetime('completed_at', { precision: 6 })
                .notNullable();
        });
};

exports.down = function(knex) {
    return knex.schema.createTable('recurring_todos', tbl => {
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
