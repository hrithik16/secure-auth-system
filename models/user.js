const mongoose = require("mongoose");

const User = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const user = mongoose.model("User", User);

module.exports = user;
