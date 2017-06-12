const mongoose = require('mongoose');

const followerSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true
    },
    follower_id: {
        type: String
    },
    followername: {
        type: String
    },
});

module.exports = mongoose.model("Follower", followerSchema);