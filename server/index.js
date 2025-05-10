// Importing "express" module
const express = require('express');

// Calling "express" function, which creates an "express" application instance
const app = express();

// Importing the DB connection
const db = require('./db')

app.listen(4000, () => {
    console.log("Server listening on port 4000")
});