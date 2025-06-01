const db = require('./db');

const createTables = async () => {
    try {
        // Table that stores the users
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_logon TIMESTAMP,
                user_type TEXT,
                phone_number TEXT,
                mfa_enabled BOOLEAN DEFAULT false,
                failed_login_attempts INTEGER DEFAULT 0,
                lockout_until TIMESTAMP,
                reset_password_token VARCHAR(64),
                reset_password_expires TIMESTAMP
            );
        `);

        console.log("All the tables have been created (if they didn't exist before)");
    }

    catch (error) {
        console.error("Error creating the table(s): ", error);
    }
}

module.exports = createTables;