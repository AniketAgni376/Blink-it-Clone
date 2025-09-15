// models/userModel.js
const mongoose = require("mongoose");
const Joi = require("joi");

// Address sub-schema with validation
const AddressSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  zipcode: {
    type: Number,
    required: true,
    min: 10000, // assuming Indian PIN format
    max: 999999,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
});

// Main user schema
const userSchema = new mongoose.Schema(
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
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // basic email regex
    },
    password: {
      type: String,
      minlength: 6,
    },
    phone: {
      type: Number,
      unique: true,
      match: /^[0-9]{10}$/, // 10-digit phone number
    },
    addresses: {
      type: [AddressSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
  },
  { timestamps: true }
);

// JOI validation function
function validateUser(user) {
  const addressSchema = Joi.object({
    state: Joi.string().min(2).required(),
    zipcode: Joi.number().integer().min(100000).max(999999).required(),
    city: Joi.string().required(),
    address: Joi.string().min(5).required(),
  });

  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    addresses: Joi.array().items(addressSchema).min(1).required(),
  });

  return schema.validate(user);
}

const userModel = mongoose.model("user", userSchema);

module.exports = { userModel, validateUser };
