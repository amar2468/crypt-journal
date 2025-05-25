// Importing "express" module
const express = require('express');

// Import CORS to allow cross-origin requests
const cors = require('cors');

// Importing the DB connection
const db = require('./db')

// Importing the module that will create the tables in the database
const createTables = require('./setup');

// Import authentication-related routes
const authRoutes = require('./routes/auth');

// Calling "express" function, which creates an "express" application instance
const app = express();

// Calling the function to create tables in the database if they don't already exist
createTables();

// Enable CORS for all routes and origins
app.use(cors());

// Middleware to parse incoming JSON
app.use(express.json());

// Mount authentication routes under the /api/auth path
app.use("/api/auth", authRoutes);

// Start the server and listen on port 4000
app.listen(4000, () => {
    console.log("Server listening on port 4000")
});