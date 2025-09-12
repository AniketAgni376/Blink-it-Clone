// models/adminModel.js
const mongoose = require("mongoose");
const Joi = require("joi");

// Admin schema with validation
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // email regex
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/, // 10-digit phone number
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"], // example roles
      default: "admin",
    },
  },
  { timestamps: true }
);

// Joi validation
function validateAdmin(admin) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    role: Joi.string().valid("superadmin", "admin").optional(),
  });

  return schema.validate(admin);
}

const adminModel = mongoose.model("adminModel", adminSchema);

module.exports = { adminModel, validateAdmin };
