const mongoose = require('mongoose');

const campgroundSchema = mongoose.Schema({
	name: String,
	image: String,
	description: String
});

module.exports = mongoose.model('Campgrounds', campgroundSchema);
