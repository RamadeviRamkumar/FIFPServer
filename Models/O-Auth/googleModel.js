const mongoose = require('mongoose');

const googleSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true }, // Ensure required
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, {
    timestamps: true 
});


module.exports = mongoose.model('Google', googleSchema);


// const mongoose = require("mongoose");

// const googleUserSchema = new mongoose.Schema({
//   googleId: { type: String, required: true, unique: true },
//   displayName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);

// module.exports = GoogleUser;
