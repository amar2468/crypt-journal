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
        catch (error)
        {
            console.error("Issue encountered when getting the user information: ", error);

            return res.status(500).json({
                message: "Failed to retrieve user information."
            });
        }
    }

    // If the user is not logged in, don't allow the retrieval of the user info
    else {
        console.error("The user does not have a valid token associated with their account. The user may need to log off and log back on.");

        return res.status(401).json({
            message: "Unauthorised: No token detected. Please log off and log back into your account."
        });
    }
});

// Getting the user preferences from the database, so that we can populate the "User Preferences" section with this info.
router.get("/getUserPreferences", authenticateToken, async(req, res) => {
    // If the user is logged in, allow the retrieval of the user preferences
    if (req.user) {
        // Attempt to retrieve the user preferences and return the values from the database back to the frontend
        try {
            // Getting the user record, so that we can retrieve the ID that will be used when finding the specific user preference
            const userRecord = await db.query("SELECT id FROM users WHERE email=$1 LIMIT 1", [req.user.email]);

            // Creating a variable and storing the user ID from the "users" table in it. This ID is a foreign key in the
            // "user_preferences" table, which means that we can retrieve the user preferences for this user using that key.
            const userRecordID = userRecord.rows[0].id;

            // Retrieving the user preferences for this specific user
            const userPreferencesRecord = await db.query("SELECT * FROM user_preferences WHERE user_id=$1 LIMIT 1", [userRecordID]);

            // If a user preference record was found for this user, we will get the information from the table and send it back
            // to the frontend.
            if (userPreferencesRecord.rowCount > 0) {
                // Retrieving a bunch of values from the database, that are needed in the user preferences form.
                const timezone = userPreferencesRecord.rows[0].timezone;

                const date_format = userPreferencesRecord.rows[0].date_format;

                const enable_autosave = userPreferencesRecord.rows[0].enable_autosave;

                // Returning a 200 status, along with a success message and the data that we want to populate the user preferences form with
                return res.status(200).json({
                    message: "User preferences successfully retrieved.",
                    data: {
                        timezone,
                        date_format,
                        enable_autosave
                    }
                });
            }

            // If there were no user preferences found for that user, just send back a message informing the user about that.
            else {
                return res.status(404).json({
                    message: "User preferences not found."
                });
            }
        }

        // If there was an issue with retrieving the user preferences, inform the user about it.
        catch (error) {
            console.error("Error encountered when fetching the user preferences: ", error);

            return res.status(500).json({
                message: "Issue encountered when retrieving the user preferences."
            });
        }
    }

    // If the user is not logged in, don't allow the retrieval of the user preferences
    else {
        console.error("The user does not have a valid token associated with their account. The user may need to log off and log back on.");

        return res.status(401).json({
            message: "Unauthorised: No token detected. Please log off and log back into your account."
        });
    }
});

// Route which will attempt to update the account information by getting the current entry in the database and updating it
// using the form data that the user passed in the form.
router.post('/editAccountInformation', authenticateToken, async(req, res) => {
    // If the user is logged in, allow the retrieval of the form data
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
        console.error("The user does not have a valid token associated with their account. The user may need to log off and log back on.");

        return res.status(401).json({
            message: "Unauthorised: No token detected. Please log off and log back into your account."
        });
    }
});

