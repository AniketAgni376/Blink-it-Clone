// models/deliveryModel.js
const mongoose = require("mongoose");
const Joi = require("joi");

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    deliveryBoy: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "out-for-delivery", "delivered", "cancelled"],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    trackingURL: {
      type: String,
    },
    estimatedDeliveryTime: {
      type: Number, // in hours or minutes depending on your design
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// Joi validation function
function validateDelivery(delivery) {
  const schema = Joi.object({
    order: Joi.string().hex().length(24).required(), // ObjectId validation
    deliveryBoy: Joi.string().min(3).max(50).required(),
    status: Joi.string()
      .valid("pending", "shipped", "out-for-delivery", "delivered", "cancelled")
      .optional(),
    totalPrice: Joi.number().min(0).required(),
    trackingURL: Joi.string().uri(),
    estimatedDeliveryTime: Joi.number().min(0).required(),
  });

  return schema.validate(delivery);
}

const deliveryModel = mongoose.model("Delivery", deliverySchema);

module.exports = { deliveryModel, validateDelivery };
