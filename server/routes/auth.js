const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');

const { sendPasswordResetEmail } = require('../sendEmail');

const crypto = require('crypto');

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
        const token = crypto.randomBytes(32).toString("hex");

        const token_expires = new Date(Date.now() + 15 * 60 * 1000);

        await db.query(
            "UPDATE users SET reset_password_token=$1, reset_password_expires=$2 WHERE email=$3", [token, token_expires, userEmail]
        );

        const password_reset_link = "http://localhost:3000/reset_password/" + token;

        await sendPasswordResetEmail(userEmail, password_reset_link);

        return res.status(201).json({ message: 'Password reset link sent.' });
    }
    
    else {
        return res.status(401).json({ message: 'No account with that email address was found in our system.' });
    }
});

router.post('/change_password', async(req, res) => {
    // Extracting the form data that was submitted and saving them in separate variables.
    const { new_password, confirm_new_password, token } = req.body;

    if (new_password !== confirm_new_password) {
        return res.status(400).json({ message: 'The passwords do not match. Make sure that the passwords match.' });
    }

    // Check if the password is less than 8 characters.
    if (new_password.length < 8) {
        return res.status(400).json({ message: 'The password has to be at least 8 characters long.' });
    }

    // Check if the password is more than 64 characters
    if ((new_password).length > 64) {
        return res.status(400).json({ message: 'The password cannot contain more than 64 characters.' });
    }

    // Creating a regex which will check if the password contains at least one uppercase letter, one lowercase letter, one number,
    // and one special character.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,64}$/;

    // If the password is not compliant with this regex, the form will not be submitted and an error will be presented on the page
    // displayed on the screen.
    if (!(passwordRegex.test(new_password))) {
        return res.status(400).json({ message: 'The password needs to contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
    }

    // Retrieving the user who has the token that is in the password reset URL
    const result = await db.query("SELECT * from users where reset_password_token=$1", [token]);

    // If a user with that specific token exists, we will attempt to update the password.
    if (result.rowCount > 0) {
        // Retrieving the user's token expiry date, so we can see if it is still valid.
        const token_expiry_date = result.rows[0].reset_password_expires;

        // If the token has expired, we will inform the user that the password reset token is invalid.
        if (token_expiry_date < new Date()) {
            return res.status(400).json({ message: "Invalid password reset token." });
        }

        // If the token is still valid, we will hash the password and attempt to update the password.
        else {
            // Hash the password and attempt to update it.
            try {
                // Hash the password using bcrypt with a salt rounds value of 10
                const hashedPassword = await bcrypt.hash(new_password, 10);

                // Run the query to update the user password, using the user's token as the unique identifier.
                await db.query(
                    "UPDATE users SET password=$1 WHERE reset_password_token=$2",
                    [hashedPassword, token]
                );

                // Return the success message to the user.
                return res.status(201).json({ message: "Password has been successfully updated." });
            }

            // If there was an issue with updating the password, we will return the error message to the user.
            catch (err) {
                // Logging the error message to the console.
                console.log(err);

                // Return the error message to the user.
                return res.status(500).json({ message: "An error occurred while updating the password." });
            }
        }
    }

    // If there are no users with that token, we will inform the user that the password reset token is invalid.
    else {
        return res.status(400).json({ message: "Invalid password reset token." });
    }
});

module.exports = router;