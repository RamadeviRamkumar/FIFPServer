const linkedDao = require("../../Dao/O-Auth/linkedDao");
// const secretValue = require("../../config/secretCode/password");
require('dotenv').config();

exports.createLinkedUser = async (profile) => {
  try {
    console.log("LinkedIn Profile:", profile);
    const existingUser = await linkedDao.findUserByLinkedInId(profile.id);
    if (existingUser) {
      console.log("Existing User Found:", existingUser);
      return existingUser;
    } else {
        let user = await linkedDao.findOne({ linkedInId: profile.id });
        if (!user) {
          user = await linkedDao.create({
            linkedInId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            accessToken: accessToken,
          });
        }
        return done(null, user);
    }
  } catch (error) {
    console.error("Error creating Google user:", error.message);
    throw new Error("Error creating Google user: " + error.message);
  }
};

exports.getLinkedInLogoutUrl = () => {
  return `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${process.env.CLIENT_URL1}`;
};

exports.handleLogout = (req) => {
  return new Promise((resolve, reject) => {
    req.logout((err) => {
      if (err) return reject(new Error("Error logging out"));
      req.session = null;
      resolve();
    });
  });
};

exports.refreshToken = async (userId) => {
  try {
    const user = await linkedDao.findById(userId);
    if (!user || !user.refreshToken) {
      throw new Error("Refresh token not found");
    }

    console.log("Refresh token logic needs implementation for user:", user);
    return user.refreshToken;
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    throw new Error("Error refreshing token: " + error.message);
  }
};
