const emailService = require("../../Service/Login/emailService");
// const logger = require("../../utils/logger");
const regex = require("../../Regex/regex");

exports.signIn = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { email } = req.body;

  if (email && !regex.email.test(email)) {
    logger.error(`${email}-Email is Should be required correct Format`);
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "Email is Should be required correct Format",
    });
  }

  emailService
    .signIn(email)
    .then((response) => {
      if (response.message === "User is already logged in") {
        return res.status(200).json({ message: response.message });
      }
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

// Verify OTP
exports.verifyOTP = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { email, otp } = req.body;

  if (!email || !otp) {
    logger.error(`${email}-Email and OTP are required`);
    return res.status(200).json({
      statusCode: "1",
      success: "false",
      message: "Email and OTP are required",
    });
  }

  emailService
    .verifyOTP(email, otp)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

// Logout
exports.logout = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { userId } = req.body;

  if (!userId) {
    logger.error(`${email}-User ID is required`);
    return res.status(200).json({
      statusCode: "1",
      success: "false",
      message: "User ID is required",
    });
  }

  emailService
    .logout(userId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

// Validate Token
exports.Validate = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { email, token } = req.body;

  if (!email || !token) {
    logger.error(`${email}-Email and token are required`);
    return res.status(200).json({
      statusCode: "1",
      success: "false",
      message: "Email and token are required",
    });
  }

  emailService
    .Validate(email, token)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

// Check Session
exports.checkSession = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { sessionId } = req.body;

  if (!sessionId) {
    logger.error(`${email}-Session ID is required`);
    return res.status(200).json({
      statusCode: "1",
      success: "false",
      message: "Session ID is required",
    });
  }

  emailService
    .checkSession(sessionId)
    .then((response) => {
      res.status(201).json({
        statusCode: "0",
        success: "true",
        message: "Session is active",
        sessionExpiresIn: response.sessionExpiresIn,
        userId: response.userId,
      });
    })
    .catch((error) => {
      const statusCode = error.expired ? "1" : "1";
      res.status(200).json({
        statusCode,
        success: "false",
        message: error.message,
      });
    });
};

// Refresh Token
exports.refreshToken = (req, res) => {
  //#swagger.tags = ['Login-User']
  const { token } = req.body;

  if (!token) {
    logger.error(`${email}-Token is required`);
    return res.status(200).json({
      statusCode: "1",
      success: "false",
      message: "Token is required",
    });
  }

  emailService
    .refreshToken(token)
    .then((response) => {
      res.status(201).json({
        statusCode: "0",
        success: "true",
        message: response.message,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        statusCode: "1",
        success: "false",
        message: "Failed to refresh token",
      });
    });
};
