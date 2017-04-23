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
  	followers: [
  		{
  			type: mongoose.Schema.Types.ObjectId,
  			ref: "Follower"
  		}
  	],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
