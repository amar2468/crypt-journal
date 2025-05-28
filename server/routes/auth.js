const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');

// Importing the DB connection
const db = require('../db')

// When the user submits the "sign up" form, this route will add the user to the table, if no errors occurred.
router.post('/sign_up', async(req, res) => {
    // Extracting the form data that was submitted and saving them in separate variables.
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Compare the original password with the re-entered one to ensure they match
    if (password !== confirmPassword) {
        console.log("Passwords don't match.");
    }

    // Hash the user's password using bcrypt with a salt rounds value of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Getting the current date and time and assigning the value to the joinDate variable.
    const joinDate = new Date();

    // When a new user is created, they will automatically be assigned the "user" account type.
    const userType = "user";

    // Empty field for the phone number when they initially sign up. They will have the option to add their phone number later on.
    const phoneNumber = "";

    // The MFA is disabled initially, but the option to turn it on will be after the sign up.
    const mfaEnabled = false;

    // Failed login attempt have been set to 0, as the user hasn't even attempted to login
    const failedLoginAttempts = 0;

    // Try block where the goal is to add the user information into the table.
    try {
        // Creating the query that will populate the "users" table with the user information
        const addUser = `
            INSERT INTO users (
                first_name,
                last_name,
                email,
                password,
                join_date,
                last_logon,
                user_type,
                phone_number,
                mfa_enabled,
                failed_login_attempts
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
            )
        `;

        // Adding the variables that hold the actual user values into an array, which will then be passed to the query above.
        const values = [
            firstName,
            lastName,
            email,
            hashedPassword,
            (joinDate.toISOString()),
            (joinDate.toISOString()),
            userType,
            phoneNumber,
            mfaEnabled,
            failedLoginAttempts
        ];

        // Execute the SQL query to insert the new user into the database
        await db.query(addUser, values);
    }

    // If an error was encountered when trying to add the user to the table, the error will be displayed in the console.
    catch (err) {
        console.error(err);

        res.status(500).json({ message : 'Server Error.' });
    }

    res.status(201).json({ message : 'User Account Created.' });
});

router.post('/login', async(req, res) => {
    res.status(201).json({ message: 'Login was successful.' });
});

module.exports = router;