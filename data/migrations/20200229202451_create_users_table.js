
exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments();
        tbl.string('first_name', 255)
            .notNullable()
            .index();
        tbl.string('last_name', 255)
            .notNullable()
            .index();
        tbl.string('email', 255)
            .notNullable()
            .index()
            .unique();
        tbl.string('password', 1028)
            .notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};
