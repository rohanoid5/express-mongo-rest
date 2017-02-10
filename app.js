const express = require('express');
const bodyParser = require('body-parser');
const helper = require('./helper.js');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

function campgroud(name, image, description) {
	this.name = name;
	this.image = image;
	this.description = description;
}

let campgroundModel = (name , image) => {
	this.name = name;
	this.image = image;
};

mongoose.connect('mongodb://localhost/campgrounds');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let port = helper.normalizePort(process.env.PORT || '3000');

const campgroundSchema = mongoose.Schema({
	name: String,
	image: String,
	description: String
});

let campgroudModel = mongoose.model('Campgrounds', campgroundSchema);

app.get('/', (req, res) => {
	res.setHeader('content-type', 'application/json');
	res.json("location is root.")
});

app.get('/campgrounds', (req, res) => {
	res.setHeader('content-type', 'application/json');
	campgroudModel.find({}, (err, data) => {
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
	let newCampground = new campgroud(name, image, description);
	campgroudModel.create(
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
	campgroudModel.findById(req.query.id, (err, data) => {
		if(err) res.json(err);
		else {
			res.json(data);
		}
	});
});

app.listen(port, () => {
	console.log("The app has started!");
})