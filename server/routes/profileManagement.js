// Importing "express" module
const express = require('express');

// Create a new router instance for defining route handlers
const router = express.Router();

// Import middleware function to authenticate JWT tokens
const { authenticateToken } = require('../middleware/verifyToken');

// Importing the DB connection
const db = require('../db');

// Loads environment variables from .env file
require('dotenv').config();

// Getting the user information from the database, so that we can populate the account info with it.
router.get('/getUserAccountInfo', authenticateToken, async(req, res) => {
    // If the user is logged in, allow the retrieval of the user info
    if (req.user) {

        // Attempt to retrieve the user account and return the values from the database back to the frontend.
        try
        {
            // Retrieve all the information for the user who is currently logged in.
            const result = await db.query("SELECT * FROM users WHERE email=$1 LIMIT 1;", [req.user.email]);

            // If the user was found, proceed with getting all the database fields and pass the values in the return statement.
            if (result.rowCount > 0 ) {
                // Retrieving a bunch of values from the database, that are needed in the account info form.
                const first_name = result.rows[0].first_name;

                const last_name = result.rows[0].last_name;

                const email = result.rows[0].email;

                const phone_number = result.rows[0].phone_number;

                const mfa_enabled = result.rows[0].mfa_enabled;

                // Returning a 200 status, along with a success message and the data that we want to populate the account info form with
                return res.status(200).json({
                    message: "User information retrieved successfully.",
                    data: {
                        first_name,
                        last_name,
                        email,
                        phone_number,
                        mfa_enabled
                    }
                });
            }

            // If there were no records found for that user, just send back a message informing the user about that.
            else if (result.rowCount === 0) {
                return res.status(404).json({
                    message: "User not found."
                });
            }
        }

        // If there was an issue with retrieving the user information, inform the user about it.
        catch
        {
            return res.status(500).json({
                message: "Failed to retrieve user information."
            });
        }
    }

    // If the user is not logged in, don't allow the retrieval of the user info
    else {
        console.log("No token detected. Please contact the system administator for assistance.");
    }
});

// Route which will attempt to update the account information by getting the current entry in the database and updating it
// using the form data that the user passed in the form.
router.post('/editAccountInformation', authenticateToken, async(req, res) => {
    // If the user is logged in, allow the retrieval of the user info
    if (req.user) {
        // Retrieving all the form fields from the account information form.
        const { firstName, lastName, email, phoneNumber, mfaEnabled } = req.body;

        // Attempt to update the fields that were updated in the Account Information section
        try {
            // Get the user record
            const result = await db.query("SELECT * FROM users where email=$1 LIMIT 1;", [req.user.email]);

            // If the user was found, proceed with updating the user account information
            if (result.rowCount > 0) {
                // Retrieving a bunch of fields from the database, so that we can compare it against the form fields.
                const currentFirstName = result.rows[0].first_name;

                const currentLastName = result.rows[0].last_name;

                const currentEmail = result.rows[0].email;

                const currentPhoneNumber = result.rows[0].phone_number;

                const currentMFA = result.rows[0].mfa_enabled;

                // Checking to see if the first name has been updated.
                if (currentFirstName !== firstName) {
                    // Update the first name
                    await db.query(
                        "UPDATE users SET first_name=$1 WHERE email=$2", [firstName, req.user.email]
                    );
                }

                // Checking to see if the last name has been updated.
                if (currentLastName !== lastName) {
                    // Update the last name
                    await db.query(
                        "UPDATE users SET last_name=$1 WHERE email=$2", [lastName, req.user.email]
                    );
                }

                // Checking to see if the email has been updated.
                if (currentEmail !== email) {
                    // Update the email
                    await db.query(
                        "UPDATE users SET email=$1 WHERE email=$2", [email, req.user.email]
                    );
                }

                // Checking to see if the phone number has been updated.
                if (currentPhoneNumber !== phoneNumber) {
                    // Update the phone number
                    await db.query(
                        "UPDATE users SET phone_number=$1 WHERE email=$2", [phoneNumber, req.user.email]
                    );
                }

                // Checking to see if the MFA has been updated.
                if (currentMFA !== mfaEnabled) {
                    // Updating the MFA
                    await db.query(
                        "UPDATE users SET mfa_enabled=$1 WHERE email=$2", [mfaEnabled, req.user.email]
                    );
                }

                // Return 200 status message, indicating that the information was updated successfully.
                return res.status(200).json({
                    message: "Account information has been updated."
                });
            }

            // If the user record couldn't be found, a 404 status is returned.
            else {
                return res.status(404).json({
                    message: "User profile couldn't be found on our system. Please contact support for assistance."
                });
            }
        }

        // If there was an issue with updating the database, a 500 error is thrown.
        catch {
            return res.status(500).json({
                message: "Encountered issue while updating the account information. Make sure that the information provided is valid."
            });
        }
    }

    // If the user is not logged in, don't allow them to update the information.
    else {
        console.log("No token detected. Please contact the system administator for assistance.");
    }
});

module.exports = router