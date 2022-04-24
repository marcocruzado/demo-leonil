
require("dotenv").config();

const { Pool } = require("pg");


const config = {
    user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 5432,
      host: process.env.DB_HOST,
      ssl: { rejectUnauthorized: false },
}

const pool = new Pool(config);


module.exports = {pool};