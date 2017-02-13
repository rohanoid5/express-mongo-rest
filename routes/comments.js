const express = require('express');
const router = express.Router({mergeParams: true});
const campground = require('../models/campground');
const comment = require('../models/comment');

function Comment(text, author) {
	this.text = text;
	this.author = author;
}

router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
	res.setHeader('content-type', 'application/json');
	campground.findById(req.params.id, (err, campgroundData) => {
		if(err) {
			console.log(err);
		} else {
			const text = req.body.text;
			const author = req.body.author;
			let newComment = new Comment(text, author);
			comment.create(newComment, (err, commentData) => {
				if(err) {
					console.log(err);
					res.json({err: err});
				} else {
					commentData.author.id = req.user._id;
					commentData.author.username = req.user.username;
					commentData.save();
					campgroundData.comments.push(commentData);
					campgroundData.save();
					//console.log(commentData);
					res.json({inserted: commentData});
				}
			});
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