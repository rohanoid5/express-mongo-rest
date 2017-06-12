const mongoose = require('mongoose');

const followingSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true
  },
  following_id: {
    type: String
  }
});

module.exports = mongoose.model("Following", followingSchema);
