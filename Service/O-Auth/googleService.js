const googleDao = require("../../Dao/O-Auth/googleDao");
require('dotenv').config();

exports.createGoogleUser = async (profile) => {
  try {
    console.log("Google Profile:", profile); // Debugging

    const existingUser = await googleDao.findUserByGoogleId(profile.id);
    if (existingUser) {
      console.log("Existing User Found:", existingUser);
      return existingUser;
    } else {
      // Ensure profile.id and profile.emails[0]?.value exist
      if (!profile.id || !profile.emails || !profile.emails[0]?.value) {
        throw new Error("Google profile missing required fields");
      }

      const newUser = await googleDao.createGoogleUser({
        googleId: profile.id,  // Ensure this is set correctly
        displayName: profile.displayName || profile.name?.givenName, 
        email: profile.emails[0]?.value, 
      });

      console.log("New User Created:", newUser);
      return newUser;
    }
  } catch (error) {
    console.error("Error creating Google user:", error.message);
    throw new Error("Error creating Google user: " + error.message);
  }
};

exports.getGoogleLogoutUrl = () => {
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
    const user = await googleDao.findById(userId);
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
