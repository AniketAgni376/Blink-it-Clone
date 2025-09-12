var GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user');
const passport = require('passport');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
 async function(accessToken, refreshToken, profile, cb) {
    try {
     let user =  await userModel.findOne({ email: profile.emails[0].value});
    
    if(!user){
         user = await userModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
           
        });
        await user.save();
        cb(null, user);
    }
    
    } catch (err) {
      cb(err, false);
    }
  }
));

passport.serializeUser(function(user, cb) {
    cb(null, user._id);
});


passport.deserializeUser(async function(id, cb) {
   let user = await userModel.findById({ _id: id}); 
    cb(null, user);
});


module.exports = passport;