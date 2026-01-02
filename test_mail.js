
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, 
    subject: 'Test Email from Node.js',
    text: 'If you see this, the configuration is perfect!'
};

console.log(`Attempting to send from ${process.env.EMAIL_USER}...`);

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log('ERROR:', error);
    } else {
        console.log('SUCCESS! Email sent: ' + info.response);
    }
});