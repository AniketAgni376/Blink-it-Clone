const express = require("express");
const router = express.Router();
const { cartModel, validateCart } = require("../models/cart");
const { validateAdmin, userIsLoggedIn } = require("../middlewares/admin");
const { productModel } = require("../models/product");
const mongoose = require("mongoose");

router.get("/", userIsLoggedIn, async function (req, res) {
  try {
    let cart = await cartModel
      .findOne({ user: req.session.passport.user })
      .populate("products");

    let cartDataStructure = {};
    let finalarray = [];
    let finalprice = 0;

    if (cart && cart.products && cart.products.length > 0) {
      cart.products.forEach((product) => {
        let key = product._id.toString();
        if (cartDataStructure[key]) {
          cartDataStructure[key].quantity += 1;
        } else {
          cartDataStructure[key] = {
            ...product._doc,
            quantity: 1,
          };
        }
      });

      finalarray = Object.values(cartDataStructure);
      finalprice = (cart.totalPrice || 0) + 34; // Add delivery (₹30) + handling (₹4) charges
    }

    // Fetch suggested products (products not in cart, limit 3)
    const cartProductIds = finalarray.map(item => item._id);
    const suggestedProducts = await productModel
      .find({ _id: { $nin: cartProductIds } })
      .limit(3)
      .select("name price image");

    res.render("cart", {
      cart: finalarray,
      finalprice: finalprice,
      userid: req.session.passport.user,
      suggestedProducts: suggestedProducts,
    });
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/add/:id", userIsLoggedIn, async function (req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid product id");

    let cart = await cartModel.findOne({ user: req.session.passport.user });
    const product = await productModel.findById(id);
    if (!product) return res.status(404).send("Product not found");

    if (!cart) {
      cart = await cartModel.create({
        user: req.session.passport.user,
        products: [id],
        totalPrice: Number(product.price),
      });
    } else {
      cart.products.push(id);
      cart.totalPrice = Number(cart.totalPrice) + Number(product.price);
      await cart.save();
    }
    res.redirect(req.get("referer") || "/cart");
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/remove/:id", userIsLoggedIn, async function (req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid product id");

    let cart = await cartModel.findOne({ user: req.session.passport.user });
    if (!cart) return res.status(404).send("Cart not found");

    const product = await productModel.findById(id);
    if (!product) return res.status(404).send("Product not found");

    const prodId = cart.products.indexOf(id);
    if (prodId === -1) return res.status(400).send("Item is not in the cart");

    cart.products.splice(prodId, 1);
    cart.totalPrice = Math.max(0, Number(cart.totalPrice) - Number(product.price));
    await cart.save();

    res.redirect(req.get("referer") || "/cart");
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
