const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    followers: [{
        username: {
            type: String,
            index: true,
            unique: true
        }
    }],
    followings: [{
        username: {
            type: String,
            index: true,
            unique: true
        }
    }],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);