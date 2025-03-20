const nodemailer = require("nodemailer");
const logger = require("../Utility/logger");
// Create a transporter object using the default SMTP transport
const sendVerificationEmail = async (email, verificationCode) => {
  try {
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
          },
      });

      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Email Verification',
          text: `Your verification code is: ${verificationCode}`,
          html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
      };

      await transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully');
  } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
  }
};

module.exports = { sendVerificationEmail };