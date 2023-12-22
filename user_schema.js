const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creating_date: {
    type: Date,
    default: Date.now
  },
  login: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("m_user", schema);