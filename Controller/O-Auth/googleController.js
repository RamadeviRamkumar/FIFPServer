const googleService = require("../../Service/O-Auth/googleService");

exports.loginSuccess = async (req, res) => {
  //#swagger.tags = ['Google-Login']
  try {
    if (req.user) {
      res.status(200).json({
        error: false,
        message: "Successfully Logged In",
        user: req.user,
      });
    } else {
      res.status(403).json({ error: true, message: "Not Authorized" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.loginFailed = async (req, res) => {
  //#swagger.tags = ['Google-Login']
  try {
    res.status(401).json({
      error: true,
      message: "Log in failure",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.logout = async (req, res) => {
  //#swagger.tags = ['Google-Login']
  try {
    await googleService.handleLogout(req);
    const logoutURL = googleService.getGoogleLogoutUrl();
    res.redirect(logoutURL);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};


exports.handleAuthSuccess = (req, res) => {
  res.json({
    message: 'Authentication Successful',
    user: req.user,
  });
};

// exports.logout = (req, res) => {
//   req.logout((err) => {
//     if (err) return res.status(500).send({ error: 'Logout failed' });
//     res.json({ message: 'Logged out successfully' });
//   });
// };