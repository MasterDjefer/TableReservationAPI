exports.up = function(knex) {
    return knex.schema.createTable("table_seats", (table) => {
      table.increments("id");
      table.integer("capacity").notNullable();
    });
  };
    
  exports.down = function(knex) {
      return knex.schema.dropTable("table_seats");
  };