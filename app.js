const express = require("express");
const bodyParser = require("body-parser");

const knex = require("./db/knexConnection");
const apiRoutes = require("./routes/api");
const app = express();
const PORT = 12345;

//create tables and fill table table_seats by default data
knex.migrate.latest()
.then(function() {
    return knex.seed.run();
})
.then(function() {
    console.log("db init finished");
});

//use body parser
app.use(bodyParser.json());
app.use("/api", apiRoutes);

app.use((req, res, next) => {
    res.json({ "error_reason": `cant get ${req.url}` });
});

app.listen(PORT, () => {
    console.log(`listenning on port ${PORT}...`);
})