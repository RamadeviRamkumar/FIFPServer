const Google = require("../../Models/O-Auth/googleModel");

exports.findUserByGoogleId = (googleId) => {
  return Google.findOne({ googleId })
    .then(user => {
      if (!user) throw new Error("User not found with given Google ID");
      return user;
    })
    .catch(error => {
      throw new Error("Error finding user by Google ID: " + error.message);
    });
};

exports.createGoogleUser = async (profile) => {
  try {
    const newUser = new User({
      googleId: profile.googleId,
    name: profile.displayName,
    email: profile.email,
    accessToken: profile.accessToken,
    refreshToken: profile.refreshToken,
    tokenExpiry: profile.tokenExpiry,
    });
    
    return await newUser.save();
  } catch (error) {
    throw new Error("Error creating new user");
  }
};

// exports.createGoogleUser = (profile) => {
//   const newUser = new Google({
//     googleId: profile.googleId,
//     name: profile.displayName,
//     email: profile.email,
//     accessToken: profile.accessToken,
//     refreshToken: profile.refreshToken,
//     tokenExpiry: profile.tokenExpiry, // Save token expiry time
//   });

//   return newUser.save();
// };


exports.findById = (id) => {
  return Google.findById(id)
    .then(user => {
      if (!user) throw new Error("User not found with given ID");
      return user;
    })
    .catch(error => {
      throw new Error("Error finding user by ID: " + error.message);
    });
};


exports.findByGoogleId = (googleId) => {
  return Google.findOne({ googleId })
    .then(user => {
      if (!user) throw new Error("User not found with given Google ID");
      return user;
    })
    .catch(error => {
      throw new Error("Error finding user by Google ID: " + error.message);
    });
};



// const Google = require("../../Models/O-Auth/googleModel");

// exports.findUserByGoogleId = async (googleId) => {
//   try {
//     return await Google.findOne({ googleId });
//   } catch (error) {
//     throw new Error("Error finding user by Google ID: " + error.message);
//   }
// };

// exports.createGoogleUser = async (profile) => {
//   try {
//     const newUser = new Google({
//       googleId: profile.id,
//       name: profile.displayName,
//       // email:profile.displayEmail
//       email: profile.emails[0].value, 
//     });
//     return await newUser.save();
//   } catch (error) {
//     throw new Error("Error creating new Google user: " + error.message);
//   }
// };

// exports.findById = (id) => Google.findById(id);

// exports.create = (userData) => Google.create(userData);

// exports.findByGoogleId = (googleId) => Google.findOne({ googleId });