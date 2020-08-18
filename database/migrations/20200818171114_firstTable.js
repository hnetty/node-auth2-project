
exports.up = function(knex) {
  return knex.schema
    .createTable('department', tbl => {
        tbl.increments();

        tbl.string('name').notNullable().unique();
    })

    .createTable('users', tbl => {
        tbl.increments();

        tbl.string('username').notNullable().unique().index();
        tbl.string('password').notNullable();
        tbl.string('department').unsigned().references('department.id').onDelete("RESTRICT").onUpdate("CASCADE");
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('department').dropTableIfExists('users');
};
