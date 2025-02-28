const User = require("../../Models/Login/emailModel");

exports.getAllUsers = async () => {
  return await User.find();
};

