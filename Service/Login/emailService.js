const emailDao = require("../../Dao/Login/emailDao");
const Cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const ExpensesMaster = require("../../Models/Category/masterModel");
const ChildExpenses = require("../../Models/Category/childModel");
const ExpensesAllocation = require("../../Models/ExpensesAllocation/allocationModel");
const userDao = require("../../Dao/Login/userDao");
const User = require("../../Models/Login/emailModel");
require('dotenv').config();
const fireDao = require("../../Dao/FireQuestion/fireDao");
const financialDao = require("../../Dao/FinancialHealth/financialDao");
const riskDao = require("../../Dao/PersonalRiskTolerance/riskDao");
const path = require("path");
const cryptr = new Cryptr(process.env.JWT_SECRET);
const UAParser = require("ua-parser-js");
// const logger = require("../../utils/logger");
const { sendMail, generateOtpEmailContent } = require("./mailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.zoho.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: secretValue.USER,
//     pass: secretValue.APP_PASSWORD,
//   },
// });

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const generateNewSessionId = () => {
  return uuidv4();
};

exports.signIn = (email, userAgent) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await emailDao.findUserByEmail(email);

      if (!user) {
        user = await emailDao.createUser(email);
      }

      if (user.loggedIn) {
        await emailDao.invalidateSession(user._id);
      }

      const newSessionId = generateNewSessionId();
      await emailDao.updateSessionId(user._id, newSessionId);

      const parser = new UAParser();
      const result = parser.setUA(userAgent).getResult();
      const deviceType = result.device.type;
      const osName = result.os.name;

      const otp = generateOTP();
      const encryptedOtp = cryptr.encrypt(otp);

      // const otpExpiry = Date.now() + 60 * 1000;

      // const otpExpiry = Date.now() + 60 * 1000;
      const otpExpiry = Date.now() + 10 * 60 * 1000;

      await emailDao.updateOtp(user._id, encryptedOtp, otpExpiry, false);

      const emailContent = generateOtpEmailContent(email, otp);
      await sendMail(email, "Your OTP Code for FIFP App", emailContent);

      setTimeout(async () => {
        await emailDao.updateOtp(user._id, null, null);
      }, 10 * 60 * 1000);

      resolve({
        statusCode: "0",
        success: true,
        message: "OTP sent successfully!",
        userId: user._id,
      });
      logger.info(`${email} - OTP sent successfully!`);
    } catch (err) {
      reject({
        statusCode: "2",
        success: false,
        message: err.message || "Failed to send OTP",
      });
    }
  });
};

// exports.signIn = (email, userAgent) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let user = await emailDao.findUserByEmail(email);

//       if (!user) {
//         user = await emailDao.createUser(email);
//       }

//       if (user.loggedIn) {
//         await emailDao.invalidateSession(user._id);
//       }

//       const newSessionId = generateNewSessionId();
//       await emailDao.updateSessionId(user._id, newSessionId);

//       const parser = new UAParser();
//       const result = parser.setUA(userAgent).getResult();
//       const deviceType = result.device.type;
//       const osName = result.os.name;

//       const otp = generateOTP();
//       const encryptedOtp = cryptr.encrypt(otp);
//       // const otpExpiry = Date.now() + 60 * 1000;
//       const otpExpiry = Date.now() + 10 * 60 * 1000; 

//       await emailDao.updateOtp(user._id, encryptedOtp, otpExpiry, false);

//       const mailOptions = {
//         from: secretValue.USER,
//         to: email,
//         subject: "Your OTP Code for FIFP App",
//         html: `
//         <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
//             <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
//                 <h2 style="color: #673AB7; text-align: center;">Welcome to the FIFP App!</h2>
//                 <p>Dear <strong>${email.split("@")[0]}</strong>,</p>
//                 <p style="text-align: center;">Thank you for joining the <strong>Financial Independence Focus Passion (FIFP) App</strong>.</p>
//                 <p style="text-align: center;">Please use the OTP code below to verify your account:</p>
//                 <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 8px; text-align: center; font-size: 20px; color: #673AB7; font-weight: bold; margin-bottom: 20px;">
//                     Your OTP code is: <strong>${otp}</strong>
//                 </div>
//                 <p style="text-align: center;">This code is valid for the next <strong>10 minute</strong>. For your security, please do not share it with anyone.</p>
//                 <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
//                 <p style="text-align: center;">If you have any questions, feel free to contact our support team.</p>
//                 <p style="text-align: left; margin-left:15px;font-weight: bold;">Best regards,</p>
//                 <p style="text-align: left; margin-top:6px;">
//                    <img src="cid:FIFPLogo" alt="FIFP Logo" style="width: 120px; height: auto;">
//                 </p>
//             </div>
//         </div>
//         `,
//         attachments: [
//           {
//             filename: "logo.png",
//             path: imagePath,
//             cid: "FIFPLogo",
//           },
//         ],
//       };

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           logger.error(`${email}-Failed to send OTP`);
//           return reject({
//             statusCode: "1",
//             success: false,
//             message: "Failed to send OTP! please try again!",
//           });
//         }

//         setTimeout(async () => {
//           await emailDao.updateOtp(user._id, null, null);
//         }, 10 * 60 * 1000);

//         resolve({
//           statusCode: "0",
//           success: true,
//           message: "OTP sent successfully!",
//           userId: user._id,
//           // sessionId: newSessionId,
//         });
//         logger.info(`${email}-OTP sent successfully!`);
//       });
//     } catch (err) {
//       reject({
//         statusCode: "2",
//         success: false,
//         message: err.message || "Failed to sent OTP",
//       });
//     }
//   });
// };

exports.verifyOTP = (email, otp, userAgent) => {
  return new Promise(async (resolve, reject) => {
    try {
      const parser = new UAParser();
      const result = parser.setUA(userAgent).getResult();
      const deviceType = result.device.type;
      const osName = result.os.name;

      const user = await emailDao.findUserByEmail(email);
      if (!user) {
        logger.error(`User Not Found`);
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found!",
        });
      }

      const adminEmail = process.env.adminEmail;
      const adminOtp = process.env.adminOtp;

      if (email === adminEmail) {
        if (otp !== adminOtp) {
          logger.error(`${email} - Invalid OTP!`);
          return reject({
            statusCode: "1",
            success: false,
            message: "Invalid OTP!",
          });
        }

        // Proceed with login for admin user
        otp = adminOtp; // No decryption needed for admin OTP
      } else {
      const decryptedOtp = cryptr.decrypt(user.otp);
      if (decryptedOtp !== otp) {
        logger.error(`${email}-Invalid OTP!`);
        return reject({
          statusCode: "1",
          success: false,
          message: "Invalid OTP!",
        });
      }
    }

      if (
        user.sessionId &&
        user.sessionExpiresAt > Date.now() &&
        user.token &&
        user.tokenExpiresAt > Date.now()
      ) {
        user.sessionId = null;
        user.sessionExpiresAt = null;
        user.token = null;
        user.tokenExpiresAt = null;
      }

      const sessionId = uuidv4();
      const sessionExpiresAt =
        Date.now() +
        (deviceType === "mobile" ? 30 * 60 * 1000 : 59 * 60 * 1000);
      const token = generateToken(user.email, user._id);
      const tokenExpiresAt = Date.now() + 60 * 60 * 1000;

      // Update user details
      user.loggedIn = true;
      user.otp = null;
      user.token = token;
      user.tokenExpiresAt = tokenExpiresAt;
      user.sessionId = sessionId;
      user.sessionExpiresAt = sessionExpiresAt;
      user.status = true
      await user.save();

      // Create default expenses for the user
      await createDefaultExpenses(user._id);

      // Fetch additional user data
      const userProfile = await userDao.findUserProfileById({
        userId: user._id,
      });
      const userFire = await fireDao.findFireById({ userId: user._id });
      const userFinancial = await financialDao.findUserFinancialById({
        userId: user._id,
      });
      const userPersonal = await riskDao.findUserRiskById({ userId: user._id });

      resolve({
        statusCode: "0",
        success: true,
        message: "LoggedIn successfully!",
        token,
        tokenExpiresAt,
        sessionId,
        sessionExpiresAt,
        loggedIn: user.loggedIn,
        status:user.status,
        userId: user._id,
        userProfile: !!userProfile,
        userFire: !!userFire,
        userFinancial: !!userFinancial,
        userPersonal: !!userPersonal,
      });
      logger.info(`${email}-User Login Successfully!`);

    } catch (err) {
      reject({
        statusCode: "2",
        success: false,
        message: err.message || "Failed to verify OTP",
      });
    }
  });
};
// Create default expenses in a separate function
const createDefaultExpenses = async (userId) => {
  const existingExpenses = await ExpensesMaster.findOne({ userId });

  if (!existingExpenses) {
    const defaultExpenses = [
      {
        title: "Housing",
        active: true,
        userId: userId,
        category: [
          { title: "Rent", amount: 0 },
          { title: "Mortgage", amount: 0 },
          { title: "Utilities", amount: 0 },
          { title: "Phone", amount: 0 },
          { title: "Gas", amount: 0 },
        ],
      },
      {
        title: "Entertainment",
        active: true,
        userId: userId,
        category: [
          { title: "Movies", amount: 0 },
          { title: "Music", amount: 0 },
          { title: "Events", amount: 0 },
        ],
      },
      {
        title: "Transportation",
        active: true,
        userId: userId,
        category: [
          { title: "Car", amount: 0 },
          { title: "Fuel", amount: 0 },
          { title: "Public Transport", amount: 0 },
        ],
      },
      {
        title: "Loans",
        active: true,
        userId: userId,
        category: [
          { title: "Personal Loan", amount: 0 },
          { title: "Car Loan", amount: 0 },
          { title: "Student Loan", amount: 0 },
        ],
      },
      {
        title: "Insurance",
        active: true,
        userId: userId,
        category: [
          { title: "Health Insurance", amount: 0 },
          { title: "Car Insurance", amount: 0 },
          { title: "Life Insurance", amount: 0 },
        ],
      },
    ];

    const createdMasterExpenses = await ExpensesMaster.insertMany(
      defaultExpenses
    );

    const subcategoriesMapping = [
      {
        title: "Housing",
        expensesId: createdMasterExpenses[0]._id,
        category: ["Rent", "Mortgage", "Utilities", "Phone", "Gas"],
        active: true,
        userId: userId,
      },
      {
        title: "Entertainment",
        expensesId: createdMasterExpenses[1]._id,
        category: ["Movies", "Music", "Events"],
        active: true,
        userId: userId,
      },
      {
        title: "Transportation",
        expensesId: createdMasterExpenses[2]._id,
        category: ["Car", "Fuel", "Public Transport"],
        active: true,
        userId: userId,
      },
      {
        title: "Loans",
        expensesId: createdMasterExpenses[3]._id,
        category: ["Personal Loan", "Car Loan", "Student Loan"],
        active: true,
        userId: userId,
      },
      {
        title: "Insurance",
        expensesId: createdMasterExpenses[4]._id,
        category: ["Health Insurance", "Car Insurance", "Life Insurance"],
        active: true,
        userId: userId,
      },
    ];

    await ChildExpenses.insertMany(subcategoriesMapping);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentMonth = new Date().getMonth();
    const monthName = monthNames[currentMonth];
    const currentYear = new Date().getFullYear();

    const expensesTitles = createdMasterExpenses.map((expense) => ({
      title: expense.title,
      active: expense.active,
      category: expense.category,
      amount: 0,
    }));

    const newExpensesAllocation = new ExpensesAllocation({
      userId,
      month: monthName,
      year: currentYear,
      titles: expensesTitles,
    });

    await newExpensesAllocation.save();
  }
};

