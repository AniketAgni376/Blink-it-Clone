// models/cartModel.js
const mongoose = require("mongoose");
const Joi = require("joi");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // should match your user model
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // should match your product model
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// Joi validation function
function validateCart(cart) {
  const schema = Joi.object({
    user: Joi.string().hex().length(24).required(), // ObjectId validation
    products: Joi.array()
      .items(Joi.string().hex().length(24).required())
      .min(1)
      .required(),
    totalPrice: Joi.number().min(0).required(),
  });

  return schema.validate(cart);
}

const cartModel = mongoose.model("cartModel", cartSchema);

module.exports = { cartModel, validateCart };
