const googleDao = require("../../Dao/O-Auth/googleDao");
require('dotenv').config();

exports.createGoogleUser = async (profile) => {
  try {
    console.log("Full Google Profile Object:", JSON.stringify(profile, null, 2));

    // Extract values safely
    const googleId = profile.id || profile.sub;
    const displayName = profile.displayName || profile.name || profile.given_name;
    const email = profile.emails?.[0]?.value;

    // Check if required fields are missing
    if (!googleId || !displayName || !email) {
      console.error("Missing required user data:", { googleId, displayName, email });
      throw new Error("Missing required Google user data: googleId, displayName, or email");
    }

    console.log("Extracted User Data:", { googleId, displayName, email });

    // Check if user already exists
    const existingUser = await googleDao.findUserByGoogleId(googleId);
    if (existingUser) {
      console.log("Existing User Found:", existingUser);
      return existingUser;
    }

    // Create new user
    const newUser = await googleDao.createGoogleUser({ googleId, displayName, email });
    console.log("New User Created:", newUser);
    return newUser;
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
