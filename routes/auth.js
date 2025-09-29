const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config();



router.get('/google', 
    passport.authenticate("google", {
    scope: ['profile', 'email'],
  }) 
    
);

router.get('/google/callback', 
  passport.authenticate('google', { 
    successRedirect: '/profile',
    failureRedirect: '/', 
  }),
  
);

router.get('/logout', function(req, res, next){
  req.logout(function (err) {
    if (err) { 
      return next(err); 
    }
    res.redirect('/');
  });
});

    module.exports = router;