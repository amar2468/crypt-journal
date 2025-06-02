const nodemailer = require('nodemailer');

async function sendPasswordResetEmail(recipientEmail, password_reset_link) {
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
        html: `
            <p>Hi</p>
            <br />
            <p>To reset your password, please click on the link <a href="${password_reset_link}">here</a> and fill in the form.</p>
            <br />
            <p>If you do not want to change your password, ignore this email.</p>
            <br />
            <p>Thanks, Crypt Journal Team</p>
        `,
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(email_info));
}

module.exports = { sendPasswordResetEmail };