// models/paymentModel.js
const mongoose = require("mongoose");
const Joi = require("joi");

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      
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
  },
  { timestamps: true }
);

// Joi validation function
function validatePayment(payment) {
  const schema = Joi.object({
    order: Joi.string().hex().length(24).required(),
    amount: Joi.number().min(1).required(),
    method: Joi.string().required(),
    status: Joi.string().required(),
    transactionId: Joi.string().required(),
  });

  return schema.validate(payment);
}

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = { paymentModel, validatePayment };
