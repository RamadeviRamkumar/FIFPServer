const nodemailer = require("nodemailer");
// const secretValue = require("../../config/secretCode/password");
// const logger = require("../../utils/logger");
const path = require("path");
require('dotenv').config();

const imagePath = path.join(__dirname, "../../Assets/logo.png");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

const sendMail = (to, subject, htmlContent) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.USER,
      to,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.png",
          path: imagePath,
          cid: "FIFPLogo",
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`${to} - Failed to send email: ${error.message}`);
        return reject({
          success: false,
          message: "Failed to send email. Please try again!",
        });
      }

      logger.info(`${to} - Email sent successfully: ${info.response}`);
      resolve({
        success: true,
        message: "Email sent successfully!",
      });
    });
  });
};

const generateOtpEmailContent = (email, otp) => {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
  <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #FF5722; text-align: center; font-size: 22px;">🔥 Welcome to FIFP App! 🔥</h2>

    <p>Hey <strong>${email.split("@")[0]},</strong></p>
    <p style="font-size: 16px; text-align: center; color: #555;">
      Your journey towards financial independence starts here!
    </p>
    <p style="font-size: 16px; text-align: center; color: #555;">
      Use the OTP below to verify your account:
    </p>
    
    <!-- Table-based layout for centering -->
    <table align="center" style="margin: 20px auto; border-spacing: 0;">
      <tr>
        <td style="background-color: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 8px; text-align: center;">
          <span id="otp-value" style="font-family: 'Courier New', monospace; font-size: 20px; color: #FF5722; font-weight: bold;">${otp}</span>
          <button 
            style="border: none; background: none; cursor: pointer; margin-left: 10px; color: #FF5722; font-size: 18px;"
            onclick="navigator.clipboard.writeText('${otp}')">
            📋
          </button>
        </td>
      </tr>
    </table>

    <p style="font-size: 14px; text-align: center; color: #555;">
      <em>Tip:</em> Click the copy icon to copy your OTP for easy use.
    </p>
    <p style="font-size: 16px; text-align: center; color: #555;">
      This code is valid for the next <strong>10 minutes</strong>. Please don't share it with anyone!
    </p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="text-align: center; font-size: 14px; color: #777;">
      If you have any questions, our support team is here to help!
    </p>
    <p style="text-align: left; margin-left: 15px; font-weight: bold;">Best regards,</p>
    <p style="text-align: left; margin-top: 6px;">
      <img src="cid:FIFPLogo" alt="FIFP Logo" style="width: 120px; height: auto;">
    </p>
  </div>
</div>`;
  };
  
module.exports = { sendMail, generateOtpEmailContent };
