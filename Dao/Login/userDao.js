const Profile = require("../../Models/Login/userModel");
const User = require("../../Models/Login/emailModel");

exports.findUserById = async (id) => {
  return await User.findById(id);
};

exports.findUserProfileById = async (userId) => {
  return await Profile.findOne(userId);
};

exports.createProfile = async (profileData) => {
  const profile = new Profile(profileData);
  return await profile.save();
};

exports.findProfile = async(userId) => {
  return await Profile.findOne({userId});
};

exports.findUserByprofileId = async (userId) => {
  return await Profile.findOne({ userId });
};

exports.createProfilePic = async (data) => {
  const { userId, profile } = data;
  return await Profile.findOneAndUpdate(
    { userId },
    { profile },
    { new: true, upsert: true } 
  );
};

exports.getUserByUserId = async (userId) =>{
  return Profile.find({ userId });
};

exports.findProfileById = (profileId) => {
  return Profile.findById(profileId);
};

exports.deleteProfileById = async (profileId) => {
  return await Profile.deleteOne({ _id: profileId });
};

exports.updateProfileById = async (profileId, updatedData) => {
  return await Profile.findByIdAndUpdate(profileId, updatedData, { new: true });
};

