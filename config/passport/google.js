const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const googleService = require("../../Service/O-Auth/googleService");
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID, // process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await googleService.createGoogleUser(profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((googleUser, done) => {
  done(null, googleUser);
});

passport.deserializeUser((googleUser, done) => {
  done(null, googleUser);
});

module.exports = passport;

// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const Google = require('../../Models/O-Auth/googleModel');
// const secretValue = require('../secretCode/password');

// passport.use(new GoogleStrategy({
//   clientID: secretValue.CLIENT_ID,
//   clientSecret: secretValue.CLIENT_SECRET,
//   callbackURL: secretValue.CALLBACK_URL,
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await Google.findOne({ googleId: profile.id });
//     if (!user) {
//       user = await Google.create({
//         googleId: profile.id,
//         email: profile.emails[0].value,
//         name: profile.displayName,
//         refreshToken,
//       });
//     }
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// }));

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });
