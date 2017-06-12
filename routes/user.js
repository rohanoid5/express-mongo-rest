const express = require('express');
const router = express.Router({
  mergeParams: true
});
const user = require('../models/user');
const following = require('../models/followings');
const follower = require('../models/followers');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

function Follower(username, userId) {
  this.username = username;
  // this.userId = userId;
}

function Following(username, userId) {
  this.username = username;
  this.userId = userId;
}

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

router.post('/users/:id/follow', isLoggedIn, (req, res) => {
  res.setHeader('content-type', 'application/json');
  // console.log(req.params.id + " " + req.user.id);
  user.findById(req.params.id, (err, userData) => {
    if (err) {
      return res.json({
        msg: err
      });
    } else {
      let username = req.user.username;
      //let userId = req.user.id;
      let newFollower = new Follower(username);
      follower.find({
          'username': req.user.username
        },
        (err, data) => {
          if (err) {
            console.log(err);
            return res.json({
              err: err
            });
          } else {
            if (data == 0) {
              follower.create(newFollower, (err, followerData) => {
                if (err) {
                  if (err.code == 11000) {
                    return res.json({
                      msg: err
                    });
                  } else {
                    return res.json({
                      msg: err.code
                    });
                  }
                } else {
                  followerData.username = req.user.username;
                  followerData.save();
                  userData.followers.push(followerData);
                  userData.save();
                  return res.json({
                    msg: "Success"
                  });
                }
              });
            } else {
              // let index = userData.followers.indexOf(data[0]);
              // if (index > -1) userData.followers.splice(index, 1);
              let finalCount = 0;
              let n = userData.followers.length;
              for (let i = 0; i < n; i++) {
                if (userData.followers[i].username == req.user.username) {
                  finalCount = i;
                }
              }
              console.log(finalCount);
              userData.followers.splice(finalCount, 1);
              userData.save();
              follower.remove({
                  'username': req.user.username
                },
                (err) => {
                  if (err) {
                    console.log(err);
                    return res.json({
                      err: err
                    });
                  } else {
                    return res.json({
                      msg: "Successfully unfollowed."
                    });
                  }
                });
            }
          }
        });
    }
  });
});

router.get('/likes/:id', isLoggedIn, (req, res) => {
  res.setHeader('content-type', 'application/json');
  like.findById(req.params.id, (err, likeData) => {
    if (err) {
      res.json({
        err: err
      });
    } else {
      res.json({
        data: likeData
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("Not logged in");
  res.setHeader('content-type', 'application/json');
  res.json({
    "status": "Not logged in"
  });
};

module.exports = router;
