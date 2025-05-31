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

        return res.status(500).json({ message : 'Server Error.' });
    }

    return res.status(201).json({ message : 'User Account Created.' });
});

// Handles user login by verifying the email exists and the provided password matches the stored hashed password,
// responding with success or error accordingly.
router.post('/login', async(req, res) => {
    // Extracting the email and password from the login form
    const { email, password } = req.body;

    // Query the database to find the first user with the specified email.
    const result = await db.query("SELECT * from users where email=$1 LIMIT 1;", [email]);

    // If a record was found for the specified user in the database, we will see if the passwords match.
    if (result.rowCount > 0) {
        // Retrieving the user's hashed password from the database.
        const hashedPassword = result.rows[0].password;

        // Comparing the password that the user entered against the hashed password in the database.
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);

        // If the passwords match, the login was successful, so send this information back to the front-end.
        if (passwordsMatch) {
            return res.status(201).json({ message: 'Login was successful.' });
        }

        // If the passwords don't match, send this information back to the front-end.
        else {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
    }

    // If the email address doesn't exist in the database, inform the user that there was an issue with signing in.
    else {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }
});

// Handles POST requests to initiate password reset by checking if the email exists and responding with success or error accordingly.
router.post('/forgot_password', async(req, res) => {
    const { userEmail } = req.body;

    const result = await db.query("SELECT * from users where email=$1 LIMIT 1", [userEmail]);

    // If a record was found for the specified user in the database, we will send an email with the password reset link.
    if (result.rowCount > 0) {
        return res.status(201).json({ message: 'Password reset link sent.' });
    }
    
    else {
        return res.status(401).json({ message: 'No account with that email address was found in our system.' });
    }
});

module.exports = router;