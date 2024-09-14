const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  slot: {
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
  },
});

const user = mongoose.model("user", userSchema);

module.exports = { user };
