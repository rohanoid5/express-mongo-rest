const express = require('express');
const router = express.Router({
  mergeParams: true
});
const user = require('../models/user');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

router.get('/users', (req, res) => {
  res.setHeader('content-type', 'application/json');
  user.find((err, userData) => {
    if (err) {
      res.json({
        err: err
      });
    } else {
      res.json({
        users: userData
      });
    }
  });
});

module.exports = router;