exports.logout = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await emailDao.findUserById(userId);
      if (!user)
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found!",
        });
      await emailDao.logoutUser(userId);
      resolve({
        statusCode: "0",
        success: true,
        message: "Logout SuccessFully!",
      });
      logger.info(`${email}-Logout successfully!`);
      
    } catch (err) {
      reject({
        statusCode: "2",
        success: false,
        message: err.message || "Failed to Logout",
      });
    }
  });
};

exports.Validate = (email, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.email !== email) {
        logger.error(`${email}-Invalid token or email`);
        return reject({
          statusCode: "1",
          success: false,
          message: "Invalid token or email!",
        });
      }
      const user = await emailDao.findUserByEmail(email);
      if (!user) {
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found.",
        });
      }
      await emailDao.validateToken(email, token);
      resolve({
        statusCode: "0",
        success: true,
        message: "Valid email and token!",
      });
      logger.info(`${email}-Valid email and token`);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        try {
          const user = await emailDao.Validate(email);
          if (user) {
            user.loggedIn = false;
            await user.save();
          }
          reject({
            statusCode: "1",
            success: false,
            message: "Token expired. User has been logged out.",
          });
        } catch (innerError) {
          reject({
            error:
              innerError.message ||
              "Error occurred while handling token expiration.",
          });
        }
      } else {
        console.error(error);
        reject({
          error: "Invalid token or email.",
        });
      }
    }
  });
};

exports.checkSession = (sessionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await emailDao.findUserBySessionId(sessionId);

      if (!user) {
        logger.error(`${email}-Invalid sessionId.please check your sessionId`);
        return reject({
          message: "Invalid Session ID. Please check your Session ID.",
        });
      }

      const currentTime = Date.now();

      if (currentTime > user.sessionExpiresAt) {
        // Mark the session as expired
        user.loggedIn = false;
        user.sessionId = null;
        await user.save();
        logger.error(`${email}-Session ID is expired. Please log in again`);
        return reject({
          message: "Session ID is expired. Please log in again.",
          expired: true,
        });
      }
      resolve({
        sessionExpiresIn: user.sessionExpiresAt - currentTime,
        userId: user._id,
      });
      logger.info(`${email}-Session is active`);
    } catch (error) {
      console.error(error);
      reject({ message: "An error occurred while checking the session ID." });
    }
  });
};

// Refresh Token Service
exports.refreshToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const newToken = jwt.sign(
        { email: decoded.email, userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      resolve({ success: true, token: newToken });
      logger.info(`${email}-token refreshed successfully`);
    } catch (err) {
      reject({ error: "Invalid or expired token" });
    }
  });
};
