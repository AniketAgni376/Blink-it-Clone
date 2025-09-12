const express = require('express');
const app = express();

app.get('/auth/google', function (req, res) {
  res.send('Hello Google Auth!');
});

module.exports = app;