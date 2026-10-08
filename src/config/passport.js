const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
        // Trust Render's proxy so the relative callback URL resolves to https
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find the user by OAuth ID, or create an account on first login
          let user = await User.findOne({ oauthId: profile.id });

          if (!user) {
            const email = profile.emails?.[0]?.value;

            // Link to an existing account with the same email (e.g. created via POST /users)
            user = await User.findOne({ email });

            if (user) {
              user.oauthId = profile.id;
              await user.save();
            } else {
              user = await User.create({
                oauthId: profile.id,
                displayName: profile.displayName,
                email
              });
            }
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
