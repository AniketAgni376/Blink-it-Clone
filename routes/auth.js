const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config();



router.get('/google', 
    passport.authenticate("google", {
    scope: ['profile', 'email'],
  }) 
    
);

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('❌ Google OAuth callback error:', err);
      return res.redirect('/?oauth_error=token');
    }
    if (!user) {
      console.error('❌ Google OAuth failed, no user returned. Info:', info);
      return res.redirect('/?oauth_error=denied');
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('❌ Google OAuth login error:', loginErr);
        return res.redirect('/?oauth_error=login');
      }
      return res.redirect('/products');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res, next){
  req.logout(function (err) {
    if (err) { 
      return next(err); 
    }
    res.redirect('/');
  });
});

    module.exports = router;