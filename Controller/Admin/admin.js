const adminService = require('../../Service/Admin/adminService');

exports.getUserData = (req, res) => {
  //#swagger.tags=['Admin-Setting']

  adminService
    .getAll()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      if (error.statusCode === "1" && error.message === "Users details could not be found") {
        return res.status(200).json({
          message: error.message,
        });
      }
      console.log(error);
      res.status(500).json({ error: "Internal Server error" });
    });
};

exports.getAllUser = (req, res) => {
  //#swagger.tags=['Admin-Setting']
  adminService
    .getAllUsers()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      if (error.statusCode === "1" && error.message === "Users details could not be found") {
        return res.status(200).json({
          message: error.message,
        });
      }
      console.log(error);
      res.status(500).json({ error: "Internal Server error" });
    });
}