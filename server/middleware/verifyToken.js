// Loads environment variables from .env file
require('dotenv').config();

// Import the jsonwebtoken library to handle creating and verifying JWTs (JSON Web Tokens)
const jwt = require('jsonwebtoken');

// Getting the "jwt secret key" environment variable from .env
const SECRET_KEY_JWT = process.env.JWT_SECRET_KEY

// Function that will check if there is a valid token being used and determine if the user is logged on or not.
function authenticateToken (req, res, next) {
    // Retrieve the "Authorization" header from the request that was made and get the token from it.
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    // If there is no token, do not initialise the user.
    if (!token) {
        req.user = null;
        return next();
    }

    // If a token exists, we need to see if it is valid. If it is, we will initialise the user.
    jwt.verify(token, SECRET_KEY_JWT, (err, user) => {
        // If an error occurred, set the user to null.
        if (err) {
            req.user = null;
        }

        // If the token is valid, initialise the user.
        else {
            req.user = user;
        }

        next();
    });
}

module.exports = { authenticateToken };