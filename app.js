const passport = require('passport');
const express = require('express');
const app = express();
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const path = require("path");
const session = require('express-session');


require('dotenv').config();
require('./config/db');
require('./config/google_auth_config');


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET || "secretKey",
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/auth', authRouter);

app.listen(3000);
