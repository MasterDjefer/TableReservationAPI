module.exports = {
  client: 'mysql',
  connection: {
      host : 'localhost',
      user: "djefer",
      password: "qwerty",
      database : 'RestaurantDB'
  },
  migrations: {
    directory: __dirname + "/db/migrations"
  },
  seeds: {
    directory: __dirname + "/db/seeds"
  }
};
