const express = require('express');
const bodyParser = require('body-parser');
const helper = require('./helper/helper.js');
const mongoose = require('mongoose');
const campground = require('./models/campground');
const comment = require('./models/comment');
const seedDb = require('./helper/seed');
const passport = require('passport');
const localStrategy = require('passport-local');
const user = require('./models/user');

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

app.use(require('express-session')({
	secret: 'I am a psychopath!!',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


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

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

app.post('/register', (req, res) => {
	res.setHeader('content-type', 'application/json');
	let newUser = new user({username: req.body.username});
	user.register(newUser, req.body.password, (err, userData) => {
		if(err) console.log(err);
		else {
			passport.authenticate('local')(req, res, () => {
				res.json({user: userData});
			});
		}
	});
});

app.post('/login', passport.authenticate('local'), (req, res) => {
	res.setHeader('content-type', 'application/json');
	res.json({"status": "ok"});
});

app.get('/logout', (req, res) => {
	req.logout();
	res.setHeader('content-type', 'application/json');
  res.json({"status": "Logged out"});
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  console.log("Not logged in");
  res.setHeader('content-type', 'application/json');
  res.json({"status": "Not logged in"});
};

app.listen(port, () => {
	console.log("The app has started!");
});