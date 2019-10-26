const knex = require("../db/knexConnection");

module.exports = {
    getTables(capacity) {
        return knex("table_seats").select().where("capacity", ">=", capacity);
    },
    getReservations(tableId) {
        return knex("reservations").select().where("table_id", "=", tableId);
    },
    getReservationById(id) {
        return knex("reservations").select().where("id", "=", id);
    },
    deleteReservationById(id) {
        return knex("reservations").del().where("id", "=", id);
    },
    insertReservation(reservation) {
        return knex("reservations").insert(reservation);
    },
    updateReservation(reservation, id) {
        return knex("reservations").update(reservation).where('id', '=', id);
    }
}