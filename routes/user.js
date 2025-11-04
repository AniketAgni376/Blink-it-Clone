const express = require("express");
const router = express.Router();
const { userModel, validateUser } = require("../models/user");
const mongoose = require("mongoose");

router.get("/login", (req, res) => {
  res.render("user_login");
});

router.get("/profile", (req, res) => {
  res.send("profile page");
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.redirect("/users/login");
    });
  });
});

module.exports = router;

// Signup route
router.post("/signup", async (req, res) => {
  try {
    // backend validation
    const { error, value } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { name, email, password, phone, addresses } = value;

    // enforce not null/empty at backend too
    if (!phone || typeof phone !== "string" || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Phone must be a 10-digit string." });
    }

    const existing = await userModel.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      const conflictField = existing.email === email ? "email" : "phone";
      return res.status(409).json({ success: false, message: `${conflictField} already in use.` });
    }

    const user = new userModel({ name, email, password, phone, addresses });
    await user.save();

    return res.status(201).json({ success: true, userId: user._id });
  } catch (err) {
    // Duplicate key error from MongoDB
    if (err && err.code === 11000) {
      if (err.keyPattern && err.keyPattern.phone) {
        return res.status(409).json({ success: false, message: "Phone already in use." });
      }
      if (err.keyPattern && err.keyPattern.email) {
        return res.status(409).json({ success: false, message: "Email already in use." });
      }
      return res.status(409).json({ success: false, message: "Duplicate key error." });
    }

    // Mongoose validation errors
    if (err instanceof mongoose.Error.ValidationError) {
      const first = Object.values(err.errors)[0];
      return res.status(400).json({ success: false, message: first.message });
    }

    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});