// Route which will attempt to update the user preferences by getting the current entry in the database and updating it
// using the form data that the user passed in the form.
router.post('/editUserPreferences', authenticateToken, async(req, res) => {
    // If the user is logged in, allow the retrieval of the form data
    if (req.user) {
        // Retrieving all the form fields from the user preferences form.
        const { timezone, dateFormat, enableAutosave } = req.body;
        
        // Variable that will hold the specific user ID, which will be used as a foreign key in the "user_preferences" table,
        // to get the user preferences for that specific user.
        let userRecordID;

        // Variable that will hold all the records from the "user_preferences" table
        let userPreferences;

        // Attempt to get the user preferences from the specific user and save it within the variable "userPreferences"
        try {
            // Getting the ID for the user who made the update to the user preferences.
            const userRecord = await db.query("SELECT id FROM users WHERE email=$1 LIMIT 1", [req.user.email]);

            // Variable that stores the ID of the user who made the update to the user preferences
            userRecordID = userRecord.rows[0].id;

            // Retrieving the user preferences for the user, using the ID that was retrieved above.
            const userPreferencesRecord = await db.query("SELECT * FROM user_preferences WHERE user_id=$1 LIMIT 1", [userRecordID]);
            
            // Storing the user preferences into the variable below.
            userPreferences = userPreferencesRecord.rows[0];
        }
        
        // If we encounter an error when getting the user preferences, we will send the information back to the user and log an
        // error message to the console.
        catch (error) {
            console.error("Error fetching user or preferences: ", error);

            return res.status(500).json({
                message: "Failed to load user preferences."
            });
        }

        // Check if any updates were made to the user preference fields. If a change was made, update the user preference record
        // with the new value
        try {
            // Checking to see if the timezone has been updated.
            if (timezone != userPreferences.timezone) {
                // Update the timezone
                await db.query(
                    "UPDATE user_preferences SET timezone=$1 WHERE user_id=$2", [timezone, userRecordID]
                );
            }

            // Checking to see if the date format has been updated.
            if (dateFormat != userPreferences.date_format) {
                // Update the date format
                await db.query(
                    "UPDATE user_preferences SET date_format=$1 WHERE user_id=$2", [dateFormat, userRecordID]
                );
            }

            // Checking to see if the autosave has been updated.
            if (enableAutosave != userPreferences.enable_autosave) {
                // Update the autosave
                await db.query(
                    "UPDATE user_preferences SET enable_autosave=$1 WHERE user_id=$2", [enableAutosave, userRecordID]
                );
            }

            // Return 200 status message, indicating that the information was updated successfully
            return res.status(200).json({
                message: "User preferences have been updated."
            });
        }

        // If there was an issue with updating the user preferences, a 500 error is thrown and returned to the frontend. Additionally,
        // the error message is logged to the console.
        catch (error) {
            console.error("Error updating preferences:", error);

            return res.status(500).json({
                message: "Failed to update user preferences."
            });
        }
    }

    // If the user is not logged in, don't allow them to update the user preferences
    else {
        console.error("The user does not have a valid token associated with their account. The user may need to log off and log back on.");

        return res.status(401).json({
            message: "Unauthorised: No token detected. Please log off and log back into your account."
        });
    }
});

// Route which will attempt to remove the user account
router.delete('/deleteAccount', authenticateToken, async(req, res) => {
    // If the user is logged in, allow the potential deletion of the account
    if (req.user) {
        // Try to find the user record and remove it from "user_preferences" and "users" table, removing any references of this user
        try {
            // Find the user by their email
            const userRecord = await db.query("SELECT * FROM users WHERE email=$1 LIMIT 1", [req.user.email]);

            // Extract the ID of the user
            const userRecordID = userRecord.rows[0].id;

            // Delete the user from the "user_preferences" table, as this is no longer needed and we want to remove the foreign key
            await db.query("DELETE FROM user_preferences WHERE user_id=$1", [userRecordID]);

            // Remove the user from the "users" table by searching for their email
            await db.query("DELETE FROM users WHERE email=$1", [req.user.email]);

            // Return 200 status message, indicating that the user account was deleted.
            return res.status(200).json({
                message: "Account has been deleted successfully."
            });
        }

        // If we encounter an error when we try to delete the account, we will send the information back to the user and log an
        // error message to the console.
        catch (error) {
            console.error("Error when deleting the account: ", error);

            return res.status(500).json({
                message: "Failed to delete the account."
            });
        }
    }

    // If the user is not logged in, don't allow them to update the user preferences
    else {
        console.error("The user does not have a valid token associated with their account. The user may need to log off and log back on.");

        return res.status(401).json({
            message: "Unauthorised: No token detected. Please log off and log back into your account."
        });
    }
});

module.exports = router