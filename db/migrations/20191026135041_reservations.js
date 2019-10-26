exports.up = function(knex) {
    return knex.schema.createTable("reservations", (table) => {
      table.increments("id");
      table.integer("people_count");
      table.integer('table_id').unsigned().notNullable();
      table.foreign("table_id").references('id').inTable('table_seats');
      table.string("start_date");
      table.string("end_date");
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("reservations");
  }
  
  
  