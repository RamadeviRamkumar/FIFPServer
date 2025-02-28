const profileDao = require("../../Dao/Login/userDao");
const emailDao = require("../../Dao/Login/emailDao");
// const logger = require("../../utils/logger");

exports.create = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        userId,
        firstName,
        lastName,
        email = null,
        annualIncome = null,
        dob,
        gender = null,
        address1 = null,
        address2 = null,
        state = null,
        district = null,
        country = null,
        panCard = null,
        aadharCard = null,
        pincode = null,
        city = null,
        occupation = null,
        contactNumber,
      } = data;

      if (!userId || !firstName || !lastName || !dob || !contactNumber) {
        logger.error(
          `${userId}-Required fields are missing: userId, firstName, lastName, dob, contactNumber`
        );
        return reject({
          statusCode: "1",
          success: false,
          message:
            "Required fields are missing: userId, firstName, lastName, dob, contactNumber",
        });
      }

      const user = await emailDao.findUserById(userId);
      if (!user) {
        logger.error(`${userId}-user not found`);
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found!",
        });
      }

      const existingProfile = await profileDao.findProfile(userId);
      if (existingProfile) {
        logger.error(`${userId}-User profile already exists`);
        return reject({
          statusCode: "1",
          success: false,
          message: "User profile already exists. Please update instead.",
        });
      }

      const profileData = {
        userId,
        firstName,
        lastName,
        email,
        annualIncome,
        dob,
        gender,
        address1,
        address2,
        state,
        district,
        country,
        panCard,
        aadharCard,
        pincode,
        city,
        occupation,
        contactNumber,
      };

      const newProfile = await profileDao.createProfile(profileData);
      resolve({
        statusCode: "0",
        success: true,
        message: "User-profile Data created successfully!",
        profile: newProfile,
      });
    } catch (err) {
      reject({
        statusCode: "2",
        success: false,
        message: err.message || "Failed to create user profile",
      });
    }
  });
};

exports.getAll = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const profile = await profileDao.getUserByUserId(userId);

      if (!profile || profile.length === 0) {
        logger.error(`${userId}-No profiles found for the provided userId`);
        return reject({
          statusCode: "1",
          success: false,
          message: "No profiles found for the provided userId!",
        });
      }

      return resolve({
        statusCode: "0",
        success: true,
        message: "User-Profile Data retrieved successfully!",
        Profile: profile,
      });
    } catch (error) {
      logger.error(`${userId}-Internal server error`, error);
      return reject({
        statusCode: "2",
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.getUserProfileById = async (profileId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const profile = await profileDao.findProfileById(profileId);
      if (!profile) {
        return reject({
          statusCode: "1",
          success: false,
          message: "User-Profile data not found!",
        });
      }
      return resolve({
        statusCode: "0",
        success: true,
        message: "User-Profile Data retrived successfully!",
        Profile: profile,
      });
    } catch (error) {
      logger.error(`${userId}-Internal server error`, error);
      return reject({
        statusCode: "2",
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.deleteUserProfileById = async (profileId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const profile = await profileDao.findProfileById(profileId);
      if (!profile) {
        return reject({
          statusCode: "1",
          success: false,
          message: "User-Profile Data not found!",
        });
      }
      await profileDao.deleteProfileById(profileId);
      return resolve({
        statusCode: "0",
        success: true,
        message: "User-Profile Data deleted successfully!",
      });
    } catch (error) {
      return reject({
        statusCode: "2",
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.updateProfile = (profileId, profileData, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        firstName,
        lastName,
        email,
        annualIncome,
        dob,
        gender,
        address1,
        address2,
        state,
        district,
        country,
        panCard,
        aadharCard,
        pincode,
        city,
        occupation,
        contactNumber,
      } = profileData;

      const existingProfile = await profileDao.findProfileById(profileId);
      if (!existingProfile) {
        return reject({
          statusCode: "1",
          success: false,
          message: "User-profile data not found!",
        });
      }
      const updatedData = {
        firstName,
        lastName,
        email,
        annualIncome,
        dob,
        gender,
        address1,
        address2,
        state,
        district,
        country,
        panCard,
        aadharCard,
        pincode,
        city,
        occupation,
        contactNumber,
      };
      const updatedProfile = await profileDao.updateProfileById(
        profileId,
        updatedData
      );
      return resolve({
        statusCode: "0",
        success: true,
        message: "user-profile Data updated Successfully!",
        Profile: updatedProfile,
      });
    } catch (error) {
      return reject({
        statusCode: "2",
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};
