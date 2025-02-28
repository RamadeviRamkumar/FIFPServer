const googleDao = require("../../Dao/O-Auth/googleDao");
require('dotenv').config();;

exports.createGoogleUser = async (profile) => {
  try {
    console.log("Google Profile:", JSON.stringify(profile, null, 2)); // Log the full profile object

    if (!profile.id || !profile.emails || profile.emails.length === 0) {
      throw new Error("Invalid Google profile data: Missing googleId or email");
    }

    const existingUser = await googleDao.findUserByGoogleId(profile.id);
    if (existingUser) {
      console.log("Existing User Found:", existingUser);
      return existingUser;
    } else {
      const newUser = await googleDao.createGoogleUser({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0]?.value, // Ensure email exists
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
