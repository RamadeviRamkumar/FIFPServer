const Google = require("../../Models/O-Auth/googleModel");

exports.findUserByGoogleId = async (googleId) => {
  try {
    return await Google.findOne({ googleId });
  } catch (error) {
    throw new Error("Error finding user by Google ID: " + error.message);
  }
};

exports.createGoogleUser = async (profile) => {
  try {
    const newUser = new Google({
      googleId: profile.id,
      name: profile.displayName,
      email:profile.displayEmail
      // email: profile.emails[0].value, 
    });
    return await newUser.save();
  } catch (error) {
    throw new Error("Error creating new Google user: " + error.message);
  }
};

exports.findById = (id) => Google.findById(id);

exports.create = (userData) => Google.create(userData);

exports.findByGoogleId = (googleId) => Google.findOne({ googleId });