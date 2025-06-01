const nodemailer = require('nodemailer');

async function sendPasswordResetEmail(recipientEmail) {
    let userAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: userAccount.smtp.host,
        port: userAccount.smtp.port,
        secure: userAccount.smtp.secure,
        auth: {
            user: userAccount.user,
            pass: userAccount.pass,
        },
    });

    let email_info = await transporter.sendMail({
        from: '"Crypt Journal" <no-reply@cryptjournal.com>',
        to: recipientEmail,
        subject: 'Reset your password',
        text: 'Test email',
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(email_info));
}

module.exports = { sendPasswordResetEmail };