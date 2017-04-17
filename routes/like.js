const express = require('express');
const router = express.Router({mergeParams: true});
const campground = require('../models/campground');
const like = require('../models/like');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

function Like(liked, author, campId) {
	this.liked = liked;
	this.author = author;
	this.campId = campId;
}

router.post('/campgrounds/:id/likes', isLoggedIn, (req, res) => {
	let count = false;
	res.setHeader('content-type', 'application/json');
	campground.findById(req.params.id, (err, campgroundData) => {
		if(err) {
			console.log(err);
		} else {
			let liked = req.body.liked;
			let author = req.body.author;
			let campId = req.params.id;
			let newlike = new Like(liked, author, campId);

			like.find(
				{
					'username': req.user.username,
					'campground_id': req.params.id
				}, (err, data) => {
				if(err) {
					return res.json({msg : err});
				} else {
					if(data.length == 0) {
						like.create(newlike, (err, likeData) => {
							if(err) {
								console.log(err);
								return res.json({err: err});
							} else {
								likeData.username = req.user.username;
								likeData.campground_id = req.params.id;
								likeData.save();
								campgroundData.likes.push(likeData);
								campgroundData.like_number = campgroundData.likes.length;
								campgroundData.save();
								return res.json({msg: "Successfully liked."});
							}
						});
					} else {

						like.find(
							{
								'username': req.user.username,
								'campground_id': req.params.id
							},
							(err, data) => {
							if(err) {
								console.log(err);
								return res.json({err: err});
							} else {
								let likesArr = campgroundData.likes;
								var index = likesArr.indexOf(data[0]._id);
								if(index > -1) campgroundData.likes.splice(index, 1);
								campgroundData.like_number = campgroundData.likes.length;
								campgroundData.save();
								like.remove(
									{
										'username': req.user.username,
										'campground_id': req.params.id
									},
									(err) => {
									if(err) {
										console.log(err);
										return res.json({err: err});
									} else {
										return res.json({msg: "Successfully disliked."});
									}
								});
								//return res.json({index: index});
							}
						});
					}
				}
			});
			
			// like.create(newlike, (err, likeData) => {
			// 	if(err) {
			// 		console.log(err);
			// 		return res.json({err: err});
			// 	} else {
			// 		likeData.username = req.user.username;
			// 		likeData.save();
			// 		campgroundData.likes.push(likeData);
			// 		campgroundData.save();
			// 		res.json({msg: "Successfully liked."});
			// 	}
			// });
			// likeList.forEach((eachLike) => {
				
			// });
			// for(let i = 0; i < likeList.length; i++) {
			// 	like.findById(likeList[i], (err, likeData) => {
			// 		if(err) {
			// 			return console.log(err);
			// 		} else {
			// 			let a = JSON.stringify(req.user._id);
			// 			let b = JSON.stringify(likeData.author.id);
			// 			console.log(a + " " + b);
			// 			if(a == b) {
			// 				console.log("Yes");
			// 				count = true;
			// 				console.log(count);
			// 			}
			// 		}
			// 	});
			// }

			// if(!count) {
			// 	like.create(newlike, (err, likeData) => {
			// 		if(err) {
			// 			console.log(err);
			// 			return res.json({err: err});
			// 		} else {
			// 			likeData.author.id = req.user._id;
			// 			likeData.author.username = req.user.username;
			// 			likeData.save();
			// 			campgroundData.likes.push(likeData);
			// 			campgroundData.save();
			// 			res.json({msg: "Successfully liked."});
			// 		}
			// 	});
			// } else {
			// 	res.json({msg: "Already liked"});
			// }
		}
	});
});

router.get('/likes/:id', isLoggedIn, (req, res) => {
	res.setHeader('content-type', 'application/json');
	like.findById(req.params.id, (err, likeData) => {
		if(err) {
			res.json({err: err});
		} else {
			res.json({data: likeData});
		}
	});
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  console.log("Not logged in");
  res.setHeader('content-type', 'application/json');
  res.json({"status": "Not logged in"});
};

module.exports = router;