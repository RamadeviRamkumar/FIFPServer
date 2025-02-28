const googleService = require("../../Service/O-Auth/googleService");


exports.loginSuccess = (req, res) => {
  console.log("User session data:", req.user);

  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Successfully Logged In",
      user: req.user,
      sessionExpiresIn: 59 * 60 * 1000, // Send 59 minutes expiration time
    });
  } else {
    res.status(401).json({ error: true, message: "Not Authorized" });
  }
};

// exports.loginSuccess = (req, res) => {
//   console.log("User session data:", req.user); // Debugging

//   if (req.user) {
//     res.status(200).json({
//       success: true,
//       message: "Successfully Logged In",
//       user: req.user,
//     });
//   } else {
//     res.status(401).json({ error: true, message: "Not Authorized" });
//   }
// };


exports.loginFailed = async (req, res) => {
  try {
    //#swagger.tags = ['Google-Login']
    return res.status(401).json({
      error: true,
      message: "Log in failure",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    //#swagger.tags = ['Google-Login']
    req.logout((err) => {
      if (err) return res.status(500).json({ error: true, message: "Logout failed" });
      req.session.destroy(() => {
        res.json({ message: "Logged out successfully" });
      });
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

exports.handleAuthSuccess = (req, res) => {
  try {
    //#swagger.tags = ['Google-Login']
    if (!req.user) {
      return res.status(403).json({ error: true, message: "User not authenticated" });
    }
    return res.status(201).json({
      message: "Authentication Successful",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};
