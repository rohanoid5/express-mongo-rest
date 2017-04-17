const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    username: {
        type : String,
        index: true,
        unique: true
    },
    liked: {
        type: Boolean
    },
    campground_id: {
        type: String
    }
});

module.exports = mongoose.model("Like", likeSchema);