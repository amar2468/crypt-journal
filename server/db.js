// Loads environment variables from .env file
require('dotenv').config();

// Import the "Client" class from the "pg" module to interact with the PostgreSQL database
const { Client } = require('pg');

// Create a new client instance with database connection parameters from environment variables
const client = new Client({
    user: process.env.DB_USER,
    host: "localhost",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Establish connection to the database and handle success or failure
client.connect()
    .then(() => console.log("Connected to the database."))
    .catch((err) => console.error("Couldn't connect to DB: ", err));

// Export the client instance for use in other parts of the application
module.exports = client;