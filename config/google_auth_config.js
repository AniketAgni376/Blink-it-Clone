var GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
 async function(accessToken, refreshToken, profile, cb) {
    try {
     let user =  await userModel.findOne({ email: profile.emails[0].value});
    } catch (err) {
      console.log(err);
    }
  }
));