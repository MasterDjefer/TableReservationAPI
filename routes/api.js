const queries = require("../db/queries");
const express = require("express");
const route = express.Router();

//function which update reservation by id
function updateReservation(id, people_count, table_id, start_date, end_date) {
    const obj = { people_count, table_id, start_date, end_date };
    queries.updateReservation(obj, id)
    .then(data => {});

    return obj;
}

//async function which select reservation by id
async function getReservationById(id) {
    let reservation = undefined;
    await queries.getReservationById(id)
    .then(reservations => {
        reservation = reservations[0];
    });
    return reservation;
}

//function packs data into the object and inserts into the database
function insertReservation(people_count, table_id, start_date, end_date) {
    const obj = { people_count, table_id, start_date, end_date };
    queries.insertReservation(obj)
    .then(data => {});

    return obj;
}

function postReservation(req, res, reservationId) {
    const { people_count, start_date, end_date } = req.body;
    //convert date to miliseconds for comparation
    const startDate = new Date(start_date).getTime();
    const endDate = new Date(end_date).getTime();

    //check bad time range
    if (startDate >= endDate) {
        return res.status(403).json({ error_reason: "bad time range" });
    }
    //check if data is presented
    if (!people_count || !start_date || !end_date) {
        return res.status(403).json({ error_reason: "bad data" });
    }

    //get tabels in table_seats which suites people_count
    queries.getTables(people_count)
    .then(tables => {
        
        //if people capacity bigger then all tables capacity
        if (!tables.length) {
            return res.status(403).json({ error_reason: "there is not suitable table" });
        }

        //i need await to determine whether res.headersSent is set
        (async function f() {
            for (let i = 0; i < tables.length; ++i)
            {
                const table = tables[i];
                //flag which determine wether table is not reserved at such time
                let isTimeFree = true;

                //get all reservations which are reserved in such table
                await queries.getReservations(table.id)
                .then(reservations => {
    
                    //if there is not any reservation, reserve it 
                    if (!reservations.length) {
                        let reservation = null;
                        if (reservationId) {
                            reservation = updateReservation(reservationId, people_count, table.id, start_date, end_date);
                        } else {
                            reservation = insertReservation(people_count, table.id, start_date, end_date);
                        }
                        return res.json(reservation);
                    }
                    
                    for (const reservation of reservations) {
                        if (reservation.id === reservationId) {
                            break;
                        }

                        //convert date to miliseconds for comparation
                        const reservedStartDate = new Date(reservation.start_date).getTime();
                        const reservedEndDate = new Date(reservation.end_date).getTime();
    
                        //determine wether such time is NOT free
                        if (!((startDate < reservedStartDate && endDate < reservedStartDate) || (startDate > reservedEndDate && endDate > reservedEndDate))) {
                            isTimeFree = false;
                            break;
                        }
                    }
    
                    //if time is FREE, then reserve table
                    if (isTimeFree) {
                        let reservation = null;
                        if (reservationId) {
                            reservation = updateReservation(reservationId, people_count, table.id, start_date, end_date);
                        } else {
                            reservation = insertReservation(people_count, table.id, start_date, end_date);
                        }
                        return res.json(reservation);
                    }
                });

                if (i + 1 === tables.length && !isTimeFree) {
                    return res.status(403).json({ error_reason: `all tables are booked at this time range` });
                }

                if (res.headersSent) {
                    return;
                }
            }
        })();        
    });    
} 

route.post("/reservations", (req, res) => {    
    postReservation(req, res);
});

route.get("/reservations/:id", (req, res) => { 
    const { id } = req.params;

    getReservationById(id)
    .then(reservation => {
        if (!reservation) {
            return res.json({ "error_reason": `reservation with id ${id} doesn\'t exist`});
        }
        return res.json(reservation);
    });
});

route.delete("/reservations/:id", (req, res) => { 
    const id = parseInt(req.params.id);

    getReservationById(id)
    .then(reservation => {
        if (!reservation) {
            return res.json({ "error_reason": `reservation with id ${id} doesn\'t exist`});
        }

        queries.deleteReservationById(id)
        .then(() => {
            return res.json(reservation);     
        });
    });    
});

route.put("/reservations/:id", (req, res) => { 
    const id = parseInt(req.params.id);

    getReservationById(id)
    .then(reservation => {
        if (!reservation) {
            return res.json({ "error_reason": `reservation with id ${id} doesn\'t exist`});
        }

        postReservation(req, res, reservation.id);
    });    
});



module.exports = route;