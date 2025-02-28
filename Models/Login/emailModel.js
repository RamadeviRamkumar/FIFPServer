const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
      required: false,
    },
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

