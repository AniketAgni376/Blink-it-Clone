const passport = require('passport');
const express = require('express');
const app = express();
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const categoriesRouter = require("./routes/category");
const orderRouter = require("./routes/order");
const paymentRouter = require("./routes/payment");



const userRouter = require("./routes/user");
const cartRouter = require("./routes/cart");
const path = require("path");
const session = require('express-session');
const cookieParser = require('cookie-parser');


require('dotenv').config();
require('./config/db');
require('./config/google_auth_config');

if (
  typeof process.env.NODE_ENV !== "undefined" && 
  process.env.NODE_ENV === "development") {
    console.log("in Development mode");
  }


app.set('view engine', 'ejs');
// Trust proxy when running behind Render/other proxies for correct secure cookies
app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET || "secretKey",
  resave: false,
  saveUninitialized: true,
  cookie: process.env.NODE_ENV === 'production' ? { secure: true, sameSite: 'lax' } : {}
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/categories", categoriesRouter);
app.use("/users", userRouter);
app.use("/cart", cartRouter);
app.use("/payment", paymentRouter);
app.use("/order", orderRouter);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
