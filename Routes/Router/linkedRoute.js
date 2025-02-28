// const router = require("express").Router();
// const passport = require("../../config/passport/linkedin");
// const linkedIn = require("../../Controller/O-Auth/linkedController");
// // const secretValue = require("../../config/secretCode/password");
// require('dotenv').config();

// // router.get("/login/success", (req, res) => {
// //   if (req.user) {
// //     res.status(200).json({
// //       error: false,
// //       message: "Successfully Logged In",
// //       user: req.user,
// //     });
// //   } else {
// //     res.status(403).json({ error: true, message: "Not Authorized" });
// //   }
// // });

// router.get("/login/success", linkedIn.loginSuccess);

// router.get("/login/failed", (req, res) => {
//   res.status(401).json({
//     error: true,
//     message: "Log in failure",
//   });
// });

// router.get(
//     "/linkedin",
//     passport.authenticate("linkedin", { scope: ["email", "profile"] })
//   );
  
  
//   router.get(
//     "/callback",
//     passport.authenticate("linkedin", {
//       successRedirect: process.env.CLIENT_LINKED_URL,
//       failureRedirect: "/login",
//     })
//   );

// router.get("/logout", (req, res) => {
//   req.logout();

//   req.session = null;

//   const logoutURL = `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${process.env.CLIENT_URL1}`;
//   res.redirect(logoutURL);
// });

// module.exports = router;
