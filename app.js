const express = require('express');
const bodyParser = require('body-parser');
const helper = require('./helper/helper.js');
const mongoose = require('mongoose');
const campground = require('./models/campground');
const seedDb = require('./helper/seed');

function Campground(name, image, description) {
	this.name = name;
	this.image = image;
	this.description = description;
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
	campground.find({}, (err, data) => {
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
	let newCampground = new Campgroud(name, image, description);
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
	campground.findById(req.query.id, (err, data) => {
		if(err) res.json(err);
		else {
			res.json(data);
		}
	});
});

app.listen(port, () => {
	console.log("The app has started!");
})