const mongoose = require('mongoose');

const googleSchema = new mongoose.Schema({
  googleId: { type: String, required: false, unique: true },
  displayName: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  token: {
    type: String,
    required: false,
  },
  sessionId: { 
    type: String 
  },
  tokenExpiresAt: {
    type: Date,
  },
sessionExpiresAt: { 
  type: Date 
},
  loggedIn: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: null,
  }
}, { timestamps: true });

googleSchema.index({ googleId: 1, email: 1 }, { unique: true });

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
