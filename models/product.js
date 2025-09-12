// models/productModel.js
const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// Joi validation function
function validateProduct(product) {
  const schema = Joi.object({
    state: Joi.string().min(2).max(100).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    stock: Joi.boolean().optional(),
    description: Joi.string().required(),
    image: Joi.string().required(),
  });

  return schema.validate(product);
}

const productModel = mongoose.model("Product", productSchema);

module.exports = { productModel, validateProduct };
