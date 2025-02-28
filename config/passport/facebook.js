// const passport = require('passport')
// const FacebookStrategy = require('passport-facebook').Strategy;
// const secretValue = require('../../config/secretCode/password');

// passport.use(new FacebookStrategy({
//     clientID:secretValue.FACEBOOK_APP_ID,
//     clientSecret: secretValue.FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:5000/fb/facebook/callback",
//     scope: ['user_friends', 'manage_pages']
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const secretValue = require('../../config/secretCode/password');
const facebookService = require('../../Service/O-Auth/facebookService');

passport.use(
  new FacebookStrategy(
    {
      clientID: secretValue.FACEBOOK_APP_ID,
      clientSecret: secretValue.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:7000/api/facebook/facebook/callback",
      profileFields: ['id', 'displayName', 'email'], // Ensures fetching email and public profile
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await facebookService.createFacebookUser(profile); // Use your service logic
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await facebookService.findUserByFacebookId(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
