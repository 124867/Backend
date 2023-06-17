const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/userModel');
const session = require('express-session');

// Configure Google OAuth2.0 strategy
passport.use(new GoogleStrategy({
  clientID: "206874384432-factqaf2cgcu9860ukbsssgnq61jobls.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "https://backend.qwe1qwe2.repl.co/user/auth/google/callback"
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      const user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        role: 'user'
      });
      await user.save();
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));

// Serialize user information for session storage
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user information from session storage
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).populate('favorites');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = {
  passport: passport
};