const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config();

// Define CLIENT_URL dynamically
const CLIENT_URL =
  process.env.CLIENT_URL ||
  (process.env.NODE_ENV === "production"
    && "http://localhost:3000");

// Step 1: Start Google OAuth flow
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Handle Google callback
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('❌ Google OAuth callback error:', err);
      return res.redirect(`${CLIENT_URL}/?oauth_error=token`);
    }
    if (!user) {
      console.error('❌ Google OAuth failed, no user returned. Info:', info);
      return res.redirect(`${CLIENT_URL}/?oauth_error=denied`);
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('❌ Google OAuth login error:', loginErr);
        return res.redirect(`${CLIENT_URL}/?oauth_error=login`);
      }
      // ✅ Redirect to /products page after login
      return res.redirect(`${CLIENT_URL}/products`);
    });
  })(req, res, next);
});

// Step 3: Logout route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(CLIENT_URL);
  });
});

module.exports = router;
