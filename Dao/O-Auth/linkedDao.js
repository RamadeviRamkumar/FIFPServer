const LinkedIn = require("../../Models/O-Auth/linkedModel");

exports.findUserByLinkedInId = async (linkedInId) => {
  try {
    return await LinkedIn.findOne({ linkedInId });
  } catch (error) {
    throw new Error("Error finding user by Google ID: " + error.message);
  }
};

exports.createLinkedInUser = async (profile) => {
  try {
    const newUser = new Google({
      linkedInId: profile.id,
      name: profile.displayName,
      email:profile.displayEmail
      // email: profile.emails[0].value, 
    });
    return await newUser.save();
  } catch (error) {
    throw new Error("Error creating new Google user: " + error.message);
  }
};

exports.findById = (id) => LinkedIn.findById(id);

exports.create = (userData) => LinkedIn.create(userData);

exports.findByGoogleId = (googleId) => LinkedIn.findOne({ googleId });