const express = require('express');
const bodyParser = require('body-parser');
const helper = require('./helper/helper.js');
const mongoose = require('mongoose');
const campground = require('./models/campground');
const comment = require('./models/comment');
const seedDb = require('./helper/seed');

function Campground(name, image, description) {
	this.name = name;
	this.image = image;
	this.description = description;
}

function Comment(text, author) {
	this.text = text;
	this.author = author;
}

seedDb();

mongoose.connect('mongodb://localhost/campgrounds');
mongoose.Promise = require('bluebird');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let port = helper.normalizePort(process.env.PORT || '3000');

app.get('/', (req, res) => {
	res.setHeader('content-type', 'application/json');
	res.json("location is root.")
});

app.get('/campgrounds', (req, res) => {
	res.setHeader('content-type', 'application/json');
	campground.find({}).populate("comments").exec((err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.json({campgrounds: data});
		}
	});
});

app.post('/campgrounds', (req, res) => {
	res.setHeader('content-type', 'application/json');
	const name = req.body.name;
	const image = req.body.image;
	const description = req.body.description;
	let newCampground = new Campground(name, image, description);
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

app.get('/campgrounds/search', (req, res) => {
	res.setHeader('content-type', 'application/json');
	campground.findById(req.query.id).populate("comments").exec((err, data) => {
		if(err) res.json(err);
		else {
			res.json(data);
		}
	});
});

app.post('/campgrounds/:id/comments', (req, res) => {
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
					campgroundData.comments.push(commentData);
					campgroundData.save();
					res.json({inserted: commentData});
				}
			});
		}
	});
});

app.listen(port, () => {
	console.log("The app has started!");
})