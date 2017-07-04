const express = require('express');
const router = express.Router({
    mergeParams: true
});
const user = require('../models/user');
const following = require('../models/followings');
const follower = require('../models/followers');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

function Follower(username, userId, followername) {
    this.username = username;
    this.followername = followername;
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
                    'username': req.user.username,
                    'followername': userData.username,
                },
                (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.json({
                            err: err
                        });
                    } else {
                        console.log("This part");
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
                                    followerData.followername = userData.username;
                                    followerData.save();
                                    userData.followers.push(followerData);
                                    userData.save();

                                    user.findById(req.user.id, (err, anotherData) => {
                                        if (err) {
                                            return res.json({
                                                msg: err
                                            });
                                        } else {
                                            let newFollowing = new Following(req.params.id);
                                            following.create(newFollowing, (err, followingData) => {
                                                if (err) {
                                                    return res.json({
                                                        msg: err
                                                    });
                                                } else {
                                                    followingData.username = userData.username;
                                                    followingData.save();
                                                    anotherData.followings.push(followingData);
                                                    anotherData.save();
                                                    return res.json({
                                                        msg: "Success"
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            // let index = userData.followers.indexOf(data[0]);
                            // if (index > -1) userData.followers.splice(index, 1);

                            let finalCountFollowing = 0;
                            let n1 = userData.followings.length;
                            for (let i = 0; i < n1; i++) {
                                if (userData.followings[i].username == userData.username) {
                                    finalCountFollowing = i;
                                }
                            }

                            user.findById(req.user.id, (err, anotherData) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    anotherData.followings.splice(finalCountFollowing, 1);
                                    anotherData.save();
                                }
                            });

                            let finalCountFollower = 0;
                            let n2 = userData.followers.length;
                            for (let i = 0; i < n2; i++) {
                                if (userData.followers[i].username == req.user.username) {
                                    finalCountFollower = i;
                                }
                            }
                            //console.log(finalCountFollower);
                            userData.followers.splice(finalCountFollower, 1);
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
                                        following.remove({
                                                'username': userData.username
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