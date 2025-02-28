const googleService = require("../../Service/O-Auth/googleService");

exports.loginSuccess = (req, res) => {
  //#swagger.tags = ['Google-Login']
  return new Promise((resolve, reject) => {
    if (req.user) {
      resolve({
        success: true,
        message: "Successfully Logged In",
        user: req.user,
      });
    } else {
      reject({ error: true, message: "Not Authorized" });
    }
  })
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(500).json(error));
};

exports.loginFailed = (req, res) => {
  //#swagger.tags = ['Google-Login']
  return new Promise((resolve) => {
    resolve({
      success: true,
      message: "Log in failure",
    });
  })
    .then((data) => res.status(201).json(data))
    .catch((error) =>
      res.status(500).json({ error: true, message: error.message })
    );
};

exports.logout = (req, res) => {
  //#swagger.tags = ['Google-Login']
  return new Promise((resolve, reject) => {
    req.logout((err) => {
      if (err) {
        reject({ error: true, message: "Logout failed" });
      } else {
        req.session.destroy(() => {
          resolve({ message: "Logged out successfully" });
        });
      }
    });
  })
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(500).json(error));
};

exports.handleAuthSuccess = (req, res) => {
  //#swagger.tags = ['Google-Login']
  return new Promise((resolve, reject) => {
    if (!req.user) {
      reject({ error: true, message: "User not authenticated" });
    } else {
      resolve({
        message: "Authentication Successful",
        user: req.user,
      });
    }
  })
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(500).json(error));
};
