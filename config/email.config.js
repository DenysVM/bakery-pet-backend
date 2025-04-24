// server/config/email.config.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SPARKPOST_SMTP_HOST, 
  port: process.env.SPARKPOST_SMTP_PORT, 
  secure: false,
  auth: {
    user: process.env.SPARKPOST_SMTP_USER,       
    pass: process.env.SPARKPOST_SMTP_PASSWORD,   
  },
});

module.exports = transporter;
