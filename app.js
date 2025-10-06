const passport = require('passport');
const express = require('express');
const app = express();
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const path = require("path");
const session = require('express-session');
const cookieParser = require('cookie-parser');


require('dotenv').config();
require('./config/db');
require('./config/google_auth_config');

if (
  typeof process.env.NODE_ENV !== "undefined" && 
  process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("in Development mode");
  }


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET || "secretKey",
  resave: false,
  saveUninitialized: true,
}));

app.use(cookieParser());


app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

app.listen(3000);
