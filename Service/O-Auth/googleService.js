const googleDao = require("../../Dao/O-Auth/googleDao");
const axios = require("axios"); // Missing import for refresh token handling
require("dotenv").config();

exports.createGoogleUser = (profile) => {
  console.log("Google Profile:", profile); // Debugging

  return googleDao.findUserByGoogleId(profile.id)
    .then((existingUser) => {
      if (existingUser) {
        console.log("Existing User Found:", existingUser);
        return existingUser;
      }

      // Ensure profile.id and profile.emails[0]?.value exist
      if (!profile.id || !profile.emails || !profile.emails[0]?.value) {
        throw new Error("Google profile missing required fields");
      }

      return googleDao.createGoogleUser({
        googleId: profile.id, // Ensure this is set correctly
        displayName: profile.displayName || profile.name?.givenName,
        email: profile.emails[0]?.value,
      });
    })
    .then((newUser) => {
      console.log("New User Created:", newUser);
      return newUser;
    })
    .catch((error) => {
      console.error("Error creating Google user:", error.message);
      throw new Error("Error creating Google user: " + error.message);
    });
};

exports.getGoogleLogoutUrl = () => {
  return `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${process.env.CLIENT_URL1}`;
};

exports.handleLogout = (req) => {
  return new Promise((resolve, reject) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout Error:", err);
        return reject(new Error("Error logging out"));
      }
      req.session = null;
      resolve();
    });
  });
};

exports.refreshToken = (userId) => {
  return googleDao.findById(userId)
    .then((user) => {
      if (!user || !user.refreshToken) {
        throw new Error("Refresh token not found");
      }

      return axios.post("https://oauth2.googleapis.com/token", {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: user.refreshToken,
        grant_type: "refresh_token",
      });
    })
    .then((response) => {
      if (response.data.access_token) {
        console.log("New Access Token:", response.data.access_token);
        return response.data.access_token;
      }
      throw new Error("Failed to refresh token");
    })
    .catch((error) => {
      console.error("Error refreshing token:", error.message);
      throw new Error("Error refreshing token: " + error.message);
    });
};


// const googleDao = require("../../Dao/O-Auth/googleDao");
// require('dotenv').config();

// exports.createGoogleUser = async (profile) => {
//   try {
//     console.log("Google Profile:", profile); // Debugging

//     const existingUser = await googleDao.findUserByGoogleId(profile.id);
//     if (existingUser) {
//       console.log("Existing User Found:", existingUser);
//       return existingUser;
//     } else {
//       // Ensure profile.id and profile.emails[0]?.value exist
//       if (!profile.id || !profile.emails || !profile.emails[0]?.value) {
//         throw new Error("Google profile missing required fields");
//       }

//       const newUser = await googleDao.createGoogleUser({
//         googleId: profile.id,  // Ensure this is set correctly
//         displayName: profile.displayName || profile.name?.givenName, 
//         email: profile.emails[0]?.value, 
//       });

//       console.log("New User Created:", newUser);
//       return newUser;
//     }
//   } catch (error) {
//     console.error("Error creating Google user:", error.message);
//     throw new Error("Error creating Google user: " + error.message);
//   }
// };

// exports.getGoogleLogoutUrl = () => {
//   return `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${process.env.CLIENT_URL1}`;
// };

// exports.handleLogout = (req) => {
//   return new Promise((resolve, reject) => {
//     try {
//       req.logout(); // Express 4+ does not require a callback
//       req.session = null;
//       resolve();
//     } catch (error) {
//       reject(new Error("Error logging out"));
//     }
//   });
// };


// exports.refreshToken = async (userId) => {
//   try {
//     const user = await googleDao.findById(userId);
//     if (!user || !user.refreshToken) {
//       throw new Error("Refresh token not found");
//     }

//     const response = await axios.post('https://oauth2.googleapis.com/token', {
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       refresh_token: user.refreshToken,
//       grant_type: 'refresh_token',
//     });

//     if (response.data.access_token) {
//       console.log("New Access Token:", response.data.access_token);
//       return response.data.access_token;
//     } else {
//       throw new Error("Failed to refresh token");
//     }
//   } catch (error) {
//     console.error("Error refreshing token:", error.message);
//     throw new Error("Error refreshing token: " + error.message);
//   }
// };
