var GoogleStrategy = require("passport-google-oauth20").Strategy;
const { userModel } = require("../models/user");
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        `${process.env.APP_BASE_URL || "http://localhost:3000"}/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) return cb(null, false);

        let user = await userModel.findOne({ email });
        if (!user) {
          // Do not create users without a phone; force signup flow to collect phone
          return cb(null, false);
        }
        return cb(null, user);
      } catch (err) {
        return cb(err, false);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  return cb(null, user._id);
});

passport.deserializeUser(async function (id, cb) {
  let user = await userModel.findOne({ _id: id });
  cb(null, user);
});

module.exports = passport;
