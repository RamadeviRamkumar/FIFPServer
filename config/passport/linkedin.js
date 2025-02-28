// // const passport = require("passport");
// // const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
// // const secretValue = require("../../config/secretCode/password");

// // // Add your LinkedIn credentials
// // passport.use(
// //   new LinkedInStrategy(
// //     {
// //       clientID: secretValue.LINKEDIN_KEY,
// //       clientSecret: secretValue.LINKEDIN_SECRET,
// //       callbackURL: secretValue.CALLBACK_URL, // Replace with your callback URL
// //       scope: ["r_emailaddress", "r_liteprofile"], // Requested permissions
// //     },
// //     async (accessToken, refreshToken, profile, done) => {
// //       try {
// //         console.log("LinkedIn Profile:", profile);
// //         const user = { id: profile.id, name: profile.displayName, email: profile.emails?.[0]?.value };
// //         return done(null, user);
// //       } catch (err) {
// //         return done(err, null);
// //       }
// //     }
// //   )
// // );

// // // Serialize and deserialize user for session management
// // passport.serializeUser((user, done) => {
// //   done(null, user);
// // });

// // passport.deserializeUser((user, done) => {
// //   done(null, user);
// // });

// require('dotenv').config(); // This must be at the top!

// const passport = require("passport");
// const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;


// passport.use(
//   new LinkedInStrategy(
//     {
//       clientID: process.env.LINKEDIN_KEY, // Ensure this is not undefined
//       clientSecret: process.env.LINKEDIN_SECRET,
//       callbackURL: "http://148.135.137.252:7000/api/linkedin/callback",
//       scope: ["email", "profile"],
//     },
//     (accessToken, refreshToken, profile, done) => {
//       process.nextTick(() => {
//         return done(null, profile);
//       });
//     }
//   )
// );
