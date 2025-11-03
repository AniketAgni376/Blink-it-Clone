require("dotenv").config();
const { paymentModel } = require("../models/payment");
const Razorpay = require("razorpay");
const { cartModel } = require("../models/cart");
const { userIsLoggedIn } = require("../middlewares/admin");

const express = require("express");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create/orderId", userIsLoggedIn, async (req, res) => {
  try {
    // Compute amount from the user's cart (subtotal + delivery/handling if applicable)
    const cart = await cartModel
      .findOne({ user: req.session.passport.user })
      .populate("products");

    let subtotal = 0;
    if (cart && Array.isArray(cart.products) && cart.products.length > 0) {
      // `totalPrice` is already maintained; trust it as subtotal
      subtotal = Number(cart.totalPrice) || 0;
    }
    const finalTotal = subtotal > 0 ? subtotal + 34 : 0; // match UI logic
    if (finalTotal <= 0) return res.status(400).send("Cart is empty");

    const options = {
      amount: Math.round(finalTotal * 100), // to paise
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    res.send(order);

    const newPayment = await paymentModel.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "pending",
    });
  } catch (error) {
    res.status(500).send("Error creating order");
  }
});

router.post("/api/payment/verify", async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const {
      validatePaymentVerification,
    } = require("../node_modules/razorpay/dist/utils/razorpay-utils.js");

    const result = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret
    );
    if (result) {
      const payment = await paymentModel.findOne({
        orderId: razorpayOrderId,
        status: "pending",
      });
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = "completed";
      await payment.save();
      res.json({ status: "success" });
    } else {
      res.status(400).send("Invalid signature");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error verifying payment");
  }
});

module.exports = router;
