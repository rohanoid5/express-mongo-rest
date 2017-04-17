const mongoose = require('mongoose');

const campgroundSchema = mongoose.Schema({
	name: String,
	image: String,
	description: String,
	like_number: {
		type: Number,
		default: 0
	},
	likes: [
		{ 
			type: mongoose.Schema.Types.ObjectId, 
			ref: "Like"
		}
	],
	timestamp: { 
		type: Date,
		default: Date.now 
	},
	author: {
		id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model('Campgrounds', campgroundSchema);
