// models/orderModel.js
const mongoose = require("mongoose");
const Joi = require("joi");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      required: false,
    },
  },
  { timestamps: true }
);

// Joi validation function
function validateOrder(order) {
  const schema = Joi.object({
    user: Joi.string().hex().length(24).required(), // ObjectId
    products: Joi.array()
      .items(Joi.string().hex().length(24).required())
      .min(1)
      .required(),
    totalPrice: Joi.number().min(0).required(),
    address: Joi.string().min(5).required(),
    status: Joi.string()
      .valid("pending", "confirmed", "shipped", "delivered", "cancelled")
      .optional(),
    payment: Joi.string().hex().length(24).required(),
    delivery: Joi.string().hex().length(24).optional(),
  });

  return schema.validate(order);
}

const orderModel = mongoose.model("Order", orderSchema);

module.exports = { orderModel, validateOrder };
