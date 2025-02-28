const googleDao = require("../../Dao/O-Auth/googleDao");
require('dotenv').config();

exports.createGoogleUser = async (profile) => {
  try {
    console.log("Full Google Profile:", JSON.stringify(profile, null, 2));

    const googleId = profile.id || profile.sub;
    const displayName = profile.displayName || profile.name || profile.given_name || "Unknown User";
    const email = profile.emails?.[0]?.value || "no-email@example.com"; 

    if (!googleId || !email) {
      console.error("Missing required Google user data:", { googleId, displayName, email });
      throw new Error("Missing required Google user data.");
    }

    console.log("Extracted User Data:", { googleId, displayName, email });

    const existingUser = await googleDao.findUserByGoogleId(googleId);
    if (existingUser) {
      console.log("Existing User Found:", existingUser);
      return existingUser;
    }

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
