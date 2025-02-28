require("dotenv").config();
const express = require("express");
const router = express.Router();
const Google = require("../../Controller/O-Auth/googleController");
const passport = require("../../config/passport/google");

// Login success route
router.get("/login/success", Google.loginSuccess);

// Login failure route
router.get("/login/failed", Google.loginFailed);

// Google authentication route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback route
// router.get(
//   "/callback",
//   passport.authenticate("google", {
//     successRedirect: process.env.CLIENT_URL || "/",
//     failureRedirect: "/login/failed",
//     session: false,
//   })
// );
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login/failed" }),
  (req, res) => {
    res.redirect("/dashboard"); // Redirect after successful login
  }
);

// Logout route
router.get("/logout", Google.logout);

module.exports = router;
