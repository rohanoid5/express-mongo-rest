const express = require('express');
const router = express.Router();
const campground = require('../models/campground');

function Campground(name, image, description, author) {
	this.name = name;
	this.image = image;
	this.description = description;
	this.author = author;
}

router.get('/', (req, res) => {
	res.setHeader('content-type', 'application/json');
	campground.find({}).populate("comments").exec((err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.json({campgrounds: data});
		}
	});
});

router.post('/', isLoggedIn, (req, res) => {
	res.setHeader('content-type', 'application/json');
	const name = req.body.name;
	const image = req.body.image;
	const description = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCampground = new Campground(name, image, description, author);
	campground.create(
		newCampground, (err, cground) => {
			if (err) {
				console.log(err);
			} else {
				res.json({inserted:cground})
			}
		}
	);
})

router.get('/search', (req, res) => {
	res.setHeader('content-type', 'application/json');
	campground.findById(req.query.id).populate("comments").exec((err, data) => {
		if(err) res.json(err);
		else {
			res.json(data);
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