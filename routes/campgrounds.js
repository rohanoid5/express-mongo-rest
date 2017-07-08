const express = require('express');
const router = express.Router();
const campground = require('../models/campground');
const user = require('../models/user');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const path = require('path');
const uploadDir = path.join(__dirname, 'public');
const fs = require('fs');

Promise.promisifyAll(mongoose);

cloudinary.config({
    cloud_name: 'rohanoid5',
    api_key: '462891719727313',
    api_secret: '680x09kwLyi96Centh79NWiM3XQ'
});

function Campground(name, image, description, author) {
    this.name = name;
    this.image = image;
    this.description = description;
    this.author = author;
}

router.post('/', isLoggedIn, function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let sampleFile = req.files.image;
    let uploadPath = path.join(uploadDir, sampleFile.name);

    // console.log(req.body.name + " " + req.body.description);

    sampleFile.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).send(err);

        cloudinary.uploader.upload(uploadPath, function(result) {
            // res.send(result);

            fs.unlink("./routes/public/" + sampleFile.name, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');

                    const name = req.body.name;
                    const image = result.secure_url;
                    const description = req.body.description;
                    let author = {
                        id: req.user._id,
                        username: req.user.username
                    };
                    let newCampground = new Campground(name, image, description, author);

                    campground.create(
                        newCampground, (err, cground) => {
                            if (err) {
                                res.status(500).json({ inserted: err })
                            } else {
                                res.status(200).json({ inserted: cground })
                            }
                        }
                    );
                }
            });

        });
    });
});

router.get('/', (req, res) => {
    res.setHeader('content-type', 'application/json');
    campground.find({}).populate("comments").exec((err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ campgrounds: data });
        }
    });
});

// router.post('/', isLoggedIn, (req, res) => {
//     res.setHeader('content-type', 'application/json');

//     if (!req.files)
//         return res.status(400).send('No files were uploaded.');

//     let sampleFile = req.files.image;
//     let uploadPath = path.join(uploadDir, sampleFile.name);

//     sampleFile.mv(uploadPath, function(err) {
//         if (err)
//             return res.status(500).send(err);

//         cloudinary.uploader.upload(uploadPath, function(result) {
//             // res.send(result);

//             fs.unlink("./routes/public/" + sampleFile.name, (err) => {
//                 if (err) {
//                     console.log("failed to delete local image:" + err);
//                 } else {
//                     console.log('successfully deleted local image');

//                     const name = req.body.name;
//                     const image = result.secure_url;
//                     const description = req.body.description;
//                     let author = {
//                         id: req.user._id,
//                         username: req.user.username
//                     };
//                     let newCampground = new Campground(name, image, description, author);
//                     campground.create(
//                         newCampground, (err, cground) => {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 res.json({ inserted: cground })
//                             }
//                         }
//                     );

//                 }
//             });

//         });
//     });
// })

router.get('/profile', isLoggedIn, (req, res) => {
    res.setHeader('content-type', 'application/json');
    campground.find({ 'author.username': req.user.username }, (err, cData) => {
        if (err) {
            res.json({ err: err });
        } else {
            res.json({ data: cData });
        }
    });
});

router.get('/feed', isLoggedIn, (req, res) => {
    res.setHeader('content-type', 'application/json');
    user.findOne({
        'username': req.user.username
    }, (err, data) => {
        if (err)
            res.json({ err: err });
        else {
            var dataArr = [];
            for (let i = 0; i < data.followings.length; i++) {
                dataArr.push(data.followings[i].username)
            }
            var campgroundArr = [];

            for (let i = 0; i < dataArr.length; i++) {

                campground.find({
                    'author.username': dataArr[i]
                }, (err, cData) => {
                    if (err) {
                        res.json({ err: err });
                    } else {
                        //var camp = [];
                        for (let i = 0; i < cData.length; i++) {
                            campgroundArr.push(cData[i]);
                        }
                        //campgroundArr.push(cData);
                    }
                });
            }
            setTimeout(function() {
                res.json({ data: campgroundArr });
            }, 3000);
        }
    });

});

router.get('/search', (req, res) => {
    res.setHeader('content-type', 'application/json');
    campground.findById(req.query.id).populate("comments").exec((err, data) => {
        if (err) res.json(err);
        else {
            res.json(data);
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("Not logged in");
    res.setHeader('content-type', 'application/json');
    res.json({ "status": "Not logged in" });
};

module.exports = router;