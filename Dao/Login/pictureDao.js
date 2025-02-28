const ProfilePicture = require("../../Models/Login/pictureModel");
const User = require("../../Models/Login/emailModel");

exports.findUserById = async (userId) => {
    return await User.findOne({ userId });
}

exports.getUserByUserId = async (userId) => {
    return ProfilePicture.findOne({ userId });
}; 

exports.findByuserId = async (userId)=> {
    return User.findById(userId);
}; 