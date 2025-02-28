const linkedService = require("../../Service/O-Auth/linkedService");

exports.loginSuccess = async (req, res) => {
  //#swagger.tags = ['LinkedIn-Login']
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
  //#swagger.tags = ['LinkedIn-Login']
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
  //#swagger.tags = ['LinkedIn-Login']
  try {
    await linkedService.handleLogout(req);
    const logoutURL = linkedService.getLinkedInLogoutUrl();
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